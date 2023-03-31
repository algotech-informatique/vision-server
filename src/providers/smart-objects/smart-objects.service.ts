import { Injectable, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, of, from, throwError, zip, concat } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    SmartObjectGeoBoxDto,
    GeoPOIDto, PatchPropertyDto, SmartObjectDto, GeoSettingsDto, PatchService, SearchSODto, ImportSoDto, ImportSoResultDto, ImportOptionsDto, SmartModelDto, SmartPropertyModelDto,
} from '@algotech-ce/core';
import { mergeMap, map, catchError, toArray, first } from 'rxjs/operators';
import * as _ from 'lodash';
import { IdentityRequest, SettingsData, SmartModel, SmartObject, SmartPropertyModel, SmartPropertyObject } from '../../interfaces';
import { SettingsDataService } from '../../providers/@base/settings-data.service';
import { SearchHead } from '../../providers/search/search.head';
import { UUID } from 'angular2-uuid';
import { UtilsService } from '../utils/utils.service';
import { SoUtilsService } from '../workflow-interpretor/@utils/so-utils.service';
import { ModuleRef } from '@nestjs/core';
import { ProcessMonitoringService } from '../process-monitoring/process-monitoring.service';
import { ProcessMonitoring } from '../../interfaces/process-monitoring/process-monitoring.interface';
import { SmartObjectsBaseService } from './smart-objects.base.service';
interface ICache {
    models: SmartModel[];
    objects: SmartObjectDto[];
    options: { deep: boolean, composition?: boolean };
    level: number;
}
@Injectable()
export class SmartObjectsService extends SmartObjectsBaseService {
    constructor(
        @Inject(forwardRef(() => SoUtilsService))
        private readonly soUtilsService: SoUtilsService,
        @InjectModel('SmartObject') protected readonly smartObjectModel: Model<SmartObject>,
        protected http: HttpService,
        protected readonly settingsData: SettingsDataService,
        private readonly processMonitoringService: ProcessMonitoringService,
        private readonly settingsDataService: SettingsDataService,
        private readonly searchHead: SearchHead,
        private readonly utils: UtilsService,) {

        super(smartObjectModel, settingsDataService);
    }

    createSO(identity: IdentityRequest, object: SmartObject): Observable<SmartObject> {
        return zip(
            object.uuid ? this.uuidExists(identity.customerKey, object.uuid) : of(false),
            this.isUnique(identity, object),
        ).pipe(
            mergeMap((res: boolean[]) => {
                if (res[0] === true) {
                    throw new BadRequestException(`uuid already exists (${object.uuid})`);
                } else if (res[1] === false) {
                    throw new BadRequestException(`unique constraint violated`);
                } else {
                    return this.create(identity.customerKey, object, true);
                }
            }),
        );
    }

    doUpdate(identity: IdentityRequest, dto: SmartObject, upsert?: boolean): Observable<SmartObject> {
        return this.isUnique(identity, dto).pipe(
            mergeMap((unique: boolean) => {
                if (unique === false) {
                    throw new BadRequestException(`unique constraint violated`);
                }
                return super.update(identity.customerKey, dto, upsert);
            }),
        );
    }

    doPatchProperty(identity: IdentityRequest, id: string, patchesProperty: PatchPropertyDto[]): Observable<{ oldDocuments, after: SmartObject }> {

        let oldDocuments = [];
        let smartObjectAfter: SmartObject = null;

        // transaction
        return this.findOne(identity.customerKey, id).pipe(
            mergeMap((smartObjectBefore: SmartObject) => {
                oldDocuments = (smartObjectBefore && smartObjectBefore.skills &&
                    smartObjectBefore.skills.atDocument && smartObjectBefore.skills.atDocument.documents) ? smartObjectBefore.skills.atDocument.documents : [];
                smartObjectAfter = new PatchService<SmartObject>().recompose(patchesProperty, smartObjectBefore);
                return this.isUnique(identity, smartObjectAfter);
            }),
            mergeMap((unique: boolean) => {
                if (!unique) {
                    throw new Error(`unique constraint violated`);
                }
                return this.patchAndFormatProperty(identity.customerKey, smartObjectAfter, patchesProperty);
            }),
            mergeMap(() => (of({ oldDocuments, after: smartObjectAfter })))
        );
    }

