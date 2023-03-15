import { WorkflowModelDto } from '@algotech/core';

export const listFlowsModel: WorkflowModelDto[] = [
    {
        uuid: '6f9001e9-66f2-75ea-d2c4-790e04c163ff',
        key: 'premier_smartflow',
        snModelUuid: '4796b237-c90a-48c4-8409-2299c4d4c8d8',
        viewId: 'dc2a68f5-fe05-4f5b-863c-a885dc13b8f5',
        viewVersion: 3,
        displayName: [
            {
                lang: 'fr-FR',
                value: 'premier smartflow',
            },
        ],
        description: [
            {
                lang: 'fr-FR',
                value: 'description du premier smartflow',
            },
        ],
        tags: ['sf'],
        iconName: 'icon',
        parameters: [
            {
                key: 'parameter1',
                value: 'valeur param 1',
            },
        ],
        variables: [],
        profiles: [],
        steps: [],
    },
    {
        uuid: 'd3b3175b-c090-469f-88b9-403dd5adb5ca',
        key: 'second_smartflow',
        snModelUuid: '7650130f-706b-4020-ba55-f65ce1a67be5',
        viewId: 'c94fc8ef-d03c-4805-9d0c-82897d149908',
        viewVersion: 0,
        displayName: [
            {
                lang: 'fr-FR',
                value: 'second smartflow',
            },
        ],
        description: [
            {
                lang: 'fr-FR',
                value: 'description du second smartflow',
            },
        ],
        tags: ['sf', 'elec', 'new'],
        iconName: 'icon-elec',
        parameters: [
            {
                key: 'parameter1',
                value: 'valeur param 1',
            },
            {
                key: 'parameter2',
                value: 'valeur param 2',
            },
            {
                key: 'parameter3',
                value: 'valeur param 3',
            },
        ],
        variables: [
            {
                uuid: 'bd5aa4c0-b798-4114-b73f-dfb69e625c32',
                key: 'variable1',
                type: 'typeVariable1',
                multiple: false,
                required: false,
            },
        ],
        profiles: [
            {
                uuid: '3bc38746-7723-4585-a3c7-54a8420c7c19',
                name: 'profile1',
            },
            {
                uuid: '11126414-1459-4e83-bd35-b15b8a41b7f0',
                name: 'profile2',
            },
        ],
        steps: [
            {
                uuid: 'df0288ff-8f86-4463-a88e-3c5855463638',
                key: 'first_step',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'first step',
                    },
                ],
                tasks: [
                    {
                        uuid: 'bd5aa4c0-b798-4114-b73f-dfb69e625c32',
                        key: 'variable1',
                        type: 'typeVariable1',
                        general: {
                            displayName: [
                                {
                                    lang: 'fr-FR',
                                    value: 'second smartflow',
                                },
                            ],
                            iconName: '',
                            profil: 'profile',
                        },
                        properties: {
                            services: [
                                {
                                    uuid: 'bbbf41a6-7f9a-4f0d-9a28-3d5ce92e3d21',
                                    key: 'service',
                                    type: 'GET',
                                    cache: false,
                                    execute: 'start',
                                    api: 'external',
                                    route: 'ROUTE',
                                    header: [
                                        {
                                            key: 'header key',
                                            value: 'header value',
                                        },
                                    ],
                                    params: [
                                        {
                                            key: 'params key',
                                            value: 'params value',
                                            type: 'url-segment',
                                        },
                                    ],
                                    mappedParams: [
                                        {
                                            key: 'mapped params key',
                                            value: 'mapped params value',
                                        },
                                    ],
                                    body: 'BODY',
                                    return: {
                                        type: 'returnType',
                                        multiple: true,
                                    },
                                },
                            ],
                            expressions: [
                                {
                                    key: '09c5c730-c923-4cdc-8df5-63c302c998b2',
                                    value: 'expression value',
                                    type: 'expressionType',
                                },
                            ],
                            transitions: [
                                {
                                    uuid: '26b58ab5-cd0b-4c9f-9ed9-6a71bfe543c8',
                                    key: 'transition_key',
                                    displayName: [
                                        {
                                            lang: 'fr-FR',
                                            value: 'transition',
                                        },
                                    ],
                                    task: 'transitionTask',
                                    data: [
                                        {
                                            uuid: 'ea475eba-54ba-4362-b069-61c8de1bf006',
                                            key: 'data_key',
                                            type: 'dataType',
                                            multiple: false,
                                            placeToSave: ['place'],
                                        },
                                    ],
                                },
                            ],
                            custom: 'custom',
                        },
                    },
                ],
            },
        ],
    },
    {
        tags: [],
        key: 'test-e2e-smartflow',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'test e2e smartflow',
            },
        ],
        description: [],
        iconName: '',
        profiles: [],
        variables: [],
        steps: [
            {
                uuid: 'af2fb88e-34e6-7776-eafa-3965ea44723d',
                color: '#1E88E5',
                displayName: [],
                key: '',
                tasks: [
                    {
                        uuid: '5c2a7827-3b82-baf4-237a-87988717a5f5',
                        key: '',
                        type: 'TaskLauncher',
                        general: {
                            displayName: [],
                            iconName: '',
                        },
                        properties: {
                            services: [],
                            expressions: [],
                            transitions: [
                                {
                                    displayName: [],
                                    data: [],
                                    uuid: '080dadc5-5fef-eda2-a93d-b37a30bfaa0b',
                                    key: 'done',
                                    task: 'dc8c8cb9-8e5e-1f05-7362-c6dac6960e16',
                                },
                            ],
                            custom: {},
                        },
                    },
                    {
                        uuid: 'dc8c8cb9-8e5e-1f05-7362-c6dac6960e16',
                        key: '',
                        type: 'TaskMapped',
                        general: {
                            displayName: [],
                            iconName: '',
                        },
                        properties: {
                            services: [],
                            expressions: [],
                            transitions: [
                                {
                                    displayName: [],
                                    data: [
                                        {
                                            placeToSave: [],
                                            uuid: 'b52d957a-cec4-02b5-6548-a6675a82783b',
                                            key: 'mappedResult',
                                            multiple: true,
                                            type: 'so:',
                                        },
                                    ],
                                    uuid: '435cd785-6345-f5c7-b5de-0ebc17f8816c',
                                    key: 'done',
                                    task: '2ad1ff47-1a26-ace7-a137-68142be69c64',
                                },
                            ],
                            custom: {
                                object: {
                                    NAME: 'TEST-E2E-SMARTFLOWS',
                                },
                                smartModel: 'EQUIPMENT',
                                autoMapped: true,
                                saveOnApi: true,
                                fields: [],
                            },
                        },
                    },
                    {
                        uuid: '2ad1ff47-1a26-ace7-a137-68142be69c64',
                        key: '',
                        type: 'TaskFinisher',
                        general: {
                            displayName: [],
                            iconName: 'far fa-flag-checkered',
                        },
                        properties: {
                            services: [],
                            expressions: [],
                            transitions: [],
                            custom: {
                                save: true,
                            },
                        },
                    },
                ],
            },
        ],
        uuid: 'd8fadf06-bb7d-774b-c06d-ba32caef4f9a',
        parameters: [],
        api: {
            route: 'test-e2e-smartflow',
            type: 'POST',
            auth: {
                jwt: true,
                groups: [],
            },
            description: '',
            summary: '',
            result: [],
        },
    },
];
