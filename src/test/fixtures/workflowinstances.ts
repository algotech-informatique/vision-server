import { WorkflowInstanceDto, WorkflowOperationDto, SmartObjectDto, DocumentDto } from '@algotech-ce/core';
import { workflowModel1 } from './workflowmodels';

export const workflowInstance1: WorkflowInstanceDto = {
    rangeDate: [],
    uuid: '031fa2ba-b758-4885-8d93-d430f790155a',
    createdDate: null,
    finishDate: null,
    startDate: null,
    updateDate: null,
    data: [],
    operations: [],
    participants: [],
    stackTasks: [],
    state: 'todo',
    saved: true,
    workflowModel: workflowModel1,
};

export const workflowInstance2: WorkflowInstanceDto = {
    rangeDate: [],
    uuid: '031fa2ba-b758-4885-8d93-d430f790155b',
    createdDate: '2019-04-01T18:25:43.511Z',
    finishDate: null,
    startDate: '2019-04-05T18:25:43.511Z',
    updateDate: '2019-04-05T18:25:43.511Z',
    saved: true,
    data: [
        {
            key: 'equipment',
            value: 'a14dc702-9a0e-46ec-bc1f-5adfd3ff7e4a',
            type: 'so:equipment',
        },
        {
            key: 'document',
            value: '5594b3cf-8d93-4da2-a3f0-e65277a9aNEW',
            type: 'so:document',
        },
    ],
    operations: [],
    stackTasks: [
        {
            uuid: '031fa2ba-b758-4885-8d93-d430f790155a',
            taskModel: '6b443bbe-1b2d-11e9-ab14-d663bd873d93',
            startDate: '2019-04-05T18:30:43.511Z',
            finishDate: '2019-04-05T18:31:43.511Z',
            active: false,
            operations: [],
            reverse: [],
            transitionKey: 'done',
            saved: false,
        },
        {
            uuid: '031fa2ba-b758-4885-8d93-d430f790155b',
            taskModel: 'e7d81563-6adb-a84a-4d1a-31295dd55205',
            startDate: '2019-04-05T18:32:43.511Z',
            finishDate: '2019-04-05T18:33:43.511Z',
            active: false,
            operations: [],
            reverse: [],
            transitionKey: 'done',
            saved: false,
        },
        {
            uuid: '031fa2ba-b758-4885-8d93-d430f790155c',
            taskModel: '793461b8-1b2d-11e9-ab14-d663bd873d93',
            startDate: '2019-04-05T18:34:43.511Z',
            finishDate: null,
            active: true,
            operations: [],
            reverse: [],
            transitionKey: 'done',
            saved: false,
        },
    ],
    participants: [
        {
            user: '110e8400-e29b-11d4-a716-446655440003',
            profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
            active: true,
        },
    ],
    state: 'running',
    workflowModel: workflowModel1,
};

export const operationAddObject: WorkflowOperationDto = {
    saveOnApi: true,
    type: 'crud',
    value: {
        op: 'add',
        collection: 'smartobjects',
        value: {
            uuid: '785658c1-7d1b-3985-eeba-695358fd6337',
            modelKey: 'DOCUMENT',
            properties: [
                {
                    key: 'NAME',
                    value: '',
                },
                {
                    key: 'VERSION',
                    value: [],
                },
                {
                    key: 'DATE',
                    value: null,
                },
                {
                    key: 'STATES',
                    value: '',
                },
                {
                    key: 'USER',
                    value: null,
                },
                {
                    key: 'NATURE',
                    value: null,
                },
            ],
            skills: {
                atDocument: {
                    documents: [],
                },
            },
        },
    },
};

export const operationPatchObject: WorkflowOperationDto = {
    saveOnApi: true,
    type: 'crud',
    value: {
        op: 'patch',
        collection: 'smartobjects',
        key: '785658c1-7d1b-3985-eeba-695358fd6337',
        value: [
            {
                op: 'replace',
                path: '/properties/[key:NAME]/value',
                value: 'TEST',
            },
            {
                op: 'replace',
                path: '/properties/[key:DATE]/value',
                value: '2020-02-21T00:00:00.000Z',
            },
        ],
    },
};