    doDelete(identity: IdentityRequest, id: string, real?: boolean): Observable<boolean> {
        // detach so
        console.log('doDelete')
        return this.findSubDocByUuid(identity.customerKey, id, { deep: true, excludeRoot: false, composition: true, includeDeleted: real }).pipe(
            mergeMap((smartObjects: SmartObjectDto[]) => concat(this.detachSmartObject(identity, id), of(smartObjects))),
            toArray(),
            catchError((err) => of([false])),
            mergeMap((data) => {
                console.log('je passe ici')
                const rootDetached = data[0]
                if (!rootDetached) {
                    throwError(() => new Error('error in  detachSmartObject'));
                }
                const smartObjects = data[1];

                console.log('je passe ici', JSON.stringify((smartObjects as SmartObject[]).map((so) => so.uuid)))
                const $obsDelete: Observable<string>[] = _.reduce(smartObjects, (results, so: SmartObject) => {
                    if (so.uuid !== id) {
                        results.push(this.findByProperty(identity, so.uuid).pipe(
                            mergeMap((res: SmartObject[]) => {
                                return res?.length === 0 ?
                                    super.delete(identity.customerKey, so.uuid, real) : of({});
                            }),
                        ))
                    } else {
                        console.log('delete so: ' + so.uuid);
                        results.push(super.delete(identity.customerKey, so.uuid, real));
                    }
                    return results;
                }, []);
                return $obsDelete.length === 0 ? of({}) : concat(...$obsDelete);
            }),
            toArray(),
            catchError((err) => throwError(() => new Error('an error occurred when deleting smart object ' + err))),
            map(() => true),
        )
    }

    deleteAll(customerKey: string, modelKey: string, deleted: boolean, real?: boolean) {
        const options = [];
        const filter = deleted ? { customerKey, modelKey, deleted: true } :
            modelKey ? { customerKey, modelKey } : { customerKey };
        if (real) {
            options.push({
                deleteMany: {
                    filter
                }
            });
        } else {
            options.push({
                updateMany: {
                    filter,
                    update: { deleted: true, updateDate: new Date().toISOString() }
                }
            });
        }
        if (!deleted && modelKey) {
            return this.settingsDataService.getContext().pipe(
                mergeMap((context: SettingsData) => {
                    const modelstoUpdate = _.reduce(context.smartmodels, (cumul, smartModel: SmartModelDto) => {
                        if (smartModel.key !== modelKey) {
                            const properties = smartModel.properties.filter((property: SmartPropertyModelDto) => property.keyType === `so:${modelKey}`);
                            if (properties.length !== 0) {
                                cumul.push({
                                    modelKey: smartModel.key,
                                    properties
                                })
                            }
                        }
                        return cumul;
                    }, []);
                    const updates = _.flatten(modelstoUpdate.map(model => model.properties.map((property: SmartPropertyModelDto) => ({
                        updateMany: {
                            filter: { modelKey: model.modelKey },
                            update: { $set: { [`properties.${property.key}`]: property.multiple ? [] : null, updateDate: new Date().toISOString() } }
                        }
                    }))));
                    return from(this.smartObjectModel.bulkWrite([...options, ...updates])).pipe(
                        catchError(err => {
                            return of({ deletedCount: -1, modifiedCount: 0 })
                        }),
                        map(res => res.deletedCount + res.modifiedCount)
                    );
                }),
            )
        }
        return from(this.smartObjectModel.bulkWrite(options)).pipe(
            catchError(err => {
                return of({ deletedCount: -1, modifiedCount: 0 })
            }),
            mergeMap((res) => {
                return of(res.deletedCount + res.modifiedCount);
            })
        );
    }

    restore(customerKey: string, modelKey: string, uuids: string[]) {

        const options = [];
        if (uuids.length === 0) {
            const filter = modelKey ? { customerKey, deleted: true, modelKey } : { customerKey, deleted: true }
            options.push({
                updateMany: {
                    filter,
                    update: { deleted: false, updateDate: new Date().toISOString() }
                }
            });
        } else {
            options.push({
                updateMany: {
                    filter: { customerKey, uuid: { $in: uuids } },
                    update: { deleted: false, updateDate: new Date().toISOString() }
                }
            });
        }

        return from(this.smartObjectModel.bulkWrite(options)).pipe(
            map((res) => {
                return res.modifiedCount;
            })
        );
    }

