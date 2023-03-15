import { PairDto, QuerySearchDto, SearchSOFilterDto, SearchSOFilterValueDto, SmartModelDto, SmartPropertyModelDto } from '@algotech/core';
import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { EsdocQueryModel, FacetAggregationPipeline } from '../../interfaces';
import { SmartObjectsBaseService } from '../smart-objects/smart-objects.base.service';

@Injectable()
export class SearchQueryBuilderHead {
    constructor() { }
    forbiddenCharacters = [' ', '+', '-', '=', '&&', '||', '>', '<', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\', '/', ','];

    _getKey(key: string) {
        if (key === 'uuid') {
            return 'uuid';
        } else if (key === 'sys:tags') {
            return 'skills.atTag.tags';
        } else if (key === 'sys:updateDate') {
            return 'updateDate';
        } else if (key === 'sys:createdDate') {
            return 'createdDate';
        } else {
            return `properties.${key}`;
        }
    }

    _escapRegex(value: string): string {
        const specialCar = ['\\', '.', '-', '?', '+', '*', '[', ']', '{', '}', '(', ')', '^', '$', '|'];

        if (!_.isString(value)) {
            return value;
        }

        // replace all
        for (const car of specialCar) {
            const pieces = value.split(car);
            value = pieces.join(`\\${car}`);
        }
        return value;
    }

    _startsWith(value: string, propertyKey: string) {
        return { [this._getKey(propertyKey)]: new RegExp(`^${this._escapRegex(value)}.*`, 'i') };
    }

    _dontStartsWith(value: string, propertyKey: string) {
        return { [this._getKey(propertyKey)]: new RegExp(`^(?!${this._escapRegex(value)}).*`, 'i') };
    }

    _endsWith(value: string, propertyKey: string) {
        return { [this._getKey(propertyKey)]: new RegExp(`.*${this._escapRegex(value)}$`, 'i') };
    }

    _contains(value: string, propertyKey: string) {
        return { [this._getKey(propertyKey)]: new RegExp(`.*${this._escapRegex(value)}.*`, 'i') };
    }

    _doesntContain(value: string, propertyKey: string) {
        return { [this._getKey(propertyKey)]: new RegExp(`^(?!.*${this._escapRegex(value)}).*`, 'i') };
    }

    _equals(value: any, propertyKey: string, not: boolean = false) {
        return { [this._getKey(propertyKey)]: not ? { $ne: value } : { $eq: value } };
    }

    _isNull(propertyKey: string) {
        return { $or: [{ [this._getKey(propertyKey)]: { $eq: null } }, { [this._getKey(propertyKey)]: { $size: 0 } }] };
    }

    _exists(propertyKey: string) {
        return { [this._getKey(propertyKey)]: { $exists: true } };
    }

    _isIn(values: any[], propertyKey: string, not: boolean = false) {
        return { [this._getKey(propertyKey)]: not ? { $nin: values } : { $in: values } };
    }

    _isgt(value: any, propertyKey: string, equals: boolean = false) {
        return { [this._getKey(propertyKey)]: equals ? { $gte: value } : { $gt: value } };
    }

    _islt(value: any, propertyKey: string, equals: boolean = false) {
        return { [this._getKey(propertyKey)]: equals ? { $lte: value } : { $lt: value } };
    }

    _isBetween(value: any, secondeValue: any, propertyKey: string, equals: boolean = false) {
        return _.merge(
            this._isgt(value, propertyKey, equals),
            this._islt(secondeValue, propertyKey, equals));
    }

    _getSkip(skip: number, limit: number) {
        return { $skip: skip * limit }
    }

    _getLimit(limit: number) {
        return { $limit: limit }
    }

    _getSort(propertyKey: string, order: number, onKey: boolean = false) {
        return onKey ? { $sort: { [propertyKey]: order } } : { $sort: { [this._getKey(propertyKey)]: order } };
    }

    _getMultipleSort(order: PairDto[]) {
        if (order?.length > 0) {
            const sortProperties = {};

            for (const pair of order) {
                sortProperties[this._getKey(pair.key)] = (!pair.value || pair.value === 'desc' || pair.value === -1) ? -1 : 1;
            }
            return { $sort: sortProperties };
        }
    }

    _queryStringQuery(values: string[], fieldNames: string[], operation: 'startsWith' | 'notStartsWith' | 'endWith' | 'contains') {
        let keyQuery;

        keyQuery = [];
        if (operation === 'contains') {
            _.forEach(this.forbiddenCharacters, char => {
                values = _.flatten(_.reduce(values, (result, value) => {
                    result.push(value.split(char));
                    return result;
                }, []));
            });
        }

        _.forEach(values, (value) => {
            if (_.trim(value) !== '') {
                switch (operation) {
                    case 'startsWith':
                        keyQuery.push({
                            query_string: {
                                query: `/${value}.*/`,
                                fields: [...fieldNames],
                                analyze_wildcard: true,
                                escape: false,
                                auto_generate_synonyms_phrase_query: false,
                                boost: 100,
                            },
                        });

                        break;
                    case 'notStartsWith':
                        keyQuery.push({
                            query_string: {
                                query: `!/${value}.*/`,
                                fields: [...fieldNames],
                                analyze_wildcard: true,
                                escape: false,
                                auto_generate_synonyms_phrase_query: false,
                                boost: 100,
                            },
                        });

                        break;
                    case 'endWith':
                        keyQuery.push({
                            query_string: {
                                query: `/.*${value}/`,
                                fields: [...fieldNames],
                                analyze_wildcard: true,
                                escape: false,
                                auto_generate_synonyms_phrase_query: false,
                                boost: 100,
                            },
                        });
                        break;
                    default:
                        keyQuery.push({
                            query_string: {
                                query: `/.*${value}.*/`,
                                fields: [...fieldNames],
                                analyze_wildcard: true,
                                auto_generate_synonyms_phrase_query: false,
                                boost: 100,
                            },
                        });
                        break;
                }
            }
        });
        return keyQuery;
    }

    formatDate(value: any, type: string) {
        return Array.isArray(value) ? value.map(val => type && type.toUpperCase().startsWith('DATE') ? new Date(val) : val) :
            type && type.toUpperCase().startsWith('DATE') ? new Date(value) : value;
    }

    mapCriteraOnsearchTextProperty(value: SearchSOFilterValueDto, models: SmartModelDto[]) {
        if (Array.isArray(value.value) && value.criteria !== 'in') {
            return {};
        }
        const formatedValues = this.formatDate(value.value, value.type);
        switch (value.criteria) {
            case 'startsWith':
                return this._contains(`¤${formatedValues}`, SmartObjectsBaseService.SEARCH_KEY);
            case 'notStartsWith':
                return this._doesntContain(`¤${formatedValues}`, SmartObjectsBaseService.SEARCH_KEY);
            case 'endWith':
                return this._contains(`${formatedValues}¤`, SmartObjectsBaseService.SEARCH_KEY);
            case 'contains':
                return this._contains(`${formatedValues}`, SmartObjectsBaseService.SEARCH_KEY);
            case 'equals':
                return value.type === 'so:' ? {
                    $or: models.map((model: SmartModelDto) =>
                        model.properties.reduce((results, currentValue: SmartPropertyModelDto) => {
                            if (currentValue.keyType.startsWith('so:')) {
                                results.push(this._isIn(Array.isArray(formatedValues) ? formatedValues : [formatedValues], currentValue.key))
                            }
                            return results;
                        }, [])).flat()
                } : this._contains(`¤${formatedValues}¤`, SmartObjectsBaseService.SEARCH_KEY);
            case 'different':
                return this._doesntContain(`¤${formatedValues}¤`, SmartObjectsBaseService.SEARCH_KEY);
            case 'in':
                return {
                    $or: (Array.isArray(formatedValues) ? formatedValues : [formatedValues])
                        .map(val => this._contains(`¤${val}¤`, SmartObjectsBaseService.SEARCH_KEY))
                };
            default:
                return {};
        }
    }

    mapCritera(value: SearchSOFilterValueDto, propertyKey: string) {
        const formatedValues = this.formatDate(value.value, value.type);
        switch (value.criteria) {
            case 'startsWith':
                return this._startsWith(formatedValues, propertyKey);
            case 'notStartsWith':
                return this._dontStartsWith(formatedValues, propertyKey);
            case 'endWith':
                return this._endsWith(formatedValues, propertyKey);
            case 'contains':
                return this._contains(formatedValues, propertyKey);
            case 'equals':
                return this._equals(formatedValues, propertyKey);
            case 'different':
                return this._equals(formatedValues, propertyKey, true);
            case 'gt':
                return this._isgt(formatedValues, propertyKey);
            case 'lt':
                return this._islt(formatedValues, propertyKey);
            case 'gte':
                return this._isgt(formatedValues, propertyKey, true);
            case 'lte':
                return this._islt(formatedValues, propertyKey, true);
            case 'isNull':
                return this._isNull(propertyKey);
            case 'in':
                return this._isIn(Array.isArray(formatedValues) ? formatedValues : [formatedValues], propertyKey);
            case 'between':
                const formatedsecondValue = this.formatDate(value.secondValue, value.type)
                return this._isBetween(formatedValues, formatedsecondValue, propertyKey, true);
            case 'exists':
                return this._exists(propertyKey);
        }
    }

    getUniqueValuesAggregation(customerKey: string,
        skip, limit: number, order: number, modelKey: string, propertyKey: string, startwith): any[] {
        return [

            {
                $match: Object.assign({ modelKey, deleted: false, customerKey },
                    startwith ? this._startsWith(startwith, propertyKey) : this._exists(propertyKey))
            },
            {
                $group: {
                    _id: this._getKey(propertyKey),
                    value: { $addToSet: `$${this._getKey(propertyKey)}` }
                }
            },
            { $unwind: "$value" },
            { $project: { _id: 0, value: 1 } },
            this._getSort('value', order, true),
            this._getSkip(skip, limit),
            this._getLimit(limit),
        ];
    }

    fullTextSearch(modelKeys: string[], text: string | string[]) {
        if (Array.isArray(text)) {
            return { $match: { modelKey: { $in: modelKeys }, $and: text.map(t => this._contains(t, SmartObjectsBaseService.SEARCH_KEY)) } };
        }
        return { $match: _.merge({ modelKey: { $in: modelKeys } }, this._contains(text, SmartObjectsBaseService.SEARCH_KEY)) };
    }

    match(customerKey: string, deleted: boolean, filters: SearchSOFilterDto[], models: SmartModelDto[]) {
        const $match = { customerKey, deleted, modelKey: { $in: models.map((sm: SmartModelDto) => sm.key) } }
        if (!filters) {
            return { $match };
        }
        filters.forEach((filter: SearchSOFilterDto) => {
            if (!filter.value.models ||
                filter.value.models.length === 0 ||
                (filter.value.models && filter.value.models.length === 1 && ['exists', 'isNull'].indexOf(filter.value.criteria) !== -1)) {
                    
                if (filter.allKeys) {
                    Object.assign($match, this.mapCriteraOnsearchTextProperty(filter.value, models));
                } else {
                    Object.assign($match, this.mapCritera(filter.value, filter.key));
                }
            }
        })
        return { $match };
    }

    facet(pipelines: FacetAggregationPipeline[]) {
        const facet = { $facet: {} };
        pipelines.forEach((pipeline: FacetAggregationPipeline) => {
            facet.$facet[pipeline.key] = pipeline.pipeline;
        })
        return facet;
    }

    unwindAndRepalceRoot(key: string) {
        return [
            { $unwind: `$${key}` },
            { $replaceRoot: { newRoot: `$${key}` } }
        ]
    }

    unwindFacets(pipelines: FacetAggregationPipeline[]) {

        return [
            { $project: { common: { $setIntersection: pipelines.map((pipeline: FacetAggregationPipeline) => `$${pipeline.key}`) } } },
            ...this.unwindAndRepalceRoot('common')
        ];

    }

    lookUpforParent(childKey: string, models: string[], deleted: boolean, projectUUids: boolean = true) {
        const pipeline: any[] = [
            {
                $lookup:
                {
                    from: 'smartobjects',
                    localField: "uuid",
                    foreignField: this._getKey(childKey),
                    as: 'parent'
                }
            },
            { $project: { parent: 1, _id: 0 } },
            ...this.unwindAndRepalceRoot('parent'),

        ];
        if (projectUUids) {
            pipeline.push(
                { $project: { uuid: 1, modelKey: 1, deleted: 1, _id: 0 } },
                { $match: { modelKey: { $in: models }, deleted } })
        }
        return pipeline;
    }

    getfiltersFromTexts(texts: string[], propertyKey: string, exactValue: boolean = false, type = 'any') {
        if (texts.length > 0) {
            if (propertyKey) {

                return texts.map((text: string) => {
                    const search = type === 'number' ? +text :
                        type?.startsWith('date') ? new Date(text) : text;
                    return {
                        type: 'filter',
                        key: propertyKey,
                        value: {
                            value: search,
                            criteria: !_.isString(search) || exactValue ? 'equals' : 'contains',
                            type
                        }
                    } as SearchSOFilterDto;
                });
            } else {
                return texts.map((text: string) => ({
                    type: 'filter',
                    allKeys: true,
                    value: {
                        value: exactValue ? `${text}${SmartObjectsBaseService.SEARCH_SEPARATOR}` : text,
                        criteria: 'contains',
                        type
                    }
                } as SearchSOFilterDto))
            }
        }

        return [{
            type: 'filter',
            allKeys: propertyKey === '',
            key: propertyKey,
            value: {

                criteria: 'exists',
                type: 'string'
            }
        } as SearchSOFilterDto];
    }

    getfiltersFromQuerySearch(query: QuerySearchDto, smartModel: SmartModelDto) {
        const model = query.so.find((filter) => filter.modelKey === smartModel.key);

        const filters: SearchSOFilterDto[] = model?.props?.length > 0 ? _.reduce(model.props, (resutls, prop) => {
            if (prop.value && !_.isEqual(prop.value, [null])) {
                resutls.push({
                    type: 'filter',
                    key: prop.key,
                    value: {
                        value: prop.value,
                        criteria: 'in',
                        type: 'string'
                    }
                } as SearchSOFilterDto)
            } else {
                const type = smartModel.properties.find((p) => p.key === prop.key)?.keyType;
                resutls.push(...this.getfiltersFromTexts(query.texts, prop.key, query.exactValue, type));
            }
            return resutls;
        }, []) : this.getfiltersFromTexts(query.texts, '', query.exactValue);

        if (query.tags.length > 0) {
            filters.push(({
                type: 'filter',
                key: 'sys:tags',
                value: {
                    value: query.tags,
                    criteria: 'in',
                    type: 'string'
                }
            }))
        }
        return filters;

    }

    PipelineForQuerySearch(customerKey: string, query: QuerySearchDto, target: string, skip: number, limit: number, models: SmartModelDto[]): any[] {
        if (target !== '') {
            const smartModel = models.find((model: SmartModelDto) => target.split(':')[1] === model.key);
            return [
                this.match(customerKey,
                    false,
                    this.getfiltersFromQuerySearch(query, smartModel), [smartModel]),
                this._getSkip(skip, limit),
                this._getLimit(limit)]

        }
        const facetPipelines: FacetAggregationPipeline[] = query.so.map(filter => {
            const facetPipeline: FacetAggregationPipeline = {
                key: filter.modelKey,
                pipeline: []
            }
            const smartModel = models.find((model: SmartModelDto) => filter.modelKey === model.key);
            facetPipeline.pipeline = [
                this.match(customerKey,
                    false,
                    this.getfiltersFromQuerySearch(query, smartModel), [smartModel]),
                { $project: { _id: 0, uuid: 1 } },
                this._getSkip(skip, limit),
                this._getLimit(limit)];
            return facetPipeline;
        });
        return [
            this.facet(facetPipelines),
            { $project: { common: { $setUnion: facetPipelines.map((pipeline: FacetAggregationPipeline) => `$${pipeline.key}`) } } },
            ...this.unwindAndRepalceRoot('common'),
            ...this.lookUpforParent('uuid', [], false, false)
        ];
    }

    _mergeSimilarFacets(filters: SearchSOFilterDto[]): FacetAggregationPipeline[] {
        return _.reduce(filters
            .filter((filter: SearchSOFilterDto) => filter.key && filter.value.models &&
                filter.value.models.length > 0),
            (results, filter) => {
                const keys = (filter.key as string).split('.');
                let key;
                if (keys.length === filter.value.models.length) {
                    key = keys.join('-');
                    results.push({
                        key,
                        filters: [filter],
                        pipeline: []
                    } as FacetAggregationPipeline)
                } else {
                    keys.pop();
                    key = keys.join('-');
                    let findFacet: FacetAggregationPipeline = results.find((facet: FacetAggregationPipeline) => facet.key === key);
                    if (!findFacet) {
                        findFacet = {
                            key,
                            filters: [],
                            pipeline: []
                        };
                        results.push(findFacet);
                    }
                    findFacet.filters.push(filter);
                }
                return results;
            }, []);

    }

    facetPipelines(customerKey: string, deleted: boolean, filters: SearchSOFilterDto[], models: SmartModelDto[], allModels: SmartModelDto[]): FacetAggregationPipeline[] {

        return this._mergeSimilarFacets(filters)
            .map((facet: FacetAggregationPipeline) => {
                const firstfilter: SearchSOFilterDto = facet.filters[0];
                const firstfilterkeys = (firstfilter.key as string).split('.').reverse();
                firstfilter.value.models.reverse().forEach((model: string, index: number) => {
                    if (index === 0) {
                        const smartModel = allModels.find((sm: SmartModelDto) => sm.key === model);
                        facet.pipeline.push(this.match(customerKey, deleted,
                            facet.filters.map((filter: SearchSOFilterDto) => {
                                const keys = (filter.key as string).split('.').reverse();
                                return {
                                    key: keys[0],
                                    allKeys: keys.length === filter.value.models.length,
                                    value: {
                                        ...filter.value,
                                        models: []
                                    }
                                };
                            }), [smartModel]));
                    }
                    const keysIndex = firstfilterkeys.length === firstfilter.value.models.length ? index : index + 1;
                    facet.pipeline.push(...this.lookUpforParent(firstfilterkeys[keysIndex],
                        index === firstfilter.value.models.length - 1 ? models.map((sm: SmartModelDto) => sm.key) : [firstfilter.value.models[index + 1]], deleted));
                });

                return facet;
            });
    }

    setdocQueries(customerKey: string, skip: number, limit: number, query: QuerySearchDto, modelkeys: string[]) {
        let wildCards;
        const docQuery: EsdocQueryModel = {
            index: `${customerKey}_doc_index`,
            id: 'template_doc',
            params: {
                setSource: {
                    source: ['title', 'tags'],
                },
                from: skip * limit,
                size: limit,
                texts: [],
                titles: [],
                nested: [],
                metadatas: query.metadatas.length > 0,
            },
        };

        docQuery.params = (query.tags && query.tags.length > 0) ?
            Object.assign(docQuery.params, { setFilter: { tags: [JSON.stringify(query.tags)], modelKeys: [JSON.stringify(modelkeys)] } }) :
            Object.assign(docQuery.params, { setFilter: { modelKeys: [JSON.stringify(modelkeys)] } });

        wildCards = _.flatten(_.map(query.texts, (text) => {
            return [
                { wildcard: { title: `*${text.toLowerCase()}*` } },
                { wildcard: { 'attachment.content': `*${text.toLowerCase()}*` } },
            ];
        }));

        docQuery.params.nested = _.map(query.metadatas, (key, index) => {
            return {
                isFirst: index === 0,
                key,
                queryStr: this._queryStringQuery(query.texts, ['metadatas.value'], 'contains'),
            };
        });

        docQuery.params.texts.push(JSON.stringify(wildCards));
        return docQuery;
    }
}