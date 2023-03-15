import { SmartPropertyModelDto } from "@algotech/core";
import { WorkflowModel, WorkflowVariableModel } from "../../interfaces";
import { formDataFileNotFound } from "./smartflows-head-unit-test";

export const body = {
  formData1: 'abcd'
};

export const headers = {
  header1: 'tata',
  authorization: 'Bearer token'
};

export const queryParameters = {
  string: 'toto',
  number: 1.0,
  boolean: false,
  date: '2020/12/12'
};

export const queryStrings = ['test'];

export const uploadedFiles = [
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
  }
]

export const uploadedFilesMultiple = [
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
  formDataFileNotFound
]

export const obseleteSimpleVar: WorkflowVariableModel = {
  uuid: '688fd822-3fa3-f7cd-5888-1898e90baca8',
  key: 'Segment1',
  type: 'string',
  multiple: false,
  deprecated: true,
  use: 'url-segment',
  description: ''
};

export const requiredSimpleVar: WorkflowVariableModel = {
  uuid: '688fd822-3fa3-f7cd-5888-1898e90baca8',
  key: 'Segment1',
  type: 'string',
  multiple: false,
  required: true,
  use: 'url-segment',
  description: ''
};

export const notEmptySimpleVar: WorkflowVariableModel = {
  uuid: '688fd822-3fa3-f7cd-5888-1898e90baca8',
  key: 'Segment1',
  type: 'string',
  multiple: false,
  allowEmpty: false,
  use: 'url-segment',
  description: ''
};

export const stringSimpleVar: WorkflowVariableModel = {
  uuid: '688fd822-3fa3-f7cd-5888-1898e90baca8',
  key: 'Segment1',
  type: 'string',
  multiple: false,
  required: false,
  use: 'url-segment',
  description: ''
};

export const inputErrors = [
  {
    key: 'Segment1',
    msg: 'ERROR-URL-SEGMENT',
    reason: 'REQUIRED-PARAMETER'
  },
  {
    key: 'body',
    msg: 'ERROR-BODY',
    reason: 'REQUIRED-PARAMETER'
  },
  {
    key: 'string',
    msg: 'ERROR-QUERY-PARAMETER',
    reason: 'REQUIRED-PARAMETER'
  },
  {
    key: 'date',
    msg: 'ERROR-QUERY-PARAMETER',
    reason: 'REQUIRED-PARAMETER'
  },
  {
    key: 'boolean',
    msg: 'ERROR-QUERY-PARAMETER',
    reason: 'REQUIRED-PARAMETER'
  },
  {
    key: 'Header1',
    msg: 'ERROR-HEADER',
    reason: 'REQUIRED-PARAMETER'
  },
  {
    key: 'formData1',
    msg: 'ERROR-FORM-DATA',
    reason: 'REQUIRED-PARAMETER'
  }
];

export const numberSimpleVar: WorkflowVariableModel = {
  uuid: '688fd822-3fa3-f7cd-5888-1898e90baca8',
  key: 'Segment2',
  type: 'number',
  multiple: false,
  use: 'url-segment',
  description: ''
};

export const numberMultipleVar: WorkflowVariableModel = {
  uuid: '688fd822-3fa3-f7cd-5888-1898e90baca8',
  key: 'Segment2',
  type: 'number',
  multiple: true,
  use: 'url-segment',
  description: ''
};

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
      type: 'date',
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

export const stringProp: SmartPropertyModelDto = {
  uuid: '',
  key: '',
  displayName: [],
  keyType: 'string',
  multiple: true,
  required: true,
  system: false,
  hidden: false,
  permissions: {
    R: [],
    RW: []
  }
}

export const numberProp: SmartPropertyModelDto = {
  uuid: '',
  key: '',
  displayName: [],
  keyType: 'number',
  multiple: true,
  required: true,
  system: false,
  hidden: false,
  permissions: {
    R: [],
    RW: []
  }
}

export const dateProp: SmartPropertyModelDto = {
  uuid: '',
  key: '',
  displayName: [],
  keyType: 'date',
  multiple: true,
  required: true,
  system: false,
  hidden: false,
  permissions: {
    R: [],
    RW: []
  }
}

export const booleanProp: SmartPropertyModelDto = {
  uuid: '',
  key: '',
  displayName: [],
  keyType: 'boolean',
  multiple: true,
  required: true,
  system: false,
  hidden: false,
  permissions: {
    R: [],
    RW: []
  }
}

export const soProp: SmartPropertyModelDto = {
  uuid: '',
  key: '',
  displayName: [],
  keyType: 'so:',
  multiple: true,
  required: true,
  system: false,
  hidden: false,
  permissions: {
    R: [],
    RW: []
  }
}