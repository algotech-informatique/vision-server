import { DefaultSmartNodes } from './default-smart-nodes';
import {
    SnModel,
    CustomerInit,
    CustomerInitResult,
    SnSynoticSearch,
    SnApp,
    SnView,
    ProcessMonitoring,
} from '../../interfaces';
import { Model } from 'mongoose';
import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, from, of, zip } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { CacheDto, PatchPropertyDto, SnSynoticSearchQueryDto } from '@algotech-ce/core';
import { BaseService } from '../@base/base.service';
import { SmartNodesSnAppIndexationService } from './smart-nodes-snapp-indexation.service';
import { SmartNodesSnViewIndexationService } from './smart-nodes-snview-indexation.service';
import { UUID } from 'angular2-uuid';
import { ProcessMonitoringService } from '../../providers/process-monitoring/process-monitoring.service';
import moment from 'moment';
import { BulkWriteResult } from 'mongodb';
import { SnIndexationUtils } from './smart-nodes-indextation-utils';

@Injectable()
export class SmartNodesService extends BaseService<SnModel> {
    constructor(
        @InjectModel('SnModel')
        private readonly smartNodeModel: Model<SnModel>,
        @InjectModel('SnSynoticSearch')
        private readonly smartNodeSynoticModel: Model<SnSynoticSearch>,
        private readonly snAppIndexationService: SmartNodesSnAppIndexationService,
        private readonly snViewIndexationService: SmartNodesSnViewIndexationService,
        private readonly processMonitoringService: ProcessMonitoringService,
    ) {
        super(smartNodeModel);
    }
    static SEARCH_SEPARATOR = '¤';

    cache(customerKey: string, date: string, uuid?: string[]): Observable<CacheDto> {
        return super.cache(customerKey, date, uuid).pipe(
            map((result: CacheDto) => {
                return {
                    updated: result.updated,
                    deleted: result.deleted,
                };
            }),
        );
    }

    init(customer: CustomerInit): Observable<CustomerInitResult> {
        const result: CustomerInitResult = {
            key: 'smartnodes',
            value: 'ko',
        };
        return this.create(customer.customerKey, DefaultSmartNodes.defaultSmartNodes).pipe(
            map((environment) => {
                Logger.log('smartnodes/init');
                if (environment) {
                    result.value = 'ok';
                } else {
                    result.value = 'ko';
                }
                return result;
            }),
            catchError(() => {
                result.value = 'ko';
                throw new InternalServerErrorException(result);
            }),
        );
    }

    create(customerKey: string, data: SnModel): Observable<SnModel> {
        return this.findByKey(customerKey, data.type, data.key, data.dirUuid).pipe(
            mergeMap((findSnModel: SnModel) => {
                if (findSnModel !== null) {
                    throw new BadRequestException('SnModel Key already exist');
                } else {
                    return super.create(customerKey, data, true);
                }
            }),
        );
    }

    findOne(customerKey: string, uuid: string): Observable<SnModel> {
        const findSmartModel = super.findOne(customerKey, uuid);
        return findSmartModel.pipe(
            mergeMap((snModel: SnModel) => {
                if (snModel) {
                    return of(snModel);
                } else {
                    throw new BadRequestException('smart node unknown');
                }
            }),
        );
    }

    findOneByKey(customerKey: string, key: string): Observable<SnModel> {
        return from(
            this.smartNodeModel
                .findOne({ customerKey, key: { $regex: new RegExp(`^${key}$`, 'i') }, deleted: false })
                .lean(),
        ).pipe(
            mergeMap((smartNode: SnModel) => {
                if (smartNode) {
                    return of(smartNode);
                } else {
                    throw new BadRequestException('Smart Node unknown');
                }
            }),
        );
    }

    getAll(customerKey: string): Observable<SnModel[]> {
        return from(
            this.smartNodeModel
                .find({
                    customerKey,
                    deleted: false,
                })
                .lean(),
        ) as Observable<SnModel[]>;
    }

    getAllByDate(customerKey: string, updateDate: string): Observable<SnModel[]> {
        return from(
            this.smartNodeModel
                .find({
                    customerKey,
                    deleted: false,
                    updateDate: { $gte: updateDate },
                })
                .lean(),
        ) as Observable<SnModel[]>;
    }

    private findByKey(customerKey: string, type: string, key: string, dirUuid: string): Observable<SnModel> {
        const ObsModel: Observable<SnModel[]> = super.list(customerKey, { key, dirUuid, type, deleted: false });
        return ObsModel.pipe(
            map((snModels: Array<SnModel>) => {
                if (snModels.length === 0) {
                    return null;
                } else {
                    return snModels[0];
                }
            }),
        );
    }

    delete(customerKey: string, id: string, real?: boolean): Observable<boolean> {
        const findSnModelToDelete = super.findOne(customerKey, id);
        return findSnModelToDelete.pipe(
            catchError(() => {
                return of(false);
            }),
            mergeMap(() => {
                // delete indexed elements
                from(
                    this.smartNodeSynoticModel.bulkWrite([
                        {
                            deleteMany: {
                                filter: { snModelUuid: id },
                            },
                        },
                    ]),
                ).subscribe();
                return super.delete(customerKey, id, real);
            }),
        );
    }

