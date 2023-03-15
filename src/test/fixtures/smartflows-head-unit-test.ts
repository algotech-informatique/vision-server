import { SysFile } from '@algotech/core';
import { IdentityRequest, WorkflowModel } from '../../interfaces';
import { SmartFlowsInput } from '../../providers';

const moment = require('moment')

export const identity: IdentityRequest = {
  login: 'sadmin',
  groups: ['sadmin'],
  customerKey: process.env.CUSTOMER_KEY,
};

export const sysfile1: SysFile = {
  documentID: 'string',
  versionID: 'string',
  name: 'string',
  ext: 'string',
  size: 0,
  dateUpdated: 'string',
  reason: 'string',
  user: 'string',
  tags: [],
  metadatas: [],
};

export const formDataFileNotFound: SmartFlowsInput = {
  key: 'formData3',
  error: true,
  msg: 'ERROR-FORM-DATA',
  reason: 'FILE(S)-NOT-FOUND'
};

export const formDataFileNotFoundResult: SmartFlowsInput = {
  key: 'formData3',
  msg: 'ERROR-FORM-DATA',
  reason: 'FILE(S)-NOT-FOUND'
};

export const formDataImportFileError: SmartFlowsInput = {
  key: 'formData2',
  error: true,
  msg: 'ERROR-FORM-DATA',
  reason: 'FILE(S)-IMPORT-ERROR'
};

export const formData2Multiple: SmartFlowsInput = {
  key: 'formData2',
  value: [sysfile1, sysfile1]
};

export const formData2Simple: SmartFlowsInput = {
  key: 'formData2',
  value: sysfile1
};

export const launchOptions = {
  inputErrors: [],
  launchOptions: {
    key: 'test-e2e-route-post',
    inputs: [
      {
        key: 'formData2',
        value: {
          documentID: 'string',
          versionID: 'string',
          name: 'string',
          ext: 'string',
          size: 0,
          dateUpdated: 'string',
          reason: 'string',
          user: 'string',
          tags: [],
          metadatas: []
        }
      },
      {
        key: 'Segment1',
        value: 'test'
      },
      {
        key: 'body',
        value: {
          formData1: 'abcd'
        },
        error: false,
        reason: null
      },
      {
        key: 'string',
        value: 'toto'
      },
      {
        key: 'number',
        value: 1
      },
      {
        key: 'date',
        value: moment('2020/12/12').startOf('day').format()
      },
      {
        key: 'boolean',
        value: false
      },
      {
        key: 'Header1',
        value: 'tata'
      },
      {
        key: 'formData1',
        value: 'abcd'
      }
    ]
  }
}

export const launchOptionsMultiple = {
  inputErrors: [formDataFileNotFoundResult],
  launchOptions: {
    key: 'test-e2e-route-post',
    inputs: [
      {
        key: 'formData2',
        value: [{
          documentID: 'string',
          versionID: 'string',
          name: 'string',
          ext: 'string',
          size: 0,
          dateUpdated: 'string',
          reason: 'string',
          user: 'string',
          tags: [],
          metadatas: []
        }]
      },
      {
        key: 'Segment1',
        value: 'test'
      },
      {
        key: 'body',
        value: {
          formData1: 'abcd'
        },
        error: false,
        reason: null
      },
      {
        key: 'string',
        value: 'toto'
      },
      {
        key: 'number',
        value: 1
      },
      {
        key: 'date',
        value: moment('2020/12/12').startOf('day').format()
      },
      {
        key: 'boolean',
        value: false
      },
      {
        key: 'Header1',
        value: 'tata'
      },
      {
        key: 'formData1',
        value: 'abcd'
      }
    ]
  }
}

export const smartflowSimple: WorkflowModel = {
  uuid: '7953b1d5-9f1b-263b-d393-31588001b711',
  customerKey: 'algotech',
  deleted: false,
  createdDate: '2022-02-18T10:33:05.261+0000',
  updateDate: '2022-02-18T10:33:05.261+0000',
  key: 'test-e2e-route-post',
  snModelUuid: '7953b1d5-9f1b-263b-d393-31588001b709',
  viewId: 'fad58b9b-adc7-e36d-3d0d-9dc6b0a22d92',
  viewVersion: 0,
  iconName: '',
  displayName: [
  ],
  tags: [

  ],
  parameters: [

  ],
  variables: [
    {
      uuid: '60abc279-85ed-fb48-d7fd-adedc99ca426',
      key: 'body',
      type: 'string',
      multiple: false,
      use: 'body',
      description: ''
    },
    {
      uuid: '688fd822-3fa3-f7cd-5888-1898e90baca8',
      key: 'Segment1',
      type: 'string',
      multiple: false,
      use: 'url-segment',
      description: ''
    },
    {
      uuid: '6232a5b3-68c7-5daf-8c99-805fca759250',
      key: 'string',
      type: 'string',
      multiple: false,
      required: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: 'd09defd0-a0b6-96f2-a6be-9ae64ce5e4e7',
      key: 'number',
      type: 'number',
      multiple: false,
      allowEmpty: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: '051a8074-2a4e-017a-d33c-af3ad474ebd0',
      key: 'date',
      type: 'datetime',
      multiple: false,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: '9122299f-69fe-c0ce-1636-d1eb87ae9002',
      key: 'boolean',
      type: 'boolean',
      multiple: false,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e5',
      key: 'Header1',
      type: 'string',
      multiple: false,
      required: true,
      use: 'header',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e6',
      key: 'formData1',
      type: 'string',
      multiple: false,
      required: true,
      use: 'formData',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e7',
      key: 'formData2',
      type: 'sys:file',
      multiple: false,
      required: true,
      use: 'formData',
      description: ''
    }
  ],
  profiles: [

  ],
  steps: [
  ],
  api: {
    route: 'test-route',
    type: 'POST',
    auth: {
      jwt: true,
      groups: []
    },
    description: '',
    result: [

    ],
    summary: ''
  },
  description: [

  ]
}

export const smartflowMultiple: WorkflowModel = {
  uuid: '7953b1d5-9f1b-263b-d393-31588001b711',
  customerKey: 'algotech',
  deleted: false,
  createdDate: '2022-02-18T10:33:05.261+0000',
  updateDate: '2022-02-18T10:33:05.261+0000',
  key: 'test-e2e-route-post',
  snModelUuid: '7953b1d5-9f1b-263b-d393-31588001b709',
  viewId: 'fad58b9b-adc7-e36d-3d0d-9dc6b0a22d92',
  viewVersion: 0,
  iconName: '',
  displayName: [

  ],
  tags: [

  ],
  parameters: [

  ],
  variables: [
    {
      uuid: '60abc279-85ed-fb48-d7fd-adedc99ca426',
      key: 'body',
      type: 'string',
      multiple: false,
      use: 'body',
      required: true,
      description: ''
    },
    {
      uuid: '688fd822-3fa3-f7cd-5888-1898e90baca8',
      key: 'Segment1',
      type: 'string',
      multiple: false,
      required: true,
      use: 'url-segment',
      description: ''
    },
    {
      uuid: '6232a5b3-68c7-5daf-8c99-805fca759250',
      key: 'string',
      type: 'string',
      multiple: false,
      required: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: 'd09defd0-a0b6-96f2-a6be-9ae64ce5e4e7',
      key: 'number',
      type: 'number',
      multiple: false,
      allowEmpty: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: '051a8074-2a4e-017a-d33c-af3ad474ebd0',
      key: 'date',
      type: 'date',
      multiple: false,
      required: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: '9122299f-69fe-c0ce-1636-d1eb87ae9002',
      key: 'boolean',
      type: 'boolean',
      multiple: false,
      required: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e5',
      key: 'Header1',
      type: 'string',
      multiple: false,
      required: true,
      use: 'header',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e6',
      key: 'formData1',
      type: 'string',
      multiple: false,
      required: true,
      use: 'formData',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e7',
      key: 'formData2',
      type: 'sys:file',
      multiple: true,
      required: true,
      use: 'formData',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e7',
      key: 'formData3',
      type: 'sys:file',
      multiple: true,
      required: true,
      use: 'formData',
      description: ''
    }
  ],
  profiles: [

  ],
  steps: [
  ],
  api: {
    route: 'test-route',
    type: 'POST',
    auth: {
      jwt: false,
      groups: [],
      webhook: {
        key: 'webhook',
        value: 'token'
      }
    },
    description: '',
    result: [

    ],
    summary: ''
  },
  description: [

  ]
}

export const smartflowallMultiple: WorkflowModel = {
  uuid: '7953b1d5-9f1b-263b-d393-31588001b711',
  customerKey: 'algotech',
  deleted: false,
  createdDate: '2022-02-18T10:33:05.261+0000',
  updateDate: '2022-02-18T10:33:05.261+0000',
  key: 'test-e2e-route-post',
  snModelUuid: '7953b1d5-9f1b-263b-d393-31588001b709',
  viewId: 'fad58b9b-adc7-e36d-3d0d-9dc6b0a22d92',
  viewVersion: 0,
  iconName: '',
  displayName: [

  ],
  tags: [

  ],
  parameters: [

  ],
  variables: [
    {
      uuid: '60abc279-85ed-fb48-d7fd-adedc99ca426',
      key: 'body',
      type: 'string',
      multiple: true,
      use: 'body',
      description: ''
    },
    {
      uuid: '688fd822-3fa3-f7cd-5888-1898e90baca8',
      key: 'Segment1',
      type: 'string',
      multiple: true,
      use: 'url-segment',
      description: ''
    },
    {
      uuid: '6232a5b3-68c7-5daf-8c99-805fca759250',
      key: 'string',
      type: 'string',
      multiple: true,
      required: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: 'd09defd0-a0b6-96f2-a6be-9ae64ce5e4e7',
      key: 'number',
      type: 'number',
      multiple: true,
      allowEmpty: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: '051a8074-2a4e-017a-d33c-af3ad474ebd0',
      key: 'date',
      type: 'date',
      multiple: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: '9122299f-69fe-c0ce-1636-d1eb87ae9002',
      key: 'boolean',
      type: 'boolean',
      multiple: true,
      use: 'query-parameter',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e5',
      key: 'Header1',
      type: 'string',
      multiple: false,
      required: true,
      use: 'header',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e6',
      key: 'formData1',
      type: 'string',
      multiple: false,
      required: true,
      use: 'formData',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e7',
      key: 'formData2',
      type: 'sys:file',
      multiple: true,
      required: true,
      use: 'formData',
      description: ''
    },
    {
      uuid: 'e0d52c39-7145-63cc-a7d2-f67eb58b63e7',
      key: 'formData3',
      type: 'sys:file',
      multiple: true,
      required: true,
      use: 'formData',
      description: ''
    }
  ],
  profiles: [

  ],
  steps: [
  ],
  api: {
    route: 'test-route',
    type: 'POST',
    auth: {
      jwt: false,
      groups: [],
      webhook: {
        key: 'webhook',
        value: 'token'
      }
    },
    description: '',
    result: [

    ],
    summary: ''
  },
  description: [

  ]
}