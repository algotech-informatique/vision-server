import { SearchSODto, SearchSOFilterDto } from "@algotech-ce/core";
import { SearchSOCombinedFilters } from "../../interfaces";

export const filter1: SearchSOFilterDto = {
  value: {
    models: ['child', 'grand-child', 'grand-grand-child'],
    value: 'filter1',
    type: 'string',
    criteria: 'startsWith',
  },
  key: 'child.grandChild.grandGrandChild.prop',
  type: 'filter'
};

export const filter2: SearchSOFilterDto = {
  value: {
    models: ['child'],
    value: 'filter2',
    type: 'string',
    criteria: 'startsWith',
    secondValue: 'filter2'
  },
  key: 'child.prop',
  type: 'filter'
};

export const resultfilter2: SearchSOFilterDto = {
  value: {
    models: [],
    value: 'filter2',
    type: 'string',
    criteria: 'startsWith',
    secondValue: 'filter2'
  },
  key: 'child.prop',
  type: 'query'
};

export const filter3: SearchSOFilterDto = {
  value: {
    models: ['child', 'grand-child', 'grand-grand-child'],
    value: 'filter3',
    type: 'string',
    criteria: 'startsWith',
  },
  key: 'child.grandChild.grandGrandChild.prop',
  type: 'filter'
};

export const filter4: SearchSOFilterDto = {
  value: {
    models: ['child1', 'grand-child', 'grand-grand-child'],
    value: 'filter4',
    type: 'string',
    criteria: 'startsWith',
  },
  key: 'child1.grandChild.grandGrandChild.prop',
  type: 'filter'
};

export const filter5: SearchSOFilterDto = {
  value: {
    models: [],
    value: 'filter5',
    type: 'string',
    criteria: 'startsWith',
  },
  key: 'key1',
  type: 'query'
};

export const filter6: SearchSOFilterDto = {
  value: {
    value: 'filter6',
    type: 'string',
    criteria: 'startsWith',
  },
  key: 'key2',
  type: 'query'
};

export const filter7: SearchSOFilterDto = {
  value: {
    value: 'filter7',
    type: 'string',
    criteria: 'startsWith',
  },
  key: 'key10',
  type: 'query'
};



export const filter8: SearchSOFilterDto = {
  value: {
    value: 'filter8',
    type: 'string',
    criteria: 'startsWith',
  },
  allKeys: true,
  key: 'key10',
  type: 'filter'
};

export const filter9 = {
  value: {
    value: 'filter9',
    type: 'string',
    criteria: 'startsWith',
  },
  key: 'key10',
  type: 'query',
  isFilter: true,
  uuids: ['1', '2', '3']
};

export const filter10 = {
  value: {
    value: 'filter10',
    type: 'string',
    criteria: 'startsWith',
  },
  key: 'key11',
  type: 'query',
  isFilter: true,
  uuids: ['4', '5']
};

export const filter11: SearchSOFilterDto = {
  value: {
    value: 'filter11',
    type: 'string',
    criteria: 'startsWith',
  },
  key: 'key11',
  type: 'query'
};

export const resultfilter9: SearchSOFilterDto = {
  value: {
    models: [],
    criteria: 'equals',
    type: 'string',
    value: ['1', '2', '3']
  },
  key: 'key10',
  type: 'filter',
};

export const resultffilter10: SearchSOFilterDto = {
  value: {
    models: [],
    criteria: 'equals',
    type: 'string',
    value: ['4', '5']
  },
  key: 'key11',
  type: 'filter',
};



export const resultfilter8: SearchSOFilterDto = {
  value: {
    value: 'filter8',
    type: 'string',
    criteria: 'startsWith',
  },
  allKeys: true,
  key: 'key10',
  type: 'query'
};



export const searchTextQuery: SearchSOFilterDto = {
  type: 'query',
  key: 'key1',
  value: {
    models: [],
    criteria: 'contains',
    type: 'string',
    value: ['text1', 'text2']
  }
}
export const combinedFilter1: SearchSOCombinedFilters = {
  filters: [filter1, filter3]
}

export const combinedFilter2: SearchSOCombinedFilters = {
  filters: [filter4]
}


export const combinedFilter3: SearchSOCombinedFilters = {
  filters: [filter2]
}

export const perm1 = {
  modelKey: 'model1',
  properties: [{
    key: 'key1',
    value: '',
  },
  {
    key: 'key2',
    value: '',
  }]

}

export const perm2 = {
  modelKey: 'model1',
  properties: [{
    key: 'key1',
    value: '',
  },
  {
    key: 'key3',
    value: '',
  }]
}

export const perm3 = {
  modelKey: 'model1',
  properties: [{
    key: 'key2',
    value: '',
  },
  {
    key: 'key4',
    value: '',
  }]
}

export const perm4 = {
  modelKey: 'model1',
  properties: [{
    key: 'key5',
    value: '',
  },
  {
    key: 'key6',
    value: '',
  }]
}

export const perm5 = {
  modelKey: 'model1',
  properties: [{
    key: 'key10',
    value: '',
  },
  {
    key: 'key11',
    value: '',
  },
  {
    key: 'key12',
    value: '',
  }]
}

export const perm6 = {
  modelKey: 'model1',
  properties: [{
    key: 'child',
    value: '',
  },
  {
    key: 'key11',
    value: '',
  },
  {
    key: 'key12',
    value: '',
  }]
}

export const filter = [filter1, filter2, filter3, filter4, filter5, filter6, filter7];
export const filtercomplete = [filter1, filter2, filter3, filter4, filter5, filter6, filter7, filter11];
export const orders = [
  {
    key: 'key2',
    value: '-1',
  }, {
    key: 'key1',
    value: '1',
  }
]
export const query: SearchSODto = {
  modelKey: 'model1',
  filter,
  searchParameters: {
    search: 'replacement',
    filter: [filter11],
    skip: 15,
    limit: 1,
    order: [{
      key: 'key2',
      value: '-1',
    }]
  },
  order: [{
    key: 'key1',
    value: '1',
  }]
};

export const combined = {
  query: {
    modelKey: 'model1',
    filter: [
      {
        value: {
          value: 'filter11',
          type: 'string',
          criteria: 'startsWith'
        },
        key: 'key11',
        type: 'query'
      },
      {
        value: {
          models: [
            'child',
            'grand-child',
            'grand-grand-child'
          ],
          value: 'filter1',
          type: 'string',
          criteria: 'startsWith'
        },
        key: 'child.grandChild.grandGrandChild.prop',
        type: 'filter'
      },
      {
        value: {
          models: [
            'child'
          ],
          value: 'filter2',
          type: 'string',
          criteria: 'startsWith',
          secondValue: 'filter2'
        },
        key: 'child.prop',
        type: 'filter'
      },
      {
        value: {
          models: [
            'child1',
            'grand-child',
            'grand-grand-child'
          ],
          value: 'filter4',
          type: 'string',
          criteria: 'startsWith'
        },
        key: 'child1.grandChild.grandGrandChild.prop',
        type: 'filter'
      },
      {
        value: {
          models: [],
          value: 'filter5',
          type: 'string',
          criteria: 'startsWith'
        },
        key: 'key1',
        type: 'query'
      },
      {
        value: {
          value: 'filter6',
          type: 'string',
          criteria: 'startsWith'
        },
        key: 'key2',
        type: 'query'
      },
      {
        value: {
          value: 'filter7',
          type: 'string',
          criteria: 'startsWith'
        },
        key: 'key10',
        type: 'query'
      }
    ],
    order: [
      {
        key: 'key2',
        value: '-1'
      },
      {
        key: 'key1',
        value: '1'
      }
    ]
  },
  search: 'replacement',
  skip: 15,
  limit: 1
};
