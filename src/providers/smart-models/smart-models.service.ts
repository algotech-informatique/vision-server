import { Injectable, InternalServerErrorException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { PatchPropertyDto, QuerySearchDto } from '@algotech/core';
import { IdentityRequest, SettingsData, SmartModel } from '../../interfaces';
import { BaseService } from '../@base/base.service';
import { SettingsDataService } from '../../providers/@base/settings-data.service';
import { RxExtendService } from '../../providers/rx-extend/rx-extend.service';
@Injectable()
export class SmartModelsService extends BaseService<SmartModel> {
    constructor(
        @InjectModel('SmartModel') private readonly smartModelModel: Model<SmartModel>,
        protected sequenceService: RxExtendService,
        @Inject(forwardRef(() => SettingsDataService))
        private settingsDataService: SettingsDataService
    ) {
        super(smartModelModel);
    }

    public create(customerKey: string, smartModel: SmartModel): Observable<SmartModel> {
        const obsFindOne: Observable<SmartModel> = from(this.smartModelModel.findOne({
            key: smartModel.key, customerKey, deleted: false,
        }).lean());

        return obsFindOne.pipe(
            mergeMap((model) => {
                if (model !== null) {
                    throw new BadRequestException('model already exist');
                } else {
                    const modelToCreate = Object.assign({}, smartModel, { deleted: false });
                    return super.create(customerKey, modelToCreate, true);
                }
            })
        );
    }

    delete(customerKey: string, id: string, real?: boolean): Observable<boolean> {
        const findModelToDelete = super.findOne(customerKey, id);
        return findModelToDelete.pipe(
            mergeMap((model) => {
                if (!model) {
                    throw new BadRequestException('No smart config to delete');
                } else {
                    const obsDeleteSmartModel: Observable<boolean> = super.delete(customerKey, id, real);
                    const deleteZip: Observable<boolean> = obsDeleteSmartModel.pipe(
                        catchError(err => { throw new InternalServerErrorException(err.message); }),
                        map(res => {
                            return !!res;
                        }),
                    );
                    return deleteZip;
                }
            }),
        );
    }

    findAllSystem(customerKey: string): Observable<SmartModel[]> {
        const findAll: Observable<SmartModel[]> = from(this.smartModelModel.find(
            { customerKey, system: true, deleted: false }).lean()) as Observable<SmartModel[]>;
        return findAll;
    }

    findAndFilter(customerKey: string, skills: string): Observable<SmartModel[]> {
        const findAll: Observable<SmartModel[]> = from(this.smartModelModel.find(
            { customerKey, [`skills.${skills}`]: true, deleted: false }).lean()) as Observable<SmartModel[]>;
        return findAll;
    }

    findOne(customerKey: string, id: string): Observable<SmartModel> {
        const findSmartModel: Observable<SmartModel> = super.findOne(customerKey, id);

        return findSmartModel.pipe(
            mergeMap(smartModel => {
                if (smartModel) {
                    return of(smartModel);
                } else {
                    throw new BadRequestException('smart model unknown');
                }
            }),
        );
    }

    findOneByKey(customerKey: string, key: string): Observable<SmartModel> {
        return from(
            this.smartModelModel.findOne({ customerKey, key, deleted: false }).lean(),
        ).pipe(
            mergeMap((sm: SmartModel) => {
                if (sm) {
                    return of(sm);
                } else {
                    throw new BadRequestException('smart model unknown');
                }
            }),
        );
    }

    findOneByExactKey(customerKey: string, key: string): Observable<SmartModel> {
        return from(
            this.smartModelModel.findOne({ customerKey, key, deleted: false }).lean()).pipe(
                mergeMap((sm: SmartModel) => {
                    if (sm) {
                        return of(sm);
                    } else {
                        throw new BadRequestException('smart model unknown');
                    }
                }),
            );
    }

    findOneWithSubModel(customerKey: string, key: string, ignoreKeys: string[] = [], models: SmartModel[] = []) {
        return this.findOneByKey(customerKey, key).pipe(
            mergeMap((smartModel: SmartModel) => {
                models.push(smartModel);

                const subModelsObservables: Observable<SmartModel>[] = [];
                smartModel.properties.forEach((property) => {
                    if (property.keyType.startsWith('so:')) {
                        const _modelKey = property.keyType.replace('so:', '');
                        if (!models.find((model) => model.key === _modelKey) && !ignoreKeys.includes(_modelKey)) {
                            subModelsObservables.push(this.findOneWithSubModel(customerKey, _modelKey, ignoreKeys, models));
                        }
                    }
                });

                if (subModelsObservables.length === 0) {
                    return of(smartModel);
                } else {
                    return this.sequenceService.sequence(subModelsObservables);
                }
            }),
            map(() => _.uniqBy(models, 'key'))
        );
    }




    smPermissions(identity: IdentityRequest, query: QuerySearchDto, target: string): Observable<{ modelKey: string; properties: string }[]> {
        const isSadmin = _.find(identity.groups, (g) => g === 'sadmin') !== undefined;

        return this.settingsDataService.getContext().pipe(
            mergeMap((context: SettingsData) => {
                if (target !== '' && !target.startsWith('file:')) {
                    return of([_.find(context.smartmodels, (sm) => sm.key === target.replace('so:', ''))]);
                } else if (query?.so?.length > 0) {
                    return of(_.reduce(_.uniqBy(query.so, 'modelKey'), (results, so) => {
                        const sm = _.find(context.smartmodels, (sm) => sm.key === so.modelKey);
                        if (sm) {
                            results.push(sm);
                        }

                        return results;
                    }, []));
                }

                return of(context.smartmodels);
            }),
            mergeMap((models) => {
                return of(_.reduce(models, (results, model: SmartModel) => {
                    if (isSadmin) {
                        results.push({
                            modelKey: model.key,
                            properties: _.map(model.properties, (property) => ({ key: property.key, keyType: property.keyType })),
                        });
                    }
                    else if (_.intersection([...model.permissions.R, ...model.permissions.RW],
                        identity.groups).length > 0) {
                        const properties = _.reduce(model.properties, (resultedporps, property) => {
                            if (_.intersection([...property.permissions.R, ...property.permissions.RW], identity.groups).length > 0) {
                                resultedporps.push({ key: property.key, keyType: property.keyType });
                            }

                            return resultedporps;
                        }, []);
                        results.push({ modelKey: model.key, properties });
                    }

                    return results;
                }, []));
            }),
        );
    }
}
