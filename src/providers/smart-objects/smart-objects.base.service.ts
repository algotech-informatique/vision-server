import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { SmartModel, SmartObject } from '../../interfaces';
import { BaseService } from '../@base/base.service';
import * as _ from 'lodash';
import { CacheDto, PatchPropertyDto, SmartObjectDto } from '@algotech/core';
import { SettingsDataService } from '../@base/settings-data.service';
import moment from 'moment';
@Injectable()
export abstract class SmartObjectsBaseService extends BaseService<SmartObject> {
    constructor(
        @InjectModel('SmartObject') protected readonly smartObjectModel: Model<SmartObject>,
        protected readonly settingsData: SettingsDataService) {
        super(smartObjectModel);
    }

    static SEARCH_KEY = '~__searchtext';
    static SEARCH_SEPARATOR = '¤';

    aggregateRaw(pipeline?: any[], options?: Record<string, unknown>): Observable<any> {
        return from(this.smartObjectModel.aggregate(pipeline, options));
    }

    aggregate(pipeline?: any[], options?: Record<string, unknown>): Observable<SmartObject[]> {
        return from(this.aggregateRaw(pipeline, options)).pipe(
            map((objects: SmartObject[]) => {
                return this.toDTO(objects) as SmartObject[];
            })
        );
    }

    toDB(entry: SmartObject): any {
        const transform = (obj: SmartObject) => {
            if (!obj?.properties) {
                return obj;
            }

            const properties = {};
            obj.properties.forEach((p) => {
                properties[p.key] = p.value
            });

            return Object.assign(_.clone(obj), { properties });
        }
        return Array.isArray(entry) ? entry.map((obj) => transform(obj)) : transform(entry);
    }

    toDTO(entry: any): SmartObject | SmartObject[] {
        const transform = (obj: any) => !obj?.properties ? obj : Object.assign(obj, {
            properties: Object.entries(obj.properties)
                .filter(([key, value]) => key !== SmartObjectsBaseService.SEARCH_KEY)
                .map(([key, value]) => {
                    return {
                        key,
                        value
                    }
                })
        });

        return Array.isArray(entry) ? entry.map((obj) => transform(obj)) : transform(entry);
    }

    findModel(modelKey: string): Observable<SmartModel> {
        return this.settingsData.getContext().pipe(
            map((context) => {
                const sm = context.smartmodels.find((sm) => sm.key.toUpperCase() === modelKey.toUpperCase()) as SmartModel;
                return sm;
            })
        )
    }

    getFullText(smartObject: SmartObject, smartModel: SmartModel): string {
        return smartModel.properties.filter((property) => ['number', 'string', 'date', 'datetime', 'time'].indexOf(property.keyType) > -1)
            .reduce((result, property) => {
                const propInstance = smartObject.properties.find((p) => p.key === property.key);
                if (propInstance?.value != null) {
                    result += `${propInstance?.value}${SmartObjectsBaseService.SEARCH_SEPARATOR}`;
                }
                return result;
            }, `${SmartObjectsBaseService.SEARCH_SEPARATOR}`);
    }

    formatDate(value: any) {
        const format = (date) => {
            if (moment(date).isValid()) {
                return new Date(date);
            }
            return date;
        }

        if (Array.isArray(value)) {
            return value.map((date) => format(date));
        } else {
            return format(value);
        }
    }

    formatSmartObject(smartObject: SmartObject): Observable<any> {
        return this.findModel(smartObject.modelKey).pipe(
            map((smartModel: SmartModel) => {
                return this.formatSmartObjectAsync(smartObject, smartModel);
            })
        )
    }

    formatSmartObjectAsync(smartObject: SmartObject, smartModel: SmartModel): SmartObject {
        smartObject.properties.push({
            key: SmartObjectsBaseService.SEARCH_KEY,
            value: this.getFullText(smartObject, smartModel)
        });

        for (const property of smartModel.properties.filter((p) => p.keyType === 'date' || p.keyType === 'datetime')) {
            const propInstance = smartObject.properties.find((p) => p.key === property.key);
            if (!propInstance || !propInstance.value) {
                continue;
            }
            Object.assign(propInstance, {
                value: this.formatDate(propInstance.value)
            });
        }

        return smartObject;
    }

    // overload

    create(customerKey: string, object: SmartObject, uuidFromFront: boolean = false): Observable<SmartObject> {
        return this.formatSmartObject(object).pipe(
            mergeMap(() => super.create(customerKey, this.toDB(object), uuidFromFront)),
            map((object: any) => this.toDTO(object) as SmartObject)
        );
    }

    cache(customerKey: string, date: string, uuid?: string[], created = true): Observable<CacheDto> {
        return super.cache(customerKey, date, uuid, created).pipe(
            map((data: CacheDto) => ({
                deleted: data.deleted,
                updated: this.toDTO(data.updated) as SmartObject[],
            }))
        )
    }

    findAll(customerKey: string): Observable<SmartObject[]> {
        return super.findAll(customerKey).pipe(
            map((object: any) => this.toDTO(object) as SmartObject[])
        )
    }

    findOne(customerKey: string, id: string): Observable<SmartObject> {
        return super.findOne(customerKey, id).pipe(
            map((object: any) => this.toDTO(object) as SmartObject)
        )
    }

    update(customerKey: string, dto: SmartObject, upsert = false): Observable<SmartObject> {
        return this.formatSmartObject(dto).pipe(
            mergeMap(() => super.update(customerKey, this.toDB(dto), upsert)),
            map((object: any) => this.toDTO(object) as SmartObject)
        )
    }

    public patchAndFormatProperty(customerKey: string, smartObject: SmartObject, patchesProperty: PatchPropertyDto[]): Observable<PatchPropertyDto[]> {
        return this.findModel(smartObject.modelKey).pipe(
            mergeMap((smartModel) => {
                let searchToUpdate = false;
                const patches: PatchPropertyDto[] = patchesProperty.map((p) => {
                    if (p.path?.startsWith('/properties/')) {
                        switch (p.op) {
                            case 'add': {
                                if (p.path !== '/properties/[?]' || !p.value?.key) {
                                    throw new Error('patch doesn\'t have good format.');
                                }
                                searchToUpdate = true;
                                const type = smartModel.properties.find((prop) => prop.key === p.value.key)?.keyType;
                                return {
                                    op: 'replace',
                                    path: `/properties/${p.value.key}`,
                                    value: type === 'date' || type === 'datetime' ? this.formatDate(p.value.value) : p.value.value,
                                }
                            }
                            case 'replace':
                            case 'remove': {
                                const match = /key:([^\]]+)/.exec(p.path);
                                if (!match || match.length <= 1) {
                                    throw new Error('patch doesn\'t have good format.');
                                }
                                searchToUpdate = true;
                                const type = smartModel.properties.find((prop) => prop.key === match[1])?.keyType;
                                return {
                                    op: p.op,
                                    path: `/properties/${match[1]}`,
                                    value: p.op === 'remove' ? undefined : type === 'date' || type === 'datetime' ? this.formatDate(p.value) : p.value,
                                }
                            }
                            default: {
                                return p;
                            }
                        }
                    }

                    return p;
                });

                if (searchToUpdate) {
                    patches.push({
                        op: 'replace',
                        path: `/properties/${SmartObjectsBaseService.SEARCH_KEY}`,
                        value: this.getFullText(smartObject, smartModel)
                    });
                }

                return super.patchProperty(customerKey, smartObject.uuid, patches);
            })
        )
    }
}