    detachSmartObject(identity: IdentityRequest, uuid: string) {
        // find all the so which contains uuid
        return this.findByProperty(identity, uuid).pipe(
            mergeMap((smartObjects: SmartObject[]) => {
                return of(_.reduce(smartObjects,
                    (grpPatches: { smartObject: SmartObject, patches: PatchPropertyDto[] }[], smartObject: SmartObject) => {
                        const patches = _.reduce(smartObject.properties,
                            ($patches: PatchPropertyDto[], property: SmartPropertyObject) => {
                                if (property.value) {
                                    if (_.isArray(property.value)) {
                                        while (property.value.indexOf(uuid) > -1) {
                                            property.value.splice(property.value.indexOf(uuid), 1);
                                        }
                                        const patchProperty: PatchPropertyDto = {
                                            op: 'replace',
                                            path: `/properties/[key:${property.key}]/value`,
                                            value: property.value,
                                        };
                                        $patches.push(patchProperty);
                                    } else {
                                        if (property.value === uuid) {
                                            const patchProperty: PatchPropertyDto = {
                                                op: 'replace',
                                                path: `/properties/[key:${property.key}]/value`,
                                                value: null,
                                            };
                                            $patches.push(patchProperty);
                                        }
                                    }
                                }
                                return $patches;
                            }, []);
                        if (patches.length > 0) {
                            grpPatches.push({
                                smartObject,
                                patches,
                            });
                        }
                        return grpPatches;
                    }, []));
            }),
            mergeMap((data: { smartObject: SmartObject, patches: PatchPropertyDto[] }[]) => {
                const obsDetach = _.map(data, (item) => {
                    return this.doPatchProperty(identity, item.smartObject.uuid, item.patches);
                });
                return obsDetach.length === 0 ? of({}) : zip(...obsDetach);
            }),
            map(() => true),
            first(),
        );
    }

    import(identity: IdentityRequest, file: Buffer, content: ImportSoDto): Observable<{ success: boolean }> {
        let smartModel;
        const options: ImportOptionsDto = content.options ? JSON.parse(content.options) : {};
        // todo control format  

        return this.findModel(content.modelKey).pipe(
            mergeMap((res: SmartModel) => {
                smartModel = res;
                if (!smartModel) {
                    return throwError(() => new BadRequestException(`smart model ${content.modelKey} unknown`));
                }

                return this.soUtilsService.csvToSo(file, smartModel, options);
            }),
            map((smartObjects: SmartObjectDto[]) => {

                const chunk: SmartObjectDto[][] = _.chunk(smartObjects, 250);
                const monitoring: ProcessMonitoring = {
                    uuid: content.uuid,
                    customerKey: identity.customerKey,
                    deleted: false,
                    processState: 'inProgress',
                    processType: 'importSos',
                    current: 0,
                    total: smartObjects.length,
                    result: {}
                };
                const importResult: ImportSoResultDto = {
                    nbInserted: 0,
                    nbUpdated: 0,
                    nbIgnored: 0
                };

                this.processMonitoringService.create(identity.customerKey, monitoring, true).pipe(
                    mergeMap(() => concat(...
                        chunk.map((items: SmartObjectDto[]) =>
                            this._doImport(identity, smartModel, items, this.utils.strToBool(content.replaceExisting))
                        )
                    )),
                    catchError((e) => {
                        return this.processMonitoringService.update(identity.customerKey,
                            Object.assign(monitoring,
                                {
                                    processState: 'error'
                                })).pipe(
                                    mergeMap(() => throwError(() => e))
                                );
                    }),
                    mergeMap((res) => {
                        importResult.nbInserted += res.nbInserted;
                        importResult.nbUpdated += res.nbUpdated;
                        importResult.nbIgnored += res.nbIgnored;
                        return this.processMonitoringService.update(identity.customerKey,
                            Object.assign(monitoring,
                                {
                                    current: importResult.nbInserted + importResult.nbIgnored + importResult.nbUpdated
                                })).pipe(
                                    map(() => importResult)
                                );
                    }),
                    toArray(),
                    mergeMap(() => {
                        return this.processMonitoringService.update(identity.customerKey,
                            Object.assign(monitoring,
                                {
                                    processState: 'succeeded',
                                    current: importResult.nbInserted + importResult.nbIgnored + importResult.nbUpdated,
                                    result: importResult
                                })).pipe(
                                    map(() => importResult)
                                );
                    })
                ).subscribe();

                return { success: true };
            }),
        );
    }

