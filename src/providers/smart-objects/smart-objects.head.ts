import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable, of, throwError, zip } from 'rxjs';
import {
    SmartObjectSearchDto, PatchPropertyDto, SmartObjectGeoBoxDto, SmartObjectTreeQuery,
    GeoSettingsDto, SmartObjectDto, GeoPOIDto, ImportSoDto, ProcessMonitoringState, SearchSODto
} from '@algotech-ce/core';
import { SmartObjectsService } from './smart-objects.service';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { SmartObjectTreeService } from './smart-object-tree.service';
import { IdentityRequest, SmartObject, ProcessMonitoring } from '../../interfaces';
import { SmartModelsService } from '../smart-models/smart-models.service';
import * as _ from 'lodash';
import { SearchHead } from '../search/search.head';
import { SearchQueryBuilderHead } from '../search/search-query-builder.head';
import { AdminService } from '../admin/admin.service';
import { UUID } from 'angular2-uuid';
import { ProcessMonitoringHead } from '../process-monitoring/process-monitoring.head';

@Injectable()
export class SmartObjectsHead {
    constructor(
        private readonly searchQueryBuilderHead: SearchQueryBuilderHead,
        private readonly searchHead: SearchHead,
        private readonly smartModelsService: SmartModelsService,
        private readonly smartObjectService: SmartObjectsService,
        private readonly smartObjectTreeService: SmartObjectTreeService,
        private readonly adminService: AdminService,
        private readonly processMonitoringHead: ProcessMonitoringHead
    ) { }

    create(data: { identity: IdentityRequest, smartObject: SmartObject }): Observable<SmartObject> {
        return this.smartObjectService.createSO(data.identity, data.smartObject);
    }

    cache(data: { identity: IdentityRequest, date: string, uuid?: string[] }) {
        return this.smartObjectService.cache(data.identity.customerKey, data.date, data.uuid);
    }

    import(data: { identity: IdentityRequest, file: Buffer, content: ImportSoDto }): Observable<{ success: boolean }> {
        return this.smartObjectService.import(data.identity, data.file, data.content);
    }

    find(data: {
        identity;
        uuid?: string;
        uuids?: string[];
        subdoc?: boolean;
        deep?: boolean;
        excludeRoot?: boolean;
        modelKey?: string;
        skip?: number;
        limit?: number;
        sort?: string;
        order?: string;
        value?: string;
        skill?: string;
        set?: number;
        layersKey?: string;
        property?: string;
        docUuid?: string;
        type?: 'include' | 'exclude';
        filter?: string;
        fields?: string;
        smartObjects?: SmartObjectDto[],
    }): Observable<SmartObject | SmartObject[] | SmartObjectDto[]> {

        let numskip: number;
        let numlimit: number;
        let propValue: string;

        numskip = data.skip ? +data.skip : 0; // +num est "équivalent" au parseInt(num)
        numlimit = data.limit ? +data.limit : 100;
        propValue = data.value === '*' ? '.*' : data.value;
        if (data.subdoc) {

            if (data.uuid) {
                return this.smartObjectService.findSubDocByUuid(data.identity.customerKey, data.uuid, { deep: data.deep, excludeRoot: data.excludeRoot, includeDeleted: false });
            } else if (data.uuids) {
                return this.smartObjectService.findSubDocByUuids(data.identity.customerKey, data.uuids, { deep: data.deep, excludeRoot: data.excludeRoot });
            } else if (data.smartObjects) {
                return this.smartObjectService.findSubDocBySmartObjects(data.identity.customerKey, data.smartObjects, { deep: data.deep, excludeRoot: data.excludeRoot });
            } else {
                throw new Error('parametrs of subdoc undefined');
            }

        } else if (data.uuid) {
            return this.smartObjectService.findOne(data.identity.customerKey, data.uuid);
        } else if ((data.skill === 'geolocation') && (data.layersKey || data.set || data.skip || data.limit || data.order || data.sort)) {

            if (data.filter) {
                return this.smartObjectService.filterByGeolocation(
                    data.identity.customerKey,
                    data.layersKey,
                    data.set,
                    numskip,
                    data.modelKey,
                    data.property,
                    propValue,
                    numlimit,
                    data.filter,
                    data.fields,
                    data.order,
                    data.sort);
            } else {
                return this.smartObjectService
                    .listByGeolocation(
                        data.identity.customerKey,
                        data.layersKey,
                        data.set,
                        numskip,
                        data.modelKey,
                        data.property,
                        propValue,
                        numlimit,
                        data.order,
                        data.sort);
            }
        } else if (data.modelKey && (data.skip || data.limit || data.order || data.sort)) {
            return this.smartObjectService.listByModel(data.identity.customerKey, data.modelKey, numskip, numlimit, data.order, data.sort);
        } else if (data.modelKey) {
            return this.smartObjectService.findByModel(data.identity.customerKey, data.modelKey);
        } else if (data.docUuid) {
            return this.smartObjectService.findByDocUuid(data.identity.customerKey, data.docUuid);
        } else if (data.uuids) {
            return this.smartObjectService.findByUuids(data.identity.customerKey, data.uuids, data.type, numskip, numlimit);
        } else {
            return this.smartObjectService.findAll(data.identity.customerKey);
        }
    }