export const operationSignObject: WorkflowOperationDto = {
    saveOnApi: true,
    type: 'action',
    value: {
        actionKey: 'sign',
        value: {
            smartObject: '785658c1-7d1b-3985-eeba-695358fd6337',
            // tslint:disable-next-line: max-line-length
            signature: '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',
            signatureName: 'signature.png',
            signatureType: 'image/png',
            info: {
                date: '2020-02-21T04:43:51+01:00',
                signatureID: '3e61f873-15f1-a515-f8e5-4f069c77d8e8',
                userID: '110e8400-e29b-11d4-a716-446655440001',
            },
        },
    },
};

export const operationUploadDocument: WorkflowOperationDto = {
    saveOnApi: true,
    type: 'action',
    value: {
        actionKey: 'upload',
        value: {
            smartObject: '785658c1-7d1b-3985-eeba-695358fd6337',
            fileName: 'Manuel3',
            fileType: 'text/plain',
            file: '51e8fafe-2fc1-41ee-4606-b9fd2227d1f5',
            info: {
                documentID: '40604449-67bc-4acf-f898-1bbcbd113a6f',
                versionID: '51e8fafe-2fc1-41ee-4606-b9fd2227d1f5',
                reason: '',
                tags: '',
                userID: '110e8400-e29b-11d4-a716-446655440001',
            },
        },
    },
};

export const operationEditDocument: WorkflowOperationDto = {
    saveOnApi: true,
    type: 'action',
    value: {
        actionKey: 'edit-document',
        value: {
            smartObject: '785658c1-7d1b-3985-eeba-695358fd6337',
            edit: {
                uuid: '40604449-67bc-4acf-f898-1bbcbd113a6f',
                name: 'cmd_TEST.txt',
                tags: [],
            },
        },
    },
};

export const operationDeleteDocument: WorkflowOperationDto = {
    saveOnApi: true,
    type: 'action',
    value: {
        actionKey: 'delete-documents',
        value: {
            smartObject: '785658c1-7d1b-3985-eeba-695358fd6337',
            documentsID: [
                '40604449-67bc-4acf-f898-1bbcbd113a6f',
            ],
        },
    },
};

export const operationDeleteObject = {
    saveOnApi: true,
    type: 'action',
    value: {
        actionKey: 'delete',
        value: '785658c1-7d1b-3985-eeba-695358fd6337',
    },
};

export const soAfterOperation: SmartObjectDto = {
    uuid: '785658c1-7d1b-3985-eeba-695358fd6337',
    modelKey: 'DOCUMENT',
    properties: [
        {
            key: 'NAME',
            value: 'TEST',
        },
        {
            key: 'VERSION',
            value: [],
        },
        {
            key: 'DATE',
            value: '2020-02-21T00:00:00.000Z',
        },
        {
            key: 'STATES',
            value: '',
        },
        {
            key: 'USER',
            value: null,
        },
        {
            key: 'NATURE',
            value: null,
        },
    ],
    skills: {
        atDocument: {
            documents: [
            ],
        },
        atSignature: {
            date: '2020-02-21T04:43:51+01:00',
            signatureID: '3e61f873-15f1-a515-f8e5-4f069c77d8e8',
            userID: '110e8400-e29b-11d4-a716-446655440001',
        },
    },
};

export const documentAfterOperation: DocumentDto = {
    tags: [],
    uuid: '40604449-67bc-4acf-f898-1bbcbd113a6f',
    name: 'cmd_TEST.txt',
    ext: 'txt',
    versions: [
        {
            linkedFilesID: [],
            uuid: '51e8fafe-2fc1-41ee-4606-b9fd2227d1f5',
            fileID: '5e533f0f1427845a77298c1c',
            dateUpdated: '2020-02-24T03:12:27+00:00',
            reason: 'creation',
            size: 5,
            userID: '110e8400-e29b-11d4-a716-446655440001',
            annotations: [],
            extendedProperties: [],
        },
    ],
    extendedProperties: [],
    metadatas: []
};