    _hasSimilarInchunck(smartObject: SmartObjectDto, sm: SmartModel, chunck: SmartObjectDto[]): SmartObjectDto | null {
        if (!sm || !sm.uniqueKeys || sm.uniqueKeys.length === 0) {
            return null;
        }
        const getUniqueKey = (Obj: SmartObjectDto, keys: string[]) => (keys.map(key => {
            const prop = Obj.properties.find(p => p.key === key);
            return prop ? prop.value : '';
        })).join('');
        const soKey = getUniqueKey(smartObject, sm.uniqueKeys);
        return chunck.find(so => {
            const key = getUniqueKey(so, sm.uniqueKeys);
            return key === soKey;
        })
    }

    _doImport(identity: IdentityRequest, smartModel: SmartModel, smartObjects: SmartObjectDto[], replaceExisting: boolean): Observable<ImportSoResultDto> {
        if (smartObjects.length === 0) {
            return of({
                nbUpdated: 0,
                nbInserted: 0,
                nbIndexed: 0,
                nbIgnored: 0,
            });
        }

        let nbInserted = 0;
        let nbUpdated = 0;
        let nbIgnored = 0;
        const indexSmartObjects: SmartObjectDto[] = [];

        return this.exists(identity, smartModel, smartObjects).pipe(
            map((res) => {
                return res.reduce((results, uuid, index) => {
                    const smartObject = smartObjects[index];
                    //find similar Object already added to indexSmartObjects
                    const similar = this._hasSimilarInchunck(smartObject, smartModel, indexSmartObjects);
                    if (!replaceExisting && (uuid.old || similar)) {
                        nbIgnored++
                        return results;
                    }

                    if (uuid.old) {
                        smartObject.uuid = uuid.old;
                        nbUpdated++;
                    } else {
                        smartObject.uuid = similar ? similar.uuid : UUID.UUID();
                        smartObject.createdDate = new Date().toISOString();
                        nbInserted++;
                    }

                    indexSmartObjects.push(smartObject);

                    results.push({
                        updateOne: {
                            filter: { uuid: smartObject.uuid },
                            upsert: true,
                            update: {
                                ...(this.toDB(this.formatSmartObjectAsync(smartObject as SmartObject, smartModel))),
                                customerKey: identity.customerKey,
                                deleted: false,
                                updateDate: new Date().toISOString(),
                            }
                        }
                    });

                    return results;
                }, [])
            }),
            catchError(() => {
                return throwError(() => new BadRequestException({
                    message: `failed to check exists`,
                }));
            }),
            mergeMap((requests) => from(this.smartObjectModel.bulkWrite(requests, { ordered: true }))),
            map((res) => {
                const total = res.nUpserted + res.nInserted + res.nModified;
                if (total < (indexSmartObjects.length)) {
                    throw new BadRequestException({
                        message: `failed to write mongodb`,
                        indexError: total - 1,
                    });
                }
                return;
            }),
            map(() => {
                return {
                    nbUpdated,
                    nbInserted,
                    nbIgnored,
                }
            }),
        )
    }

    exists(identity: IdentityRequest, smartModel: SmartModel, smartObjects: SmartObjectDto[]):
        Observable<{ new: string, old?: string }[]> {
        return zip(...smartObjects.map((smartObject) => this.requestExists(identity, smartObject as SmartObject))).pipe(
            map((existsSo: SmartObject[]) => {
                return smartObjects.reduce((results, so, index) => {
                    if (existsSo[index]) {
                        results.push({ new: so.uuid, old: existsSo[index].uuid });
                    } else {
                        results.push({ new: so.uuid });
                    }
                    return results;
                }, [])
            })
        );
    }

    requestExists(identity: IdentityRequest, smartObject: SmartObject) {
        return this.settingsDataService.getContext().pipe(
            mergeMap((constext: SettingsData) => {
                const sm: SmartModel = _.find(constext.smartmodels, s => s.key === smartObject.modelKey);
                if (!sm || !sm.uniqueKeys || sm.uniqueKeys.length === 0) {
                    return of(null);
                }

                const matches = _.reduce(sm.uniqueKeys, (results, key) => {
                    const findProperty = _.find(smartObject.properties, (prop) => prop.key === key);
                    if (findProperty.value) {
                        results.push({
                            key,
                            value: findProperty.value,
                        });
                    }
                    return results;
                }, []);
                if (matches.length === 0) {
                    return of(null);
                }

                const query: SearchSODto = {
                    modelKey: sm.key,
                    filter: _.map(matches, prop => ({
                        key: prop.key,
                        value: {
                            criteria: 'equals',
                            type: 'string',
                            value: prop.value
                        },
                    })),
                    order: []
                }

                return this.searchHead.searchSo(identity, 0, 1, '', query, false);
            }),
            catchError((err) => throwError(() => new Error(`error check exists: ${err}`))),
            map((search) => (search as SmartObjectDto[])?.length > 0 ? search[0] : null),
        );
    }