    searchByModel(data: {
        identity: IdentityRequest,
        modelKey: string,
        property: string,
        value: string,
        skip: number,
        limit: number,
        order: string,
        defaultOrder: string
    }): Observable<SmartObject[]> {
        let numskip;
        let numlimit;

        if ((data.skip && isNaN(data.skip)) || (data.limit && isNaN(data.limit))) {
            throw new BadRequestException('skip or limit is not a number!');
        } else {
            numskip = data.skip ? + data.skip : 0;
            numlimit = data.limit ? + data.limit : 100;
        }

        const query: SearchSODto = {
            deleted: false,
            modelKey: data.modelKey,
            searchParameters: {
                skip: numskip,
                limit: numlimit,
                filter: [],
                order: []
            }
        };
        if (!data.property) {
            query.searchParameters.search = data.value;
        } else {
            query.searchParameters.filter = [{
                key: data.property,
                value: {
                    criteria: 'contains',
                    type: 'any',
                    value: data.value,
                },
                type: 'filter',
            }];
        }

        if (data.defaultOrder) {
            query.searchParameters.order = [{
                key: data.defaultOrder,
                value: data.order,
            }];
        }

        return this.searchHead.searchSo(data.identity, numskip, numlimit, '', query, false) as Observable<SmartObject[]>;
    }

    isUnique(data: { identity: IdentityRequest, smartObject: SmartObject }): Observable<{ unique: boolean }> {
        return this.smartObjectService.isUnique(data.identity, data.smartObject).pipe(
            map((unique: boolean) => {
                return {
                    unique,
                };
            }),
        );
    }

    distinc(data: {
        identity;
        docUuid: string;
    }) {
        return this.smartObjectService.distinctByDocUuid(data.identity.customerKey, data.docUuid);
    }

    searchByFilter(data: {
        identity;
        query: object,
        skip?: number;
        limit?: number;
        sort?: string;
        order?: string | number;
    }): Observable<SmartObject[]> {

        let numskip = data.skip ? +data.skip : 0;
        const numlimit = data.limit ? + data.limit : 100;
        const numOrder = data.order ? data.order : 1;

        return numskip === -1 ? this.countDocuments(data).pipe(
            mergeMap(count => {
                numskip = Math.round(count / numlimit);
                return this.smartObjectService.findByFilter(
                    data.identity.customerKey,
                    data.query,
                    numskip,
                    numlimit,
                    numOrder,
                    data.sort)
            })
        ) : this.smartObjectService.findByFilter(
            data.identity.customerKey,
            data.query,
            numskip,
            numlimit,
            numOrder,
            data.sort);
    }

    searchByProperty(data: {
        identity;
        uuids: string[];
        order?: string;
        sort?: string;
    }): Observable<SmartObject[]> {
        return this.smartObjectService.findByFilter(
            data.identity.customerKey,
            { uuid: { $in: data.uuids } },
            0,
            (data.uuids.length > 0) ? data.uuids.length : 1,
            data.order,
            data.sort);
    }

    countDocuments(data: {
        identity;
        query: object
    }): Observable<number> {
        return this.smartObjectService.countDocuments(data.identity.customerKey,
            data.query)
    }

    treeSearch(data: { identity: IdentityRequest, query: SmartObjectTreeQuery }): Observable<SmartObject[]> {
        return this.smartObjectTreeService.search(data.identity.customerKey, data.query);
    }

    geo(data: { identity: IdentityRequest, geobox: SmartObjectGeoBoxDto, propKeys?: string[] }): Observable<GeoPOIDto[]> {
        return this.smartObjectService.geo(data.identity.customerKey, data.geobox, data.propKeys);
    }

    geoSettings(data: { identity: IdentityRequest, layerKey: string, poiSetting: GeoSettingsDto }): Observable<SmartObjectDto> {
        return this.smartObjectService.geoSettings(
            data.identity.customerKey,
            data.layerKey,
            data.poiSetting,
        );
    }

    magnets(data: { identity: IdentityRequest, appKey: string, boardInstance: string, zoneKey: string }): Observable<SmartObjectDto[]> {
        return this.smartObjectService.magnets(data.identity.customerKey, data.appKey, data.boardInstance, data.zoneKey);
    }

    delete(data: { identity: IdentityRequest, uuid: string }): Observable<boolean> {
        return this.smartObjectService.doDelete(data.identity, data.uuid).pipe(
            mergeMap((result: boolean) => {
                if (result === true) {
                    return of(true);
                } else {
                    return throwError(() => new BadRequestException('Delete SmartObject failed'));
                }
            }),
        );
    }

    _updateProcessState(customerKey: string, proc: ProcessMonitoring, current: number, state: ProcessMonitoringState) {
        proc.current = current;
        proc.processState = state;
        this.processMonitoringHead.update(customerKey, proc).subscribe();
    }

