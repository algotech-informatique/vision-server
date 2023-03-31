import { PatchPropertyDto, SmartObjectDto, WorkflowModelDto } from '@algotech-ce/core';

export const createFlowsModel: WorkflowModelDto = {
    key: 'new_smartflow',
    viewId: 'dc2a68f5-fe05-4f5b-863c-a885dc13b8f5',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'new smartflow',
        },
    ],
    description: [],
    tags: [],
    parameters: [],
    variables: [],
    profiles: [],
    steps: [],
};

export const createflowsModel2: WorkflowModelDto = {
    uuid: '99a3276c-6c27-4aa0-9593-43a70ddd4050',
    key: 'create-flows-model',
    snModelUuid: '0a2a684f-dd0b-4976-8715-90e1d93046a5',
    viewId: '5f2ea5ba-f6a7-468e-9769-47e9d0047d19',
    viewVersion: 1,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'create smartflow',
        },
    ],
    description: [
        {
            lang: 'fr-FR',
            value: 'description du create smartflow',
        },
    ],
    tags: ['sf'],
    iconName: 'icon',
    parameters: [],
    variables: [],
    profiles: [],
    steps: [],
};

export const publishFlowsModel: WorkflowModelDto = {
    key: 'publish_smartflow',
    viewId: 'dc1a68f3-fe05-4f5b-8634-a885dc13b8f5',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'publish smartflow',
        },
    ],
    description: [],
    tags: [],
    parameters: [],
    variables: [],
    profiles: [],
    steps: [],
};

export const publishExistSmartFlow: WorkflowModelDto = {
    uuid: '461af32e-9332-44f1-ba2d-665c74c84d99',
    key: 'premier_smartflow',
    snModelUuid: '4796b237-c90a-48c4-8409-2299c4d4c8d8',
    viewId: 'dc2a68f5-fe05-4f5b-863c-a885dc13b8f5',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'modified smartflow',
        },
        {
            lang: 'en-US',
            value: 'smartflow modified',
        },
    ],
    description: [],
    tags: [],
    iconName: 'new icon',
    parameters: [],
    variables: [],
    profiles: [
        {
            uuid: '3bc38746-7723-4585-a3c7-54a8420c7c19',
            name: 'profile1',
        },
    ],
    steps: [],
};

export const publishNewSmartFlow: WorkflowModelDto = {
    uuid: '2f28e203-7ad9-4a00-bc79-a425b58dac7d',
    key: 'publish_new_smartflow',
    snModelUuid: '2dd15312-8a7a-42a0-b0f5-8d0d72f35f17',
    viewId: '088cf4a3-3e0f-4fb1-986d-c010e3423553',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'nouveau smartflow',
        },
        {
            lang: 'en-US',
            value: 'new smartflow',
        },
    ],
    description: [],
    tags: [],
    iconName: 'new icon',
    parameters: [],
    variables: [],
    profiles: [
        {
            uuid: '3bc38746-7723-4585-a3c7-54a8420c7c19',
            name: 'profile1',
        },
    ],
    steps: [],
};

export const duplicateKeyFlowsModel: WorkflowModelDto = {
    key: 'new_smartflow',
    viewId: 'dc2a68f5-fe05-4f5b-863c-a885dc13b8f8',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'new smartflow',
        },
    ],
    description: [],
    tags: [],
    parameters: [],
    variables: [],
    profiles: [],
    steps: [],
};

export const flowsModel1: WorkflowModelDto = {
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
};

export const flowsModel2: WorkflowModelDto = {
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
};

export const flowsModel3: WorkflowModelDto = {
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
};

