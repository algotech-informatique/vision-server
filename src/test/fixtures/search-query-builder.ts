import { SearchSOFilterDto, SmartModelDto } from '@algotech-ce/core';
import { FacetAggregationPipeline } from '../../interfaces';

export const model1: SmartModelDto = {
  key: 'model1',
  domainKey: '',
  system: false,
  uniqueKeys: [],
  displayName: [],
  properties: [{
    displayName: [],
    hidden: false,
    key: 'toto',
    keyType: 'string',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }, {
    displayName: [],
    hidden: false,
    key: 'tata',
    keyType: 'string',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }, {
    displayName: [],
    hidden: false,
    key: 'test',
    keyType: 'string',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }, {
    displayName: [],
    hidden: false,
    key: 'titi',
    keyType: 'string',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }],
  skills: {},
  permissions: { R: [], RW: [] },
};

export const model2: SmartModelDto = {
  key: 'model2',
  domainKey: '',
  system: false,
  uniqueKeys: [],
  displayName: [],
  properties: [],
  skills: {},
  permissions: { R: [], RW: [] },
};

export const model3: SmartModelDto = {
  key: 'model3',
  domainKey: '',
  system: false,
  uniqueKeys: [],
  displayName: [],
  properties: [{
    displayName: [],
    hidden: false,
    key: 'toto',
    keyType: 'so:test',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }, {
    displayName: [],
    hidden: false,
    key: 'tata',
    keyType: 'so:tata',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }, {
    displayName: [],
    hidden: false,
    key: 'test',
    keyType: 'string',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }, {
    displayName: [],
    hidden: false,
    key: 'titi',
    keyType: 'string',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }],
  skills: {},
  permissions: { R: [], RW: [] },
};

export const model4: SmartModelDto = {
  key: 'model4',
  domainKey: '',
  system: false,
  uniqueKeys: [],
  displayName: [],
  properties: [{
    displayName: [],
    hidden: false,
    key: 'rrrr',
    keyType: 'so:rrrr',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }, {
    displayName: [],
    hidden: false,
    key: 'tata',
    keyType: 'number',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }, {
    displayName: [],
    hidden: false,
    key: 'test',
    keyType: 'string',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }, {
    displayName: [],
    hidden: false,
    key: 'titi',
    keyType: 'string',
    multiple: false,
    permissions: { R: [], RW: [] },
    required: true,
    system: false,
    uuid: '',
  }],
  skills: {},
  permissions: { R: [], RW: [] },
};

export const filterStartWith: SearchSOFilterDto = {
  type: 'filter',
  key: 'key1',
  value: {
    criteria: 'startsWith',
    type: 'string',
    value: '1',
  }
};

export const filterContains: SearchSOFilterDto = {
  type: 'filter',
  key: 'key2',
  value: {
    criteria: 'contains',
    type: 'string',
    value: '1',
  }
};

export const filterEndWith: SearchSOFilterDto = {
  type: 'filter',
  key: 'key3',
  value: {
    criteria: 'endWith',
    type: 'string',
    value: '1',
  }
};

export const filterEquals: SearchSOFilterDto = {
  type: 'filter',
  key: 'key4',
  value: {
    criteria: 'equals',
    type: 'number',
    value: 50,
  }
};

export const filterDifferent: SearchSOFilterDto = {
  type: 'filter',
  key: 'key5',
  value: {
    criteria: 'different',
    type: 'string',
    value: '55'
  }
};

export const filtergt: SearchSOFilterDto = {
  type: 'filter',
  key: 'key6',
  value: {
    criteria: 'gt',
    type: 'number',
    value: 10
  }
};

export const filterlt: SearchSOFilterDto = {
  type: 'filter',
  key: 'key7',
  value: {
    criteria: 'lt',
    type: 'number',
    value: 11
  }
};

export const filtergte: SearchSOFilterDto = {
  type: 'filter',
  key: 'key8',
  value: {
    criteria: 'gte',
    type: 'number',
    value: 10
  }
};

export const filterlte: SearchSOFilterDto = {
  type: 'filter',
  key: 'key9',
  value: {
    criteria: 'lte',
    type: 'number',
    value: 11
  }
};

export const filterisNull: SearchSOFilterDto = {
  type: 'filter',
  key: 'key10',
  value: {
    criteria: 'isNull',
    type: 'string',
    value: ''
  }
};

export const filterisIn: SearchSOFilterDto = {
  type: 'filter',
  key: 'key12',
  value: {
    criteria: 'in',
    type: 'string',
    value: ['zm', 'mj']
  }
};

export const filterbetween: SearchSOFilterDto = {
  type: 'filter',
  key: 'key13',
  value: {
    criteria: 'between',
    type: 'number',
    value: 1,
    secondValue: 5
  }
};

export const filterExists: SearchSOFilterDto = {
  type: 'filter',
  key: 'key14',
  value: {
    criteria: 'exists',
    type: 'string',
    value: ''
  }
};

export const filterNotStartsWith: SearchSOFilterDto = {
  type: 'filter',
  key: 'key15',
  value: {
    criteria: 'notStartsWith',
    type: 'string',
    value: ''
  }
};

export const uniqueValuesAggregationPipeNoValue = [
  {
    $match: {
      modelKey: 'model1',
      deleted: false,
      customerKey: 'customer',
      'properties.prop1': { $exists: true }
    }
  },
  {
    $group: {
      _id: 'properties.prop1',
      value: { $addToSet: '$properties.prop1' }
    }
  },
  { $unwind: "$value" },
  { $project: { _id: 0, value: 1 } },
  { $sort: { 'value': 1 } },
  { $skip: 0 },
  { $limit: 1 }
];

export const uniqueValuesAggregationPipeStarWithValue = [
  {
    $match: {
      modelKey: 'model1',
      deleted: false,
      customerKey: 'customer',
      'properties.prop1': /^s.*/i
    }
  }, {
    $group: {
      _id: 'properties.prop1',
      value: { $addToSet: '$properties.prop1' }
    }
  },
  { $unwind: "$value" },
  { $project: { _id: 0, value: 1 } },
  { $sort: { 'value': 1 } },
  { $skip: 0 },
  { $limit: 1 }
];

export const filters = [
  filterStartWith,
  filterContains,
  filterEndWith,
  filterEquals,
  filterDifferent,
  filtergt,
  filterlt,
  filtergte,
  filterlte,
  filterisNull,
  filterisIn,
  filterbetween,
  filterExists,
];

export const startsWithRegex = { 'properties.key1': /^1.*/i };
export const containsWithRegex = { 'properties.key2': /.*1.*/i };
export const endsWithWithRegex = { 'properties.key3': /.*1$/i };
export const eqRequest = { 'properties.key4': { $eq: 50 } };
export const neRequest = { 'properties.key5': { $ne: '55' } };
export const gtRequest = { 'properties.key6': { $gt: 10 } };
export const ltRequest = { 'properties.key7': { $lt: 11 } };
export const gteRequest = { 'properties.key8': { $gte: 10 } };
export const lteRequest = { 'properties.key9': { $lte: 11 } };
export const nullKey1Request = { $or: [{ 'properties.key10': { $eq: null } }, { 'properties.key10': { $size: 0 } }] };
export const nullKey2Request = { $or: [{ 'properties.key11': { $eq: null } }, { 'properties.key11': { $size: 0 } }] };
export const inRequest = { 'properties.key12': { $in: ['zm', 'mj'] } };
export const betWeenRequest = { 'properties.key13': { $gte: 1, $lte: 5 } };
export const existsRequest = { 'properties.key14': { $exists: true } };

export const searchStartsWithRegex = { 'properties.~__searchtext': /.*¤1.*/i };
export const searchContainsRegex = { 'properties.~__searchtext': /.*1.*/i };
export const searchEndsWithRegex = { 'properties.~__searchtext': /.*1¤.*/i };
export const searchequls = { 'properties.~__searchtext': /.*¤50¤.*/i };
export const searchDifferent = { 'properties.~__searchtext': /^(?!.*¤55¤).*/i };
export const searchisIn = {
  $or: [
    { 'properties.~__searchtext': /.*¤zm¤.*/i },
    { 'properties.~__searchtext': /.*¤mj¤.*/i }
  ]
};

export const $match = Object.assign({
  modelKey: { $in: ['model1', 'model2'] },
  deleted: false,
  customerKey: 'customer',
}, startsWithRegex,
  containsWithRegex,
  endsWithWithRegex,
  eqRequest,
  neRequest,
  gtRequest,
  ltRequest,
  gteRequest,
  lteRequest,
  nullKey1Request,
  inRequest,
  betWeenRequest,
  existsRequest);

export const facePipeline1: FacetAggregationPipeline = {
  key: 'facePipeline1',
  pipeline: [{ $match }]
}

export const facePipeline2: FacetAggregationPipeline = {
  key: 'facePipeline2',
  pipeline: [{ $match }]
}

export const ParentlookUp1 = [
  {
    $lookup:
    {
      from: 'smartobjects',
      localField: 'uuid',
      foreignField: `properties.prop`,
      as: 'parent'
    }
  },
  { $project: { parent: 1, _id: 0 } },
  { $unwind: `$parent` },
  { $replaceRoot: { newRoot: `$parent` } },
  { $project: { uuid: 1, modelKey: 1, deleted: 1, _id: 0 } },
  { $match: { modelKey: { $in: ['model1'] }, deleted: true } },
];

export const ParentlookUp2 = [
  {
    $lookup:
    {
      from: 'smartobjects',
      localField: 'uuid',
      foreignField: `properties.prop`,
      as: 'parent'
    }
  },
  { $project: { parent: 1, _id: 0 } },
  { $unwind: `$parent` },
  { $replaceRoot: { newRoot: `$parent` } },
  { $project: { uuid: 1, modelKey: 1, deleted: 1, _id: 0 } },
  { $match: { modelKey: { $in: ['model1'] }, deleted: false } },
];

export const $facet = { facePipeline1: [{ $match }], facePipeline2: [{ $match }] };

export const filtersSubDoc: SearchSOFilterDto[] = [{
  key: 'toto',
  value: {
    criteria: 'equals',
    type: 'string',
    value: 'ma-tete'
  }
},
{
  key: 'toto.tata',
  value: {
    criteria: 'equals',
    type: 'string',
    value: 'ma-tete',
    models: []
  }
},
{
  key: 'toto.titi',
  value: {
    criteria: 'equals',
    type: 'string',
    value: 'ma-tete',
    models: ['model1']
  },
}, {
  key: 'toto.tutu',
  value: {
    criteria: 'equals',
    type: 'string',
    value: 'ta-tete',
    models: ['model1']
  },
},
{
  key: 'test.titi',
  value: {
    criteria: 'contains',
    type: 'string',
    value: 'zmj',
    models: ['model2']
  },
}

];


export const facetsResutls = [
  {
    key: 'toto',
    pipeline: [
      {
        $match: {
          customerKey: 'customer1',
          deleted: true,
          modelKey: {
            $in: [
              'model1'
            ]
          },
          'properties.titi': {
            $eq: 'ma-tete'
          },
          'properties.tutu': {
            $eq: 'ta-tete'
          }
        }
      },
      {
        $lookup: {
          from: 'smartobjects',
          localField: 'uuid',
          foreignField: 'properties.toto',
          as: 'parent'
        }
      },
      {
        $project: {
          parent: 1,
          _id: 0
        }
      },
      {
        $unwind: '$parent'
      },
      {
        $replaceRoot: {
          newRoot: '$parent'
        }
      },
      {
        $project: {
          uuid: 1,
          modelKey: 1,
          deleted: 1,
          _id: 0
        }
      },
      {
        $match: {
          modelKey: {
            $in: [
              'model1'
            ]
          },
          deleted: true
        }
      }
    ]
  },
  {
    key: 'test',
    pipeline: [
      {
        $match: {
          customerKey: 'customer1',
          deleted: true,
          modelKey: {
            $in: [
              'model2'
            ]
          },
          'properties.titi': /.*zmj.*/i
        }
      },
      {
        $lookup: {
          from: 'smartobjects',
          localField: 'uuid',
          foreignField: 'properties.test',
          as: 'parent'
        }
      },
      {
        $project: {
          parent: 1,
          _id: 0
        }
      },
      {
        $unwind: '$parent'
      },
      {
        $replaceRoot: {
          newRoot: '$parent'
        }
      },
      {
        $project: {
          uuid: 1,
          modelKey: 1,
          deleted: 1,
          _id: 0
        }
      },
      {
        $match: {
          modelKey: {
            $in: [
              'model1'
            ]
          },
          deleted: true
        }
      }
    ]
  }
];

export const querySO = {
  so: [{
    modelKey: 'model1',
    props: [{
      key: 'prop1',
      value: ['toto']
    }],
  },
  {
    modelKey: 'model2',
    props: [{
      key: 'prop2',
      value: ['tata']
    }],
  }],
  tags: ['tag1'],
  layers: ['layer1'],
  texts: ['titi'],
  metadatas: ['metadata1'],
  exactValue: false,
  caseSensitive: false,
};

export const docQueries = {
  index: 'algotech_doc_index',
  id: 'template_doc',
  params: {
    setSource: {
      source: [
        'title',
        'tags'
      ]
    },
    from: 0,
    size: 1,
    texts: [`[{\"wildcard\":{\"title\":\"*titi*\"}},{\"wildcard\":{\"attachment.content\":\"*titi*\"}}]`],
    titles: [],
    nested: [
      {
        isFirst: true,
        key: 'metadata1',
        queryStr: [
          {
            query_string: {
              query: '/.*titi.*/',
              fields: [
                'metadatas.value'
              ],
              analyze_wildcard: true,
              auto_generate_synonyms_phrase_query: false,
              boost: 100
            }
          }
        ]
      }
    ],
    metadatas: true,
    setFilter: {
      tags: [
        '[\"tag1\"]'
      ],
      modelKeys: [
        '[\"model1\"]'
      ]
    }
  }
};