    deleteAllDB(data: {
        identity: IdentityRequest,
        real: boolean,
    }): Observable<number> {
        const proc: ProcessMonitoring = {
            uuid: UUID.UUID(),
            customerKey: data.identity.customerKey,
            current: 0,
            total: 100,
            deleted: false,
            processState: 'inProgress',
            processType: 'deleteSos',
            result: {
                process: 'empty DB'
            },

        }
        this.processMonitoringHead.create(data.identity.customerKey, proc).subscribe();
        return this.smartObjectService.deleteAll(data.identity.customerKey, '', false, data.real).pipe(
            tap(res => {
                if (res === -1) {
                    this._updateProcessState(data.identity.customerKey, proc, 30, 'error');
                    return throwError(() => new BadRequestException('Delete SmartObjects deleteAll failed'));
                }
                this._updateProcessState(data.identity.customerKey, proc, 100, 'succeeded');
            })
        );
    }

    deleteByModelKey(data: {
        identity: IdentityRequest,
        modelKey: string, //dans le cas d'une suppression dela database modelKey === ''
        real: boolean,
        empty //Dans composant database empty est set si on supprime un Smartmodel dans le cas d'une suppression dela database modelKey === '' et uuids === []
        deleted: boolean
    }): Observable<number> {
        const proc: ProcessMonitoring = {
            uuid: UUID.UUID(),
            customerKey: data.identity.customerKey,
            current: 0,
            total: 100,
            deleted: false,
            processState: 'inProgress',
            processType: 'deleteSos',
            result: {
                process: `delete ${data.modelKey}`
            },

        }
        this.processMonitoringHead.create(data.identity.customerKey, proc).subscribe();
        return this.smartObjectService.deleteAll(data.identity.customerKey, data.modelKey, data.deleted, data.real).pipe(
            mergeMap(res => {
                if (res === -1) {
                    this._updateProcessState(data.identity.customerKey, proc, 30, 'error');
                    return throwError(() => new BadRequestException('Delete SmartObjects deleteAll failed'));
                }
                this._updateProcessState(data.identity.customerKey, proc, 100, 'succeeded');
                return of(res)
            })
        );
    }

    deleteByUuids(data: {
        identity: IdentityRequest,
        uuids: string[], //dans le cas d'une suppression dela database uuids === []
        real: boolean,
    }): Observable<number> {
        const proc: ProcessMonitoring = {
            uuid: UUID.UUID(),
            customerKey: data.identity.customerKey,
            current: 0,
            total: 100,
            deleted: false,
            processState: 'inProgress',
            processType: 'deleteSos',
            result: {
                process: `delete by uuids`
            },

        }
        this.processMonitoringHead.create(data.identity.customerKey, proc).subscribe();
        const $deletes = data.uuids.map(uuid => this.smartObjectService.doDelete(data.identity, uuid, data.real));
        return zip(...$deletes).pipe(
            mergeMap((results: boolean[]) => {
                if (_.every(results, del => del)) {
                    this._updateProcessState(data.identity.customerKey, proc, 100, 'succeeded');
                    return of(data.uuids.length);
                } else {
                    this._updateProcessState(data.identity.customerKey, proc, 40, 'error');
                    return throwError(() => new BadRequestException('Delete SmartObjects failed'));
                }
            }),
        );
    }

    deleteSmartObjects(data: {
        identity: IdentityRequest,
        uuids: string[], //dans le cas d'une suppression dela database uuids === []
        modelKey: string, //dans le cas d'une suppression dela database modelKey === ''
        real: boolean,
        empty //Dans composant database empty est set si on supprime un Smartmodel dans le cas d'une suppression dela database modelKey === '' et uuids === []
        deleted: boolean
    }): Observable<number> {

        // Vider tout les objets d'un modèle 
        if (data.empty && data.modelKey) {
            return this.deleteByModelKey(data);
        }

        // Vider toute les SOs de la base
        if (!data.modelKey && (!data.uuids || data.uuids.length === 0)) {
            return this.deleteAllDB(data);
        }

        // supprimer les Sos par uuids
        if (data.uuids && data.uuids.length !== 0) {
            return this.deleteByUuids(data);
        }

        return of(-1);
    }

    restore(identity: IdentityRequest, modelKey: string, uuids: string[]): Observable<boolean> {
        return this.smartObjectService.restore(identity.customerKey, modelKey, uuids).pipe(
            map(() => true)
        );

    }

    update(data: { identity: IdentityRequest, changes: SmartObject }): Observable<SmartObject> {
        return this.smartObjectService.doUpdate(data.identity, data.changes);
    }

    patch(ws: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {

        return this.smartObjectService.doPatchProperty(ws.identity, ws.data.uuid, ws.data.patches).pipe(
            map(() => ws.data.patches)
        );
    }

    removeFromLayer(data: {
        identity: IdentityRequest;
        layerKey: string;
    }): Observable<any> {
        return this.smartObjectService.removeFromLayer(data.identity.customerKey, data.layerKey);
    }
}