export const openAPIReadyFlow: WorkflowModelDto = {
    uuid: '5b55acf2-addd-0fc4-f1da-c5924208f77d',
    createdDate: '2022-03-07T11:39:56.494Z',
    updateDate: '2022-03-08T09:15:19.208Z',
    key: 'openapi-mic',
    snModelUuid: '5b55acf2-addd-0fc4-f1da-c5924208f77d',
    viewId: 'ca154f6a-ef86-5d23-c40b-38a5d49c1555',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'openapi-mic'
        },
        {
            lang: 'en-US',
            value: ''
        },
        {
            lang: 'es-ES',
            value: ''
        }
    ],
    tags: [
        'etude',
        'panne'
    ],
    parameters: [],
    variables: [
        {
            uuid: 'f423a8f9-4be4-5a87-53d6-2c901b3a695a',
            key: 'path-parameter',
            type: 'string',
            multiple: false,
            required: true,
            use: 'url-segment',
            description: 'Ceci est un path parameter'
        },
        {
            uuid: 'd2b454c3-2986-c161-c677-5fa026858b1a',
            key: 'path-parameter-2',
            type: 'number',
            multiple: false,
            required: true,
            use: 'url-segment',
            description: 'Un autre path parameter de type number'
        },
        {
            uuid: 'cab94def-0084-a1ff-dafc-625f2d954b1e',
            key: 'query-parameter',
            type: 'string',
            multiple: false,
            required: true,
            deprecated: true,
            use: 'query-parameter',
            description: 'Un query parameter obsolète'
        },
        {
            uuid: '07ff5a83-680a-7b69-80f6-eb450a9efc68',
            key: 'query-parameter-2',
            type: 'string',
            multiple: true,
            required: true,
            use: 'query-parameter',
            description: 'Un autre query parameter, multiple'
        },
        {
            uuid: '2bf8793a-bb75-463a-0fe0-d2cc1c48f1b7',
            key: 'mavariable-1',
            type: 'string',
            multiple: false
        },
        {
            uuid: '5c688acb-51f6-e9da-c2f7-19b5790a3a83',
            key: 'mavariable-2',
            type: 'so:civilization',
            multiple: false
        },
        {
            uuid: '4fbebdce-ce9a-7082-a145-84a54e2bd00c',
            key: 'mon-header',
            type: 'string',
            multiple: false,
            required: true,
            use: 'header',
            description: 'Un header de la requête'
        }
    ],
    profiles: [],
    steps: [
        {
            uuid: '054a1091-171e-1557-4328-2fd766fc1865',
            key: 'unknown',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: ''
                },
                {
                    lang: 'en-US',
                    value: ''
                },
                {
                    lang: 'es-ES',
                    value: ''
                }
            ],
            tasks: [
                {
                    uuid: '8237214b-77b0-cc06-7358-18a5738d8a45',
                    key: 'depart',
                    type: 'TaskLauncher',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'DÉPART'
                            },
                            {
                                lang: 'en-US',
                                value: 'START'
                            },
                            {
                                lang: 'es-ES',
                                value: 'COMIENZO'
                            }
                        ],
                        iconName: 'fad fa-play-circle'
                    },
                    properties: {
                        services: [],
                        expressions: [],
                        transitions: [
                            {
                                uuid: '2f46b39c-dec4-17db-7609-4f82408f4730',
                                key: 'done',
                                task: 'bb4d3446-d456-60aa-d986-0a550fb09181',
                                data: [],
                                displayName: []
                            }
                        ],
                        custom: {}
                    }
                },
                {
                    uuid: '1ec8821c-6703-8743-2436-f05bfe95adf0',
                    key: 'fin',
                    type: 'TaskFinisher',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'FIN'
                            },
                            {
                                lang: 'en-US',
                                value: 'END'
                            },
                            {
                                lang: 'es-ES',
                                value: 'FIN'
                            }
                        ],
                        iconName: 'fad fa-flag-checkered'
                    },
                    properties: {
                        services: [],
                        expressions: [],
                        transitions: [],
                        custom: {
                            save: true
                        }
                    }
                },
                {
                    uuid: 'bb4d3446-d456-60aa-d986-0a550fb09181',
                    key: 'resultat-du-smartflow',
                    type: 'TaskRequestResult',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Résultat du smartflow'
                            },
                            {
                                lang: 'en-US',
                                value: 'Smartflow result'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Resultado smartflow'
                            }
                        ],
                        iconName: 'fad fa-keyboard'
                    },
                    properties: {
                        services: [],
                        expressions: [
                            {
                                key: '1693813a-ea23-4551-f9d2-3662b81b2f27',
                                value: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Path: [{{path-parameter}}] et [{{path-parameter-2}}]\nParamètres: [{{query-parameter}}] et [{{query-parameter-2}}]'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: ''
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: ''
                                    }
                                ],
                                type: 'string'
                            }
                        ],
                        transitions: [
                            {
                                uuid: 'd73c1fd5-4dce-4f16-5e5d-52f2a705a275',
                                key: 'done',
                                task: '1ec8821c-6703-8743-2436-f05bfe95adf0',
                                data: [
                                    {
                                        uuid: 'bfd36c74-4c64-638b-601b-d0bac3a24552',
                                        key: 'result',
                                        type: 'string',
                                        multiple: false,
                                        placeToSave: []
                                    }
                                ],
                                displayName: []
                            }
                        ],
                        custom: {
                            inputs: '{{1693813a-ea23-4551-f9d2-3662b81b2f27}}',
                            format: null
                        }
                    }
                }
            ]
        }
    ],
    api: {
        route: 'openapi-mic',
        type: 'GET',
        auth: {
            jwt: true,
            groups: []
        },
        description: 'Description de la doc OpenAPI',
        summary: 'Résumé de la doc',
        result: [
            {
                code: '200',
                description: 'All is fine',
                content: 'application/json',
                multiple: true,
                type: 'so:civilization'
            },
            {
                code: '5XX',
                description: 'Quelque chose s\'est mal passé !',
                content: 'text/plain',
                multiple: false,
                type: 'string'
            }
        ]
    },
    description: []
};

export const openAPIReadyFlow2: WorkflowModelDto = {
    uuid: '013a061e-bce4-487b-8120-ee029e19b0c0',
    createdDate: '2022-01-31T06:57:24.586Z',
    updateDate: '2022-03-07T15:41:27+01:00',
    viewId: 'e789fe4a-c336-b79f-5db4-80111260a552',
    snModelUuid: '013a061e-bce4-487b-8120-ee029e19b0c0',
    viewVersion: 0,
    key: 'test-openapi',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'test-openapi'
        },
        {
            lang: 'en-US',
            value: ''
        },
        {
            lang: 'es-ES',
            value: ''
        }
    ],
    parameters: [],
    variables: [
        {
            uuid: 'fd5f24f2-99d9-4189-3948-73a32f72466c',
            key: 'query-parameter',
            type: 'string',
            multiple: false,
            use: 'query-parameter',
            description: '',
            required: true
        },
        {
            uuid: '54ad16cd-a23f-c425-bc4d-bd696d2571b2',
            key: 'path-parameter',
            type: 'string',
            multiple: false,
            use: 'url-segment',
            description: '',
            required: true
        }
    ],
    profiles: [],
    tags: [
        'chantier'
    ],
    steps: [
        {
            uuid: '6dd4f3d3-b17a-b5bb-dacd-cc2739d72c49',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: ''
                },
                {
                    lang: 'en-US',
                    value: ''
                },
                {
                    lang: 'es-ES',
                    value: ''
                }
            ],
            key: 'unknown',
            tasks: [
                {
                    uuid: '74310517-cea9-f39e-1142-7055a74f9e1b',
                    key: 'depart',
                    type: 'TaskLauncher',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'DÉPART'
                            },
                            {
                                lang: 'en-US',
                                value: 'START'
                            },
                            {
                                lang: 'es-ES',
                                value: 'COMIENZO'
                            }
                        ],
                        iconName: 'fad fa-play-circle'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: 'dd23e923-3044-3c86-34b2-0fe9dd38e805',
                                key: 'done',
                                task: 'c39e2eda-c486-adc4-7772-1a23a3ece37f',
                                data: []
                            }
                        ],
                        custom: {},
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: 'c39e2eda-c486-adc4-7772-1a23a3ece37f',
                    key: 'fin',
                    type: 'TaskFinisher',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'FIN'
                            },
                            {
                                lang: 'en-US',
                                value: 'END'
                            },
                            {
                                lang: 'es-ES',
                                value: 'FIN'
                            }
                        ],
                        iconName: 'fad fa-flag-checkered'
                    },
                    properties: {
                        transitions: [],
                        custom: {
                            save: true
                        },
                        expressions: [],
                        services: []
                    }
                }
            ]
        }
    ],
    api: {
        route: 'test',
        type: 'GET',
        auth: {
            jwt: false,
            webhook: {
                key: '',
                value: ''
            },
            groups: null
        },
        description: '4',
        result: [
            {
                code: 'default',
                description: 'une description',
                content: 'application/json',
                multiple: true,
                type: 'so:etudes'
            },
            {
                code: null,
                description: '',
                content: 'application/json',
                multiple: false,
                type: null
            }
        ],
        summary: 'n'
    }
}

export const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/displayName/[lang:fr-FR]/value',
    value: 'premier smartflow patch',
};

export const patchPush: PatchPropertyDto = {
    op: 'add',
    path: '/profiles/[?]',
    value:
    {
        uuid: 'f0931661-6d7f-40a0-85a9-a227be005d22',
        name: 'profile',
    },
};

export const patchSetNoRespectModel: PatchPropertyDto = {
    op: 'add',
    path: '/displayName/[lang:fr-FR]/test',
    value: 'test error',
};

export const patchPull: PatchPropertyDto = {
    op: 'remove',
    path: '/displayName/[lang:fr-FR]',
};

export const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/iconName',
};

export const createSmartObject: SmartObjectDto = {
    uuid: '435cd785-6345-f5c7-b5de-0ebc17f8816d',
    modelKey: 'EQUIPMENT',
    properties: [
        {
            key: 'NAME',
            value: 'TEST-E2E-SMARTFLOWS',
        },
        {
            key: 'DOCUMENTS',
            value: [],
        },
    ],
    skills: {
        atDocument: {
            documents: [],
        },
        atGeolocation: {
            geo: [],
        },
        atMagnet: {
            zones: [],
        },
        atSignature: null,
        atTag: {
            tags: [],
        },
    },
};