import { CustomerInitResultDto } from '@algotech-ce/core';

const es_url = process.env.ES_URL ? process.env.ES_URL : 'http://ms-search:9200';

export const docIndexQuery: CustomerInitResultDto = {
    key: 'Documents index', value: 'ko', query: `${es_url}/$_doc_index?pretty`, data: {
        settings: {
            analysis: {
                analyzer: {
                    asciifolding_analyzer: {
                        type: 'custom',
                        tokenizer: 'classic',
                        filter: [
                            'lowercase',
                            'my_ascii_folding',
                        ],
                    },
                },
                filter: {
                    my_ascii_folding: {
                        type: 'asciifolding',
                        preserve_original: true,
                    },
                },
            },
        },
        mappings: {
            properties: {
                uuid: {
                    type: 'keyword',
                    store: true,
                },
                title: {
                    type: 'text',
                    analyzer: 'asciifolding_analyzer',
                    term_vector: 'with_positions_offsets',
                    store: true,
                },
                ext: {
                    type: 'keyword',
                    store: true,
                },
                annotations: {
                    type: 'text',
                    term_vector: 'with_positions_offsets',
                    store: true,
                },
                attachment: {
                    properties: {
                        author: {
                            type: 'text',
                            term_vector: 'with_positions_offsets',

                        },
                        content: {
                            type: 'text',
                            analyzer: 'asciifolding_analyzer',
                            term_vector: 'with_positions_offsets',

                        },
                        content_length: {
                            type: 'long',
                        },
                        content_type: {
                            type: 'text',
                            term_vector: 'with_positions_offsets',

                        },
                        date: {
                            type: 'date',
                        },
                        keywords: {
                            type: 'text',
                            term_vector: 'with_positions_offsets',

                        },
                        language: {
                            type: 'text',
                            term_vector: 'with_positions_offsets',

                        },
                        title: {
                            type: 'text',
                            term_vector: 'with_positions_offsets',

                        },
                    },
                },
                content: {
                    type: 'text',
                    analyzer: 'asciifolding_analyzer',
                    term_vector: 'with_positions_offsets',
                    store: true,
                },
                tags: {
                    type: 'keyword',
                    store: true,
                },
                modelKeys: {
                    type: 'keyword',
                    store: true,
                },
                metadatas: {
                    type: 'nested',
                    properties: {
                        key: {
                            type: 'keyword',
                            store: true,
                        },
                        value: {
                            type: 'text',
                            analyzer: 'asciifolding_analyzer',
                            term_vector: 'with_positions_offsets',
                            position_increment_gap: 100,
                            store: true,
                        },
                    },
                },
            },
        },
    },
};

export const pipelineQuery: CustomerInitResultDto = {
    key: 'Documents pipeline', value: 'ko', query: `${es_url}/_ingest/pipeline/docs-pipeline`, data: {
        description: 'Algo\'Tech search in file pipeline',
        processors: [
            {
                attachment: {
                    field: 'content',
                    indexed_chars: -1,
                    on_failure: [
                        {
                            set: {
                                field: 'error',
                                value: '{{ _ingest.on_failure_message }}',
                            },
                        },
                    ],
                },
                remove: {
                    field: 'content',
                },
            },
        ],
    },
};

export const templateDocQuery: CustomerInitResultDto = {
    key: 'Documents template', value: 'ko', query: `${es_url}/_scripts/template_doc`, data: {
        script: {
            lang: 'mustache',
            // tslint:disable-next-line: max-line-length
            source: '{ {{#setSource}}\"_source\": {{#toJson}}source{{/toJson}}, {{/setSource}} {{#from}}\"from\": {{from}},{{/from}} {{#size}}\"size\": {{size}},{{/size}} \"min_score\": 0.01, \"query\": {\"bool\": { {{#setFilter}}\"filter\": [ {{#modelKeys}} {\"terms\": {\"modelKeys\": {{#join}}modelKeys{{/join}} }} {{/modelKeys}} {{#modelKeys}} {{#tags}},{{/tags}} {{/modelKeys}} {{#tags}} {\"terms\": {\"tags\": {{#join}}tags{{/join}} }} {{/tags}} ] ,{{/setFilter}} {{#metadatas}}\"must\": [ {{#nested}} {{^isFirst}},{{/isFirst}} { \"nested\": { \"path\": \"metadatas\", \"query\": { \"bool\": { \"filter\": { \"term\": { \"metadatas.key\": \"{{key}}\" } }, \"must\": {{#toJson}}queryStr{{/toJson}} } } } } {{/nested}} ], {{/metadatas}} \"should\": [ { \"bool\": { \"should\": {{#join}}texts{{/join}} } }] } },\"highlight\":{\"pre_tags\":[\"<b>\"],\"post_tags\":[\"</b>\"],\"fields\":{\"title\":{},\"attachment.content\":{\"fragment_size\":50,\"number_of_fragments\":10,\"options\":{\"return_offsets\":true}}} } }',
        },
    },
};

