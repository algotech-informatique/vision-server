import { DefaultSmartNodes } from './default-smart-nodes';
import { SnModel, CustomerInit, CustomerInitResult, SnVersion } from '../../interfaces';
import { Model } from 'mongoose';
import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, from, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { CacheDto, PatchPropertyDto } from '@algotech-ce/core';
import { BaseService } from '../@base/base.service';

@Injectable()
export class SmartNodesService extends BaseService<SnModel> {

    constructor(@InjectModel('SnModel')
    private readonly smartNodeModel: Model<SnModel>) {
        super(smartNodeModel);
    }

    cache(customerKey: string, date: string, uuid?: string[], created = true): Observable<CacheDto> {
        return super.cache(customerKey, date, uuid, created).pipe(
            map((result: CacheDto) => {
                return {
                    updated: result.updated,
                    deleted: result.deleted,
                };
            })
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
            }));
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
            this.smartNodeModel.findOne({ customerKey, key: { $regex: new RegExp(`^${key}$`, 'i') }, deleted: false }).lean(),
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
        return from(this.smartNodeModel.find({
            customerKey,
            deleted: false,
        }).lean()) as Observable<SnModel[]>;
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
            catchError((err) => {
                return of(false);
            }),
            mergeMap((snModel) => {
                return super.delete(customerKey, id, real);
            }),
        );
    }

    patchByUuid(customerKey: string, uuid: string, patches: PatchPropertyDto[]): Observable<PatchPropertyDto[]> {
        return from(
            this.smartNodeModel.findOne({ customerKey, uuid, deleted: false }),
        ).pipe(
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

}