    isUnique(identity: IdentityRequest, smartObject: SmartObject): Observable<boolean> {
        return this.requestExists(identity, smartObject).pipe(
            mergeMap((so) => of(!so || so.uuid === smartObject.uuid)),
        );
    }

    uuidExists(customerKey: string, id: string): Observable<boolean> {
        const findSmartObject: Observable<SmartObject> = super.findOne(customerKey, id);
        return findSmartObject.pipe(
            mergeMap(smartObject => {
                return of(smartObject ? true : false);
            }),
        );
    }

    findOne(customerKey: string, id: string): Observable<SmartObject> {
        const findSmartObject: Observable<SmartObject> = super.findOne(customerKey, id);
        return findSmartObject.pipe(
            mergeMap(smartObject => {
                if (smartObject) {
                    return of(smartObject);
                } else {
                    throw new BadRequestException(`smart object ${id} unknown`);
                }
            }),
        );
    }

    findSubDocByUuids(customerKey: string, ids: string[], options: { deep: boolean, excludeRoot: boolean, composition?: boolean }): Observable<SmartObjectDto[]> {
        const cache: ICache = { models: [], objects: [], options, level: 0 };

        return this._compose(customerKey, ids.map((id: string) => ({ id, browse: true })), cache, false).pipe(
            map(() => {
                if (options.excludeRoot) {
                    return _.reject(cache.objects, (so) => ids.includes(so.uuid))
                }
                return cache.objects;
            }),
            map((smartObjects: SmartObjectDto[]) => _.uniqBy(smartObjects, 'uuid')),
        );
    }

    findSubDocByUuid(customerKey: string, id: string, options: { deep: boolean, excludeRoot: boolean, composition?: boolean, includeDeleted: boolean }): Observable<SmartObjectDto[]> {
        const cache: ICache = { models: [], objects: [], options, level: 0 };

        return this._compose(customerKey, [{ id, browse: true }], cache, options.includeDeleted).pipe(
            map(() => {
                if (options.excludeRoot) {
                    return _.reject(cache.objects, (so) => id === so.uuid)
                }
                return cache.objects;
            }),
            map((smartObjects: SmartObjectDto[]) => _.uniqBy(smartObjects, 'uuid'))
        );
    }

    findSubDocBySmartObjects(customerKey: string, smartObjects: SmartObjectDto[], options: { deep: boolean, excludeRoot: boolean, composition?: boolean }) {
        const cache: ICache = { models: [], objects: [...smartObjects], options, level: 0 };

        if (smartObjects.length === 0) {
            return of([]);
        }

        return this._composeObjects(customerKey, smartObjects, cache, false).pipe(
            map(() => {
                if (options.excludeRoot) {
                    return _.differenceBy(cache.objects, smartObjects, 'uuid');
                }
                return cache.objects;
            }),
            map((smartObjects: SmartObjectDto[]) => _.uniqBy(smartObjects, 'uuid')),
        );
    }

    private _compose(customerKey: string, idents: { id: string, browse: boolean }[], cache: ICache, includeDeleted: boolean): Observable<any> {
        const pointer = {};
        for (const obj of cache.objects) {
            pointer[obj.uuid] = obj;
        }
        const _idents = idents.filter((v) => !pointer[v.id]);

        if (_idents.length === 0) {
            return of({});
        }

        return this.findByUuids(customerKey, _idents.map((ids) => ids.id), 'include', 0, _idents.length, false, includeDeleted).pipe(
            mergeMap((smartObjects: SmartObjectDto[]) => {

                cache.objects.push(...smartObjects);

                if (!cache.options.deep && cache.level === 1) {
                    return of({});
                }

                const nextLevel = smartObjects.filter((smartObject, index) => {
                    return idents[index]?.browse;
                });

                if (nextLevel.length === 0) {
                    return of({});
                }

                return this._composeObjects(customerKey, nextLevel, cache, includeDeleted);
            }),
            catchError((err) => {
                return throwError(() => err);
            }),
            map(() => { }),
        );
    }

