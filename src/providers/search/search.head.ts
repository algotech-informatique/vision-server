import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as _ from 'lodash';
import { QuerySearchDto, QuerySearchResultDto, SearchSODto, SearchSOFilterDto, SmartModelDto, SmartObjectDto } from '@algotech-ce/core';
import { AxiosRequestConfig } from 'axios';
import { defer, Observable, of, zip } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { SmartObjectsService } from '../../providers/smart-objects/smart-objects.service';
import { IdentityRequest, SearchSOCombinedFilters, Search, FacetAggregationPipeline, SettingsData, SmartModel, SmartObject } from '../../interfaces';
import { SearchQueryBuilderHead } from './search-query-builder.head';
import { SettingsDataService } from '../../providers/@base/settings-data.service';

const es_url = process.env.ES_URL ? process.env.ES_URL : false;

@Injectable()
export class SearchHead {
    constructor(
        private readonly searchQueryBuilderHead: SearchQueryBuilderHead,
        private readonly httpService: HttpService,
        @Inject(forwardRef(() => SmartObjectsService))
        private readonly smartObjectsService: SmartObjectsService,
        private readonly settingsDataService: SettingsDataService
    ) { }

    combineSysQueries(query: SearchSODto, search: string, skip: number, limit: number): Search {
        const { searchParameters } = query;
        const merge = (obj1, obj2, key: 'filter' | 'order') => {
            if (obj1 && obj1[key]) {
                if (obj2 && obj2[key]) {
                    obj2[key].forEach(value => {
                        if (!obj1[key].find(v => v.key === value.key)) {
                            obj1[key].push(value);
                        }
                    });
                }
            }
        }

        if ((!searchParameters?.skip && skip && isNaN(skip)) ||
            (searchParameters?.skip && isNaN(searchParameters.skip)) ||
            (!searchParameters?.limit && limit && isNaN(limit)) ||
            (searchParameters?.limit && isNaN(searchParameters.limit))) {
            throw new BadRequestException('skip or limit is not a number!');
        } else {
            merge(searchParameters, query, 'filter');
            merge(searchParameters, query, 'order');
            const filters = searchParameters?.filter ?? query.filter;
            return {
                query: {
                    modelKey: query.modelKey,
                    allModels: query.allModels,
                    deleted: query.deleted,
                    notIndexed: query.notIndexed,
                    filter: filters ?
                        filters.map(filter => {
                            filter.value = Array.isArray(filter.value) ? filter.value[0] : filter.value
                            return filter;
                        }) : [],
                    order: searchParameters?.order ?? query.order
                },
                search: searchParameters?.search ?? search,
                skip: searchParameters?.skip ?? (skip ? +skip : 0),
                limit: searchParameters?.limit ?? (limit ? +limit : 100)
            }

        }
    }

    search(identity: IdentityRequest, skip: number, limit: number, target, query: QuerySearchDto): Observable<QuerySearchResultDto[]> {
        const $queries = [];
        return this.settingsDataService.getContext()
            .pipe(
                catchError((err) => {
                    return err;
                }),
                mergeMap((context: SettingsData) => {
                    const hasTagsOrMetadatas = query.tags.length > 0 || query.metadatas.length > 0;
                    if (query.so.length === 0 && (hasTagsOrMetadatas || (query.texts.length > 0 && (target === '' || target.startsWith('file:'))))) {
                        if (es_url) {
                            $queries.push(this.sendSearchRequest(identity.customerKey,
                                [this.searchQueryBuilderHead.setdocQueries(identity.customerKey, skip, limit, query,
                                    context.smartmodels.map((model: SmartModel) => model.key))]))
                        }
                    }

                    if (hasTagsOrMetadatas || (query.so.length > 0 || query.texts.length > 0) && (target === '' || target.startsWith('so:'))) {
                        const aggregates: any[] = [];
                        if (query.so.length === 0 && !target.startsWith('so:')) {
                            query.so.push(
                                ...context.smartmodels.map((sm) => ({
                                    modelKey: sm.key,
                                    props: null,
                                }))
                            )
                        }

                        aggregates.push(
                            ...this.searchQueryBuilderHead.PipelineForQuerySearch(identity.customerKey, query, target, skip, limit,
                                context.smartmodels)
                        );

                        $queries.push(
                            this.smartObjectsService.aggregate(aggregates).pipe(
                                catchError(() => of([])),
                                map((smartObjects: SmartObject[]) => {
                                    if (smartObjects.length === 0) {
                                        return [];
                                    }

                                    if (target && target.startsWith('so:')) {
                                        return [{
                                            docRecommendation: [],
                                            header: {
                                                count: '*',
                                                name: target.split(':')[1],
                                                type: 'so'
                                            },
                                            values: smartObjects
                                        }]
                                    }

                                    return _.reduce(smartObjects, (results, smartObject: SmartObject) => {
                                        let soSearchResult = results.find((res: QuerySearchResultDto) => res.header.name === smartObject.modelKey);
                                        if (!soSearchResult) {
                                            soSearchResult = {
                                                docRecommendation: [],
                                                header: {
                                                    count: '*',
                                                    name: smartObject.modelKey,
                                                    type: 'so'
                                                },
                                                values: []
                                            };
                                            results.push(soSearchResult);
                                        }
                                        soSearchResult.values.push(smartObject);

                                        return results;
                                    }, []);
                                })
                            )
                        );
                    }
                    return $queries.length > 0 ? zip(...$queries).pipe(
                        mergeMap((results) => {
                            return of(_.flatten(results) as QuerySearchResultDto[]);
                        })
                    ) : of([]);
                }));
    }