export const templateSOQuery: CustomerInitResultDto = {
    key: 'SO template', value: 'ko', query: `${es_url}/_scripts/template_so`, data: {
        script: {
            lang: 'mustache',
            // tslint:disable-next-line: max-line-length
            source: '{ \"_source\": [\"uuid\", \"modelKey\", \"properties\", \"documents\", \"tags\"], {{#from}}\"from\": {{from}},{{/from}} {{#size}}\"size\": {{size}},{{/size}} {{#min_score}}\"min_score\": {{min_score}},{{/min_score}} \"query\": { \"bool\": { \"filter\": [ { \"terms\": { \"modelKey\": {{#toJson}}modelKeys{{/toJson}} }  }{{#hasTags}}, {\"terms\": { \"tags\": {{#toJson}}tags{{/toJson}} }}{{/hasTags}}] {{#must}}, \"must\": [ {{#nested}} {{^isFirst}},{{/isFirst}} { \"nested\": { \"path\": \"properties\", \"query\": { \"bool\": { \"filter\": { \"terms\": { \"properties.key\": [{{#keys}} {{^isFirst}},{{/isFirst}} \"{{value}}\" {{/keys}}] } } {{#must_should}} {{#isQueryStr}}, \"should\": {{#toJson}}queryStr{{/toJson}} {{/isQueryStr}} {{/must_should}} {{#must_must}}, \"must\": [ {{#isValues}} { \"terms\": { \"properties.asKeyword\": [ {{#values}} {{^isFirst}}, {{/isFirst}} \"{{value}}\" {{/values}} ] } }{{/isValues}} ] {{/must_must}} } } } } {{/nested}} ] {{/must}} } } }',
            search_type: 'dfs_query_then_fetch',
        },
    },
};

export const templateSearchSOQuery: CustomerInitResultDto = {
    key: 'SO template Search', value: 'ko', query: `${es_url}/_scripts/template_search_so`, data: {
        script: {
            lang: 'mustache',
            // tslint:disable-next-line: max-line-length
            source: "{\"_source\":[\"uuid\",\"modelKey\",\"properties\",\"documents\",\"tags\"],{{#from}}\"from\":{{from}},{{/from}}{{#size}}\"size\":{{size}},{{/size}}{{#min_score}}\"min_score\":{{min_score}},{{/min_score}}{{#has_sort}}\"sort\":[ {{#sort}} {{^isFirst}},{{/isFirst}} {{#isScore}} \"_score\" {{/isScore}} {{^isScore}} { \"{{key}}\": { \"order\" : \"{{order}}\", \"nested\" : { \"path\": \"properties\", \"filter\": { \"term\": { \"properties.key\": \"{{filter}}\"}}  } } } {{/isScore}} {{/sort}} ],{{/has_sort}}\"query\":{\"bool\":{\"filter\":[{\"terms\":{\"modelKey\":{{#toJson}}modelKeys{{/toJson}}}}{{#has_uuids}},{\"terms\":{\"uuid\":{{#toJson}}uuids{{/toJson}}}}{{/has_uuids}}{{#has_tags}},{\"terms\":{\"tags\":{{#toJson}}tags{{/toJson}}}}{{/has_tags}}{{#filters}},{\"nested\":{\"path\":\"properties\",\"query\":{\"bool\":{ \"filter\":{\"terms\":{\"properties.key\":[{{#keys}}{{^isFirst}},{{/isFirst}}\"{{value}}\"{{/keys}}]}} {{#equals}} , \"must\" :{\"terms\":{ \"properties.asKeyword\" :[ {{#values}} {{^isFirst}} , {{/isFirst}} \"{{value}}\" {{/values}} ]} }{{/equals}} }}}}{{/filters}}] {{#has_must_queries}},\"must\":[{{#queries}} {{^isFirst}},{{/isFirst}} {{#exists}} {\"nested\":{\"path\":\"properties\",\"query\":{ \"terms\": { \"properties.key\": [ {{#keys}}{{^isFirst}},{{/isFirst}}\"{{value}}\" {{/keys}}] } }}} {{/exists}} {{^exists}} {\"nested\":{\"path\":\"properties\",\"query\":{\"bool\":{ \"filter\":{\"terms\":{\"properties.key\":[{{#keys}}{{^isFirst}},{{/isFirst}}\"{{value}}\"{{/keys}}]}} {{#regex}} ,\"must\":{{#toJson}}regex{{/toJson}}{{/regex}} {{#range}} ,\"must\":{\"range\":{ {{#isNumber}} \"properties.asNumber\" {{/isNumber}} {{#isDate}} \"properties.asDate\" {{/isDate}} :{ {{#ops}} {{^isFirst}}, {{/isFirst}} \"{{op}}\" : \"{{value}}\" {{/ops}}}}} {{/range}} {{#equals}} , {{#not}} \"must_not\" {{/not}} {{^not}} \"must\" {{/not}} :{\"terms\":{ {{#isString}} \"properties.asKeyword\" {{/isString}} {{#isNumber}} \"properties.asNumber\" {{/isNumber}} {{#isDate}} \"properties.asDate\" {{/isDate}} {{#isBoolean}} \"properties.asBoolean\" {{/isBoolean}} :{{#isNull}}[\"VISION_NULL_VAL\"]{{/isNull}}{{^isNull}}[ {{#values}} {{^isFirst}} , {{/isFirst}} \"{{value}}\" {{/values}} ]{{/isNull}}} }{{/equals}} }}}} {{/exists}} {{/queries}}] {{/has_must_queries}}}}}",
            search_type: 'dfs_query_then_fetch',
        },
    },
};

export const templateNestedValuesSOQuery: CustomerInitResultDto = {
    key: 'Nested Values template', value: 'ko', query: `${es_url}/_scripts/template_aggregate_values`, data: {
        script: {
            lang: 'mustache',
            // tslint:disable-next-line: max-line-length
            source: '{\"size\":0,\"aggs\":{\"filter_modelKey\":{\"filter\":{\"bool\":{\"filter\":{\"term\":{\"modelKey\":\"{{modelKey}}\"}},\"must\":[{\"nested\":{\"path\":\"properties\",\"query\":{\"bool\":{ {{#valueRegExp}} \"must\":{\"query_string\":{\"query\":\"{{valueRegExp}}\",\"fields\":[\"properties.asString\"],\"analyze_wildcard\":true,\"auto_generate_synonyms_phrase_query\":false}}, {{/valueRegExp}} \"filter\":[{\"term\":{\"properties.key\":\"{{property}}\"}}]}}}}]}},\"aggs\":{\"filter_nested\":{\"nested\":{\"path\":\"properties\"},\"aggs\":{\"filter_keys\":{\"filter\":{\"bool\":{\"filter\":[{\"term\":{\"properties.key\":\"{{property}}\"}}]}},\"aggs\":{\"values\":{\"terms\":{\"field\":\"properties.asKeyword\" {{#size}},\"size\":{{size}} {{/size}} {{#order}},\"order\":{ \"_key\": \"{{order}}\" }{{/order}} }}}}}}}}}}',
            search_type: 'dfs_query_then_fetch',
        },
    },
};

export const postqueries: CustomerInitResultDto[] = [templateDocQuery, templateSOQuery, templateSearchSOQuery, templateNestedValuesSOQuery];

export const putqueries: CustomerInitResultDto[] = [docIndexQuery, pipelineQuery];

export const deleteDocQuery: CustomerInitResultDto = {
    key: 'Documents delete index', value: 'ko', query: `${es_url}/$_doc_index`,
};
export const deletequeries: CustomerInitResultDto[] = [deleteDocQuery];
