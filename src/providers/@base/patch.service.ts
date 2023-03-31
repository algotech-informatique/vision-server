import { PatchPropertyDto } from '@algotech-ce/core';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Observable, from, of, concat, throwError } from 'rxjs';
import { mergeMap, toArray, catchError, map, filter } from 'rxjs/operators';
import * as _ from 'lodash';

export class PatchPropertyService<T> {

    private model: Model<T>;
    private id: string;
    private customerKey: string;
    private patches: PatchPropertyDto[];
    private incFilter = 0;

    constructor(
        model: Model<T>,
        customerKey: string,
        id: string,
        patches: PatchPropertyDto[],
    ) {
        this.model = model;
        this.customerKey = customerKey;
        this.id = id;
        this.patches = _.cloneDeep(patches);
    }

    public patchProperty(): Observable<PatchPropertyDto[]> {
        return concat(...this.getQueries())
            .pipe(
                catchError((err) => throwError(() => err)),
                filter((d) => d !== null),
                toArray(),
            );
    }

    private getQueries(): Observable<PatchPropertyDto>[] {

        const filterQuery: FilterQuery<any> = { uuid: this.id, customerKey: this.customerKey, deleted: false };
        const queries: Observable<PatchPropertyDto>[] = [];
        this.patches.forEach(patch => {
            	
            if (patch.value === undefined && patch.op === 'replace') {
                patch.value = null;
            }
            const query = this.calculQuery(patch);
            queries.push(
                from(                    
                    this.model.updateOne(
                        filterQuery,            
                        query.update as UpdateQuery<T>,
                        {
                            runValidators: true,
                            arrayFilters: query.arrayFilters,
                        },
                    ))
                    .pipe(
                        mergeMap(
                            ((res) => {
                                if (!(patch instanceof Error) && res['acknowledged'] === true) {
                                    if (query.pull) {
                                        return from(
                                            this.model.updateOne(
                                                filterQuery,
                                                query.pull as UpdateQuery<T>,
                                                {
                                                    runValidators: true,
                                                    arrayFilters: query.pullArrayFilters
                                                }
                                            )
                                            ).pipe(
                                                mergeMap(
                                                    (() => of(_.cloneDeep(patch)))
                                                )
                                            );
                                    }
                                    return of(_.cloneDeep(patch));
                                }
                                return throwError(() => new Error('query failed')); 
                            })
                        )),
            );
        });

        if (!_.find(this.patches, function (patch) { return patch.path === '/updateDate'; })) {
            const update: UpdateQuery<any> = { updateDate: new Date().toISOString() };
            queries.push(
                from(
                    this.model.updateOne(
                        filterQuery,
                        update,
                    )
                ).pipe(
                    map((d) => {
                        return null;
                    }),
                )
            );
        }
        return queries;
    }

    private calculQuery(patch: PatchPropertyDto): {
        update: Object, arrayFilters: Object[],
        pull: Object, pullArrayFilters: Object[]
    } {
        const res = { update: null, arrayFilters: [], pull: null, pullArrayFilters: [] };

        let newPath = '';
        let position = -1;

        const value = patch.op === 'remove' ? true : patch.value;
        const mongoOperator = this.getMongoOperator(patch);
        const explosePath = patch.path.split('/');

        for (let iPath = 0; iPath < explosePath.length; iPath++) {

            const currentPath = explosePath[iPath];
            const lastNode = iPath === explosePath.length - 1;

            // Cas particulier du pull after unset
            if (lastNode && mongoOperator === '$unset' && RegExp('^(([0-9]+)|([[].*.\]))$').test(currentPath)) {
                res.pull = {
                    '$pull': {
                        [newPath]: null
                    }
                };
                res.pullArrayFilters = _.cloneDeep(res.arrayFilters);
            }

            if (this.pathIsArray(currentPath)) {
                const queryArray = this.calculQueryArray(currentPath);
                const vArray = Number(currentPath.slice(1, currentPath.length - 1));

                if (queryArray.arrayFilter) {
                    res.arrayFilters.push(queryArray.arrayFilter);
                    newPath = `${newPath}.$[${queryArray.filterName}]`;
                } else if (!isNaN(vArray)) {
                    if (lastNode && mongoOperator === '$push') {
                        // INSERTING ARRAY
                        position = vArray;
                    } else {
                        newPath = newPath === '' ? currentPath : `${newPath}.${vArray}`;
                    }
                }
            } else if (currentPath !== '') {
                newPath = newPath === '' ? currentPath : `${newPath}.${currentPath}`;
            }
        }

        if (position !== -1) {
            // INSERTING ARRAY
            res.update = {
                [mongoOperator]: {
                    [newPath]: {
                        $each: [value],
                        $position: position,
                    },
                },
            };
        } else {
            res.update = {
                [mongoOperator]: {
                    [newPath]: value,
                },
            };
        }

        return res;
    }

    private calculQueryArray(currentPath): {
        arrayFilter: Object,
        filterName: string
    } {

        const res = { arrayFilter: undefined, filterName: '' };
        const pathFormat = currentPath.slice(1, currentPath.length - 1);

        // if not includes : push
        if (currentPath.includes(':')) {

            const keyValue = pathFormat.split(':');

            // query exemple : {'properties.$[filter1].displayName.$[filter2]'
            // filter1.key : name
            // filter2.lang : fr

            res.filterName = `filter${this.incFilter++}`;
            res.arrayFilter = {
                [`${res.filterName}.${keyValue[0]}`]: keyValue[1]
            };
        }

        return res;
    }

    private getMongoOperator(patch: PatchPropertyDto): string {
        switch (patch.op) {
            case 'replace':
                return '$set';
            case 'remove':
                return '$unset';
            case 'add':
                // set or push(array)
                return RegExp('[[].*.\]$').test(patch.path) ? '$push' : '$set';
            default:
                return '';
        }
    }
    private pathIsArray(currentPath): boolean {
        return RegExp('^[[].*.\]$').test(currentPath);
    }
}