    private _composeObjects(customerKey: string, smartObjects: SmartObjectDto[], cache: ICache, includeDeleted: boolean): Observable<any> {
        const models = _.uniqBy(smartObjects, 'modelKey').map((smartObject) => smartObject.modelKey);
        return zip(
            ...models.map((modelKey) => this._composeModel(customerKey, modelKey.replace('so:', ''), cache))
        ).pipe(
            map((smartModels: SmartModel[]) => smartObjects.map((smartObject) => {
                const smartModel = smartModels.find((sm) => sm.key.toUpperCase() === smartObject.modelKey.toUpperCase());
                if (!smartModel) {
                    throw new Error('smart model not find ' + smartObject.modelKey);
                }

                return {
                    smartObject,
                    properties: smartModel.properties.filter((prop) => prop.keyType.startsWith('so:'))
                }
            })),
            mergeMap((data: { smartObject: SmartObject, properties: SmartPropertyModel[] }[]) => {

                const newIdents: { id: string, browse: boolean }[] = data.reduce((results, item) => {
                    results.push(...this._composeObjectsBrowse(item.smartObject, item.properties, cache));
                    return results;
                }, []);

                if (newIdents.length === 0) {
                    return of({});
                }

                return this._compose(customerKey, newIdents, cache, includeDeleted);
            }),
        );
    }

    private _composeObjectsBrowse(smartObject: SmartObject, properties: SmartPropertyModel[], cache: ICache) {
        const idents: { id: string, browse: boolean }[] = properties.reduce((results, prop: SmartPropertyModel) => {
            const propInstance = smartObject.properties.find((p) => p.key.toUpperCase() === prop.key.toUpperCase());

            if (cache.options.composition && !prop.composition) {
                return results;
            }

            if (!propInstance) {
                return results;
            }

            if (!propInstance.value) {
                return results;
            }
            const values = prop.multiple ? propInstance.value : [propInstance.value];
            results.push(...
                values
                    .filter((id) => id && !cache.objects.find((so) => so.uuid === id))
                    .map((value) => {
                        return {
                            id: value,
                            browse: !prop.multiple,
                        };
                    }));

            return results;
        }, []);

        cache.level++;
        return idents;
    }

    private _composeModel(customerKey: string, modelKey: string, cache: ICache): Observable<SmartModel> {
        const smartModel = cache.models.find((sm) => sm.key.toUpperCase() === modelKey.toUpperCase());
        if (smartModel) {
            return of(smartModel);
        } else {
            return this.settingsData.getContext().pipe(
                map((context) => {
                    cache.models.push(...context.smartmodels as SmartModel[]);
                    const sm = context.smartmodels.find((sm) => sm.key.toUpperCase() === modelKey.toUpperCase()) as SmartModel;
                    return sm;
                })
            )
        }
    }

    findByModel(customerKey: string, modelKey: string): Observable<SmartObject[]> {
        return from(
            this.smartObjectModel.find({ modelKey, customerKey, deleted: false }, { _id: 0, __v: 0 }).lean(),
        ).pipe(
            map((objects) => this.toDTO(objects) as SmartObject[])
        )
    }

    findByDocUuid(customerKey: string, uuid: string): Observable<SmartObject[]> {
        return from(
            this.smartObjectModel.find({
                customerKey,
                'deleted': false,
                'skills.atDocument.documents': { $elemMatch: { $in: [uuid] } },
            }, { _id: 0, __v: 0 }),
        ).pipe(
            map((objects) => this.toDTO(objects) as SmartObject[])
        )
    }

    distinctByDocUuid(customerKey: string, uuid: string): Observable<string[]> {
        return from(
            this.smartObjectModel.distinct('modelKey', {
                customerKey,
                'deleted': false,
                'skills.atDocument.documents': { $elemMatch: { $in: [uuid] } },
            }),
        ) as Observable<string[]>;
    }

    findByUuids(customerKey: string, $idents: string[], type: 'include' | 'exclude', skip: number, limit: number, keepOrder = true, includeDeleted = false)
        : Observable<SmartObject[]> {

        if ($idents.length === 0) {
            return of([]);
        }

        let obsList: Observable<SmartObject[]>;
        const aggregates: any = [];
        if (type === 'include') {
            aggregates.push({ $match: _.assign({ customerKey }, includeDeleted ? {} : { deleted: false }, { uuid: { $in: $idents } }) });
        } else {
            aggregates.push({ $match: _.assign({ customerKey }, includeDeleted ? {} : { deleted: false }, { uuid: { $nin: $idents } }) });
        }
        aggregates.push({ $project: { _id: 0, __v: 0, customerKey: 0, deleted: 0, } });

        aggregates.push(
            { $skip: skip * limit },
            { $limit: limit });
        obsList = this.aggregate(aggregates);
        return obsList.pipe(
            mergeMap((res: SmartObject[]) => {
                if (keepOrder) {
                    const pointerMongo = {};

                    for (const item of res) {
                        pointerMongo[item.uuid] = item;
                    }
                    return of(_.reduce($idents, (results, uuid) => {
                        const so = pointerMongo[uuid];
                        if (so) {
                            results.push(so)
                        }
                        return results;
                    }, []));
                } else {
                    return of(res);
                }
            })
        );
    }