    searchSo(
        identity: IdentityRequest,
        skip: number,
        limit: number,
        search: string,
        query: SearchSODto,
        count: boolean
    ): Observable<SmartObjectDto[] | number> {

        const combinedQuerries = this.combineSysQueries(query, search, skip, limit);// combine filters from SysQuery Object and replace search && skip && limit           
        if (!combinedQuerries.query.modelKey && !combinedQuerries.query.allModels) {
            return of([]);
        }
        return this.settingsDataService.getContext().pipe(
            mergeMap((context) => {
                return of(context.smartmodels).pipe(
                    mergeMap((allModels) => {
                        return of(_.reduce(allModels, (results, smartModel) => {
                            results.allModels = allModels;
                            if (combinedQuerries.query.allModels) {
                                results.smartModels.push(smartModel);
                            } else if (combinedQuerries.query.modelKey === smartModel.key) {
                                results.smartModels.push(smartModel);
                            }

                            return results;
                        }, {
                            smartModels: [],
                            allModels: []
                        }));
                    })
                )
            }),
            mergeMap((models: { smartModels: SmartModelDto[]; allModels: SmartModelDto[] }) => {
                const aggregates: any[] = [];
                const { smartModels, allModels } = models;

                const hasChildrenfilters = combinedQuerries.query.filter &&
                    combinedQuerries.query.filter.find(filter => filter.value.models && filter.value.models.length > 0 &&
                        !(filter.value.models.length === 1 && ['exists', 'isNull'].indexOf(filter.value.criteria) !== -1))

                if (hasChildrenfilters) {
                    const facetPipelines: FacetAggregationPipeline[] = this.searchQueryBuilderHead.facetPipelines(identity.customerKey,
                        !!combinedQuerries.query.deleted, combinedQuerries.query.filter, smartModels, allModels);
                    if (facetPipelines.length === 1) {
                        aggregates.push(
                            ...facetPipelines[0].pipeline);
                    } else {
                        aggregates.push(
                            this.searchQueryBuilderHead.facet(facetPipelines),
                            ...this.searchQueryBuilderHead.unwindFacets(facetPipelines));
                    }
                    aggregates.push(
                        ...this.searchQueryBuilderHead.lookUpforParent('uuid', [], false, false));
                }

                aggregates.push(
                    this.searchQueryBuilderHead.match(identity.customerKey,
                        !!combinedQuerries.query.deleted, combinedQuerries.query.filter,
                        smartModels)
                );

                if (combinedQuerries.search) {
                    const models = smartModels.map((smartModel: SmartModelDto) => smartModel.key);
                    aggregates.push(this.searchQueryBuilderHead.fullTextSearch(
                        models,
                        combinedQuerries.search));
                }

                if (count) {
                    aggregates.push({ $count: 'total' });
                    return this.smartObjectsService.aggregateRaw(aggregates).pipe(
                        mergeMap((data: [{ total: number }]) => {
                            return (data && data.length > 0) ? of(data[0].total) : of(0);
                        })
                    )
                }
                if (combinedQuerries.query?.order?.length > 0) {
                    aggregates.push(this.searchQueryBuilderHead._getMultipleSort(combinedQuerries.query.order));
                }
                aggregates.push(
                    this.searchQueryBuilderHead._getSkip(combinedQuerries.skip, combinedQuerries.limit),
                    this.searchQueryBuilderHead._getLimit(combinedQuerries.limit));

                return this.smartObjectsService.aggregate(aggregates);
            })
        );


    }



    sendSearchRequest(customerKey: string, queries): Observable<QuerySearchResultDto[]> {
        return defer(() => {
            if (!es_url) {
                return of([]);
            }
            let raws = '';
            const config: AxiosRequestConfig = {
                url: `${es_url}/_msearch/template`,
                headers: { 'Content-Type': 'application/x-ndjson' },
                method: 'GET',
            };

            _.forEach(queries, (query) => {
                const index = { index: query.index };
                const querycContent = { id: query.id, params: query.params };
                let raw = JSON.stringify(index) + '\n';
                raw += JSON.stringify(querycContent) + '\n';
                raws += raw;
            });

            if (raws !== '') {
                config.data = raws;
                return this.httpService.request(config).pipe(
                    catchError((err) => {
                        return of(null);
                    }),
                    map((response) => {
                        if (response !== null && response.data && response.data.responses) {
                            return _.reduce(response.data.responses, (results, resp) => {
                                if (resp.error === undefined && resp.hits.total.value > 0 && resp.hits.hits.length > 0) {
                                    const resultType = (resp.hits.hits[0]._index === `${customerKey}_so_index`) ? 'so' : 'file';
                                    results.push({
                                        header: {
                                            type: resultType,
                                            name: resultType === 'so' ? resp.hits.hits[0]._source.modelKey : '',
                                            count: resp.hits.total.value,
                                        },
                                        values: resp.hits.hits,
                                    });
                                }
                                return results;
                            }, []);

                        } else {
                            return [];
                        }
                    }),
                );
            } else {
                return of([]);
            }
        })
    }

    getUniqueValues(pipeline?: any[]): Observable<any[]> {
        return this.smartObjectsService.aggregateRaw(pipeline).pipe(
            mergeMap((data: { value: string }[]) => {
                return of(data.map(d => d.value));
            })
        )
    }

}
