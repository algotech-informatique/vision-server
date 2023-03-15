import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Observable, from, of, zip, throwError } from 'rxjs';
import { BaseDocument } from '../../interfaces';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CacheDto, PatchPropertyDto } from '@algotech/core';
import { PatchPropertyService } from './patch.service';

@Injectable()
export abstract class BaseService<T extends BaseDocument> {
    constructor(
        private readonly model: Model<T>,
    ) { }

    create(customerKey: string, object: T, uuidFromFront: boolean = false): Observable<T> {
        const currentTime = new Date().toISOString();
        const newObject: T = _.assign(_.cloneDeep(object), {
            uuid: uuidFromFront && object.uuid ? object.uuid : UUID.UUID(),
            customerKey,
            deleted: object.deleted ? object.deleted : false,
            createdDate: currentTime,
            updateDate: currentTime,
        });
        const obsCreate: Observable<T> = from(new this.model(newObject).save());
        return this.cleanMongo(obsCreate);
    }

    cache(customerKey: string, date: string, uuid?: string[], created = true): Observable<CacheDto> {
        // get all and return exception if too large
        const limit = 250;

        if (date === '') {
            return throwError(() => new Error('No date'));
        }
        const d: Date = new Date(date);
        if (!(d instanceof Date)) {
            return throwError(() => new Error('invalid date'));
        }

        const updateRq: FilterQuery<any> = created ?
            {
                customerKey, deleted: false, updateDate: { $gte: date },
            } : { // only updated
                customerKey, deleted: false, $and: [
                    {
                        createdDate: { $lte: date},
                    },
                    {
                        updateDate: { $gte: date },
                    },
                ],
            };

        const deleteRq: FilterQuery<any> = {
            customerKey, deleted: true, updateDate: { $gte: date },
        };

        if (uuid) {
            Object.assign(updateRq, { uuid: { $in: uuid } });
            Object.assign(deleteRq, { uuid: { $in: uuid } });
        }

        return zip(
            from(this.model.find(updateRq, { _id: 0, __v: 0, customerKey: 0, deleted: 0 }).limit(limit)),
            from(this.model.find(deleteRq, { _id: 0, __v: 0, customerKey: 0, deleted: 0 }).limit(limit)),
        )
            .pipe(map((data: any) => {
                if (!created && (data[0].length === limit || data[1].length === limit)) {
                    throw new Error('response was too large');
                }
                return {
                    updated: data[0],
                    deleted: data[1].map((ele) => ele.uuid),
                };
            }));
    }

    delete(customerKey: string, id: string, real?: boolean): Observable<boolean> {
        if (!real) {
            const obsUpdate = this.patchProperty(customerKey, id, [{
                op: 'replace',
                path: '/updateDate',
                value: new Date().toISOString(),
            }, {
                op: 'replace',
                path: '/deleted',
                value: true,
            }]);

            return obsUpdate.pipe(
                map(res => {
                    return true;
                }),
                catchError(err => of(false)),
            );
        } else {
            const options = [];
            const filter = { uuid: id, customerKey };
            options.push({
                deleteOne: {
                    filter
                }
            });
            return from(this.model.bulkWrite(options)).pipe(
                map(res => true),
                catchError(err => of(false)));

        }
    }

    findAll(customerKey: string): Observable<T[]> {
        const filter: FilterQuery<any> = { customerKey, deleted: false };
        return from(this.model.find(filter, { _id: 0, __v: 0, deleted: 0 }).lean<T[]>()) as Observable<T[]>;
    }

    findOne(customerKey: string, id: string): Observable<T> {
        const filter: FilterQuery<any> = { uuid: id, customerKey, deleted: false };
        return from(this.model.findOne(filter, { _id: 0, __v: 0, deleted: 0 }).lean()) as Observable<T>;
    }

    list(customerKey: string, filters: any, sort?: any, page?: number, pageSize?: number): Observable<Array<T>> {
        const filtersWithCustomerKey = _.assign(filters, { customerKey });
        if (!sort) {
            sort = {};
        }
        
        if (page != null && pageSize != null) {
            const obsList: Observable<T[]> = from(this.model
                .find(filtersWithCustomerKey, { _id: 0, __v: 0, deleted: 0 })
                .sort(sort)
                .limit(pageSize)
                .skip(page * pageSize)
                .lean<T[]>()) as Observable<T[]>;
            return from(obsList);
        } else {
            const obsList: Observable<T[]> = from(this.model
                .find(filtersWithCustomerKey, { _id: 0, __v: 0, deleted: 0 })
                .sort(sort)
                .lean<T[]>()) as Observable<T[]>;
            return from(obsList);
        }
    }

    update(customerKey: string, dto: T, upsert = false): Observable<T> {
        const updateobject: UpdateQuery<any> = { ...dto, updateDate: new Date().toISOString() };
        const filter: FilterQuery<any> = { uuid: dto.uuid, customerKey, deleted: false };
        return from(
            this.model.findOneAndUpdate(filter,
                updateobject,
                {
                    new: true,
                    runValidators: true,
                    upsert,
                    select: {
                        _id: 0,
                        deleted: 0,
                    },
                },
            ).lean()) as Observable<T>;
    }

    patch(customerKey: string, id: string, changes: any): Observable<T> {
        return this.findOne(customerKey, id).pipe(
            mergeMap((dto: T) => {
                const patches = Object.assign(dto, changes);
                return this.update(customerKey, patches);
            }),
        );
    }

    public patchProperty(customerKey: string, id: string, patchesProperty: PatchPropertyDto[]):
        Observable<PatchPropertyDto[]> {

        const patchPropertyService = new PatchPropertyService(this.model, customerKey, id, patchesProperty);
        return patchPropertyService.patchProperty();
    }

    private cleanMongo(obs: Observable<T>): Observable<T> {
        return obs.pipe(
            map((obj: T) => {
                const _doc = '_doc';
                return Object.assign({}, obj[_doc], { _id: undefined, __v: undefined });
            }),
        );
    }

}