    findByFilter(customerKey: string, findFilter: any, skip: number, limit: number, order?: string | number, sort?: string)
        : Observable<SmartObject[]> {
        const aggregates: any = [
            { $match: _.assign({ customerKey }, { deleted: false }, findFilter) },
        ];

        if (sort) {
            order = (!order || order === 'desc' || order === -1) ? -1 : 1;
            if (sort === 'sys:updateDate' || sort === 'sys:createdDate') {
                aggregates.push(
                    sort === 'sys:updateDate' ? { $sort: { updateDate: order } } :
                        { $sort: { createdDate: order } });
            } else {
                aggregates.push(
                    { $sort: { [`properties.${sort}`]: order } }
                );
            }
        }
        if (limit >= 0) {
            aggregates.push(
                { $skip: skip * limit },
                { $limit: limit });
        }

        return this.aggregate(aggregates);
    }

    countDocuments(customerKey: string, findFilter: any): Observable<number> {
        return from(this.smartObjectModel.count(_.assign({ customerKey }, { deleted: false }, findFilter))) as Observable<number>;
    }

    findByProperty(identity: IdentityRequest, value: string):
        Observable<SmartObject[]> {
        const query: SearchSODto = {
            allModels: true,
            filter: [{
                allKeys: true,
                value: {
                    criteria: 'equals',
                    type: 'so:',
                    value: value
                },
            }],
            order: []
        }
        return (this.searchHead.searchSo(identity, 0, 10000, '', query, false)) as Observable<SmartObject[]>;
    }

    listByModel(customerKey: string, modelKey: string, skip: number, limit: number, order?: string | number, sort?: string)
        : Observable<SmartObject[]> {
        return this.findByFilter(customerKey, { modelKey }, skip, limit, order, sort);
    }

    filterByGeolocation(
        customerKey: string, layersKey: string, set: number, skip: number, modelKey: string, property: string, value: string,
        limit: number, geoFilter: string, fields: string, order?: string | number, sort?: string)
        : Observable<SmartObject[]> {
        if (!fields || fields.length === 0) {
            return of(null);
        }
        const arrFields = fields.split('|');
        const or = { $or: [] };

        _.forEach(arrFields, (field) => {
            or.$or.push({ [`properties.${field}`]: { $regex: `.*${geoFilter}.*`, $options: 'i' } });
        });

        const match = {
            modelKey,
            $and: [
                { [`properties.${property}`]: { $regex: `^${value}$`, $options: 'i' } },
                or,
            ],
        };
        return this.findByGeo(customerKey, layersKey, set, skip, match, limit, order, sort);
    }

    listByGeolocation(
        customerKey: string, layersKey: string, set: number, skip: number, modelKey: string, property: string, value: string,
        limit: number, order?: string | number, sort?: string)
        : Observable<SmartObject[]> {

        const match = {
            modelKey,
            [`properties.${property}`]: { $regex: `^${value}$`, $options: 'i' }
        };

        return this.findByGeo(customerKey, layersKey, set, skip, match, limit, order, sort);
    }

    private findByGeo(
        customerKey: string, layersKey: string, set: number, skip: number, match: any,
        limit: number, order?: string | number, sort?: string): Observable<SmartObject[]> {
        let query;
        if (+ set) {
            if (layersKey) {
                const layers = layersKey.split(',');
                query = {
                    'skills.atGeolocation.geo': { $elemMatch: { geometries: { $gt: [] }, layerKey: { $in: layers } } },
                };
            } else {
                query = { 'skills.atGeolocation.geo': { $elemMatch: { geometries: { $gt: [] } } } };
            }
        } else {
            if (layersKey) {
                const layers = layersKey.split(',');
                query = { 'skills.atGeolocation.geo.layerKey': { $nin: layers } };
            }
        }
        return this.findByFilter(customerKey, _.assign(match, query), skip, limit, order, sort);
    }