    patchByUuid(customerKey: string, uuid: string, patches: PatchPropertyDto[]): Observable<PatchPropertyDto[]> {
        return from(this.smartNodeModel.findOne({ customerKey, uuid, deleted: false })).pipe(
            mergeMap((snModel: SnModel) => {
                if (snModel) {
                    const currentTime = new Date().toISOString();
                    const _patches = _.cloneDeep(patches);
                    _.forEach(_patches, (patch) => {
                        if (patch.path.startsWith('/versions') && patch.op === 'replace') {
                            const vers: string = this.getVersion(patch.path);
                            if (vers) {
                                const patchVersion: PatchPropertyDto = {
                                    op: 'replace',
                                    path: `/versions/[uuid:${vers}]/updatedDate`,
                                    value: currentTime,
                                };
                                _patches.push(patchVersion);
                            }
                        }
                    });
                    return super.patchProperty(customerKey, snModel.uuid, _patches).pipe(
                        mergeMap((resp: PatchPropertyDto[]) => {
                            return of(resp);
                        }),
                    );
                } else {
                    throw new BadRequestException('snModel unknown');
                }
            }),
        );
    }

    getVersion(path: string): string {
        let result = '';
        const explosePath = path.split('/');
        _.forEach(explosePath, (currentPath) => {
            const index = currentPath.indexOf('uuid:');
            if (index !== -1) {
                result = currentPath.substring(index + 5, currentPath.length - 1);
            }
        });
        return result;
    }

    tryIndexsnModels(): Observable<any> {
        const customerKey: string = process.env.CUSTOMER_KEY ? process.env.CUSTOMER_KEY : 'vision';
        let lock: ProcessMonitoring;
        return this.processMonitoringService.findOne(customerKey, 'indexation_lock').pipe(
            mergeMap((result: ProcessMonitoring) => {
                if (!result) {
                    lock = {
                        uuid: 'indexation_lock',
                        customerKey,
                        deleted: false,
                        processState: 'inProgress',
                        processType: 'indexationSnModels',
                        current: 0,
                        total: 0,
                        result: {
                            lastError: '',
                            indexationDate: '',
                        },
                    };
                } else {
                    lock = result;
                    if (lock.processState === 'inProgress') {
                        return of([]);
                    }
                }

                return lock?.result?.indexationDate
                    ? this.getAllByDate(customerKey, lock.result.indexationDate)
                    : this.getAll(customerKey);
            }),
            mergeMap((snModels: SnModel[]) => {
                if (snModels.length > 0) {
                    lock.total = snModels.length;
                    lock.result.indexationDate = moment().format();
                    return zip(of(snModels), this.processMonitoringService.update(customerKey, lock, true));
                } else {
                    return zip(of(snModels), of(false));
                }
            }),
            mergeMap((data) => {
                const snModels: SnModel[] = data[0];
                return of(
                    snModels.reduce((results: SnSynoticSearch[], snModel: SnModel) => {
                        for (const version of snModel.versions) {
                            if (snModel.type === 'app') {
                                this.snAppIndexationService.pushAppIndex(
                                    snModel,
                                    version.uuid,
                                    version.view as SnApp,
                                    results,
                                );
                            } else {
                                this.snViewIndexationService.pushSnViewIndex(
                                    snModel,
                                    version.uuid,
                                    version.view as SnView,
                                    results,
                                );
                            }
                        }
                        return results;
                    }, []),
                );
            }),
            mergeMap((elementsToIndex: SnSynoticSearch[]) => {
                const updates: any[] = elementsToIndex.map((document: SnSynoticSearch) => ({
                    insertOne: { document },
                }));
                if (updates.length > 0) {
                    updates.unshift({
                        deleteMany: {
                            filter: {
                                snModelUuid: {
                                    $in: _.uniq(elementsToIndex.map((el) => el.snModelUuid))
                                },
                            },
                        },
                    });
                    return from(this.smartNodeSynoticModel.bulkWrite(updates));
                }
                return of(false);
            }),
            catchError((err) => {
                lock.processState = 'error';
                lock.result.lastError = err;
                return of(false);
            }),
            mergeMap((data: boolean | BulkWriteResult) => {
                if (data) {
                    lock.processState = 'succeeded';
                }
                return zip(this.processMonitoringService.update(customerKey, lock, false), of(!!data));
            }),
        );
    }

    search(query: SnSynoticSearchQueryDto, skip: number, limit: number): Observable<SnSynoticSearch[]> {
        let mongoQuery;
        if (query.ressource) {
            mongoQuery = {
                connectedTo: query.ressource,
            };
        } else if (query.search) {
            const searchValue = query.exactValue
                ? `.*${SmartNodesService.SEARCH_SEPARATOR}${SnIndexationUtils._escapRegex(query.search)}${SmartNodesService.SEARCH_SEPARATOR}.*`
                : `.*${SnIndexationUtils._escapRegex(query.search)}.*`;
            mongoQuery = {
                texts: query.caseSensitive ? new RegExp(searchValue) : new RegExp(searchValue, 'i'),
            };
        }
        if (query.versions && query.versions.length > 0) {
            Object.assign(mongoQuery, { snVersionUuid: { $in: query.versions } });
        }

        return this.tryIndexsnModels().pipe(
            mergeMap(
                () =>
                    from(
                        this.smartNodeSynoticModel
                            .find(mongoQuery, null, { skip: skip * limit, limit })
                            .sort({ updateDate: -1 })
                            .lean(),
                    ) as Observable<SnSynoticSearch[]>,
            ),
        );
    }
}