    geo(customerKey: string, geobox: SmartObjectGeoBoxDto, propKeys?: string[]): Observable<GeoPOIDto[]> {

        const filterRq: any = this.getGeoFilterRq(geobox.propKeyFilter, geobox.propValueFilter);
        const aggregates: any = [
            {
                $match: {
                    customerKey,
                    'skills.atGeolocation.geo.layerKey': geobox.layerKey,
                    'skills.atGeolocation.geo.geometries.coordinates': {
                        $geoWithin: {
                            $box: geobox.box,
                        },
                    },
                    'modelKey': geobox.modelKey,
                    'deleted': false,
                },
            },
        ];

        if (filterRq) {
            Object.assign(aggregates[0].$match, filterRq);
        }
        if (geobox.propKey && geobox.propKey !== '') {
            Object.assign(aggregates[0].$match, { [`properties.${geobox.propKey}`]: { $exists: true } });
            aggregates.push({
                $project: {
                    _id: 0,
                    uuid: 1,
                    properties: 1,
                    geo: '$skills.atGeolocation.geo',
                },
            });
        } else {
            aggregates.push({
                $project: {
                    _id: 0,
                    uuid: 1,
                    properties: propKeys?.length > 0 ? 1 : undefined,
                    geo: '$skills.atGeolocation.geo',
                },
            });
        }

        return from(this.smartObjectModel.aggregate(aggregates))
            .pipe(map((res: any) => {
                return _.map(res, (r) => {
                    const ret: GeoPOIDto = {
                        uuid: r.uuid,
                        geo: r.geo,
                    };
                    if (geobox.propKey && geobox.propKey !== '') {
                        ret.prop = r.properties[`${geobox.propKey}`];
                    }

                    // propKeys
                    if (propKeys?.length > 0 && r.properties) {
                        Object.assign(ret, { properties: (this.toDTO(r) as SmartObject).properties });
                        ret.properties = ret.properties.filter((p) =>
                            propKeys.some((find) => find.toUpperCase() === p.key.toUpperCase())
                        );
                    }

                    return ret;
                });
            }));
    }

    geoSettings(customerKey: string, layerKey: string, poiSetting: GeoSettingsDto): Observable<SmartObjectDto> {
        const filterRq: any = this.getGeoFilterRq(poiSetting.propKeyFilter, poiSetting.propValueFilter);

        const findOne: any = {
            customerKey,
            'skills.atGeolocation.geo.layerKey': layerKey,
            'deleted': false,
            'modelKey': poiSetting.modelKey,
        };

        if (filterRq) {
            Object.assign(findOne, filterRq);
        }

        return from(this.smartObjectModel.findOne(findOne)).pipe(
            map((object) => this.toDTO(object) as SmartObject)
        )
    }

    magnets(customerKey: string, appKey: string, boardInstance: string, zoneKey: string): Observable<SmartObjectDto[]> {

        const find: any = {
            customerKey,
            'skills.atMagnet.zones.appKey': appKey,
            'deleted': false,
        };
        if (zoneKey) {
            Object.assign(find, { 'skills.atMagnet.zones.magnetsZoneKey': zoneKey });
        }
        if (boardInstance) {
            Object.assign(find, { 'skills.atMagnet.zones.boardInstance': boardInstance });
        } else {
            Object.assign(find, {
                $or: [
                    { 'skills.atMagnet.zones.boardInstance': '' },
                    { 'skills.atMagnet.zones.boardInstance': null },
                    {
                        'skills.atMagnet.zones.boardInstance': { $exists: false },
                    }],
            });
        }

        return from(this.smartObjectModel.find(find).lean()).pipe(
            map((object) => this.toDTO(object) as SmartObjectDto[])
        )
    }

    removeFromLayer(customerKey: string, layerKey: string): Observable<any> {
        return from(this.smartObjectModel.updateMany(
            { customerKey, 'deleted': false, 'skills.atGeolocation.geo.layerKey': layerKey },
            {
                $pull: { 'skills.atGeolocation.geo': { layerKey } },
                $set: { updateDate: new Date().toISOString() },
            },
        ));
    }

    private getGeoFilterRq(propKeyFilter: string, propValueFilter: any) {
        if (propKeyFilter && propValueFilter !== null && propValueFilter !== '*') {
            const valueFilterIsBoolean = typeof (propValueFilter) === 'boolean';
            return {
                [`properties.${propKeyFilter}`]: valueFilterIsBoolean ? propValueFilter : { $regex: `^${propValueFilter}$`, $options: 'i' }
            };
        }
        return null;
    }
}
