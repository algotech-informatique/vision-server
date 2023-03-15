import { SmartObjectDto } from '@algotech/core';

export const smartObject1: SmartObjectDto = {
    uuid: '5594b3cf-8d93-4da2-a3f0-e65277a9af99',
    modelKey: 'DOCUMENT',
    properties: [
        {
            key: 'NAME',
            value: 'Plan de masse',
        },
        {
            key: 'VERSION',
            value: [],
        },
        {
            key: 'DATE',
            value: '2020-01-01T08:00:00.000Z',
        },
        {
            key: 'STATES',
            value: 'borrowed',
        },
        {
            key: 'USER',
            value: 'd36b26dd-1bcc-4b67-b632-9edd0b312bca',
        }, {
            key: 'NATURE',
            value: '5594b3cf-8d93-4da2-a3f0-e65277a9afhh',
        },
    ],
    skills: {},
};

export const smartObject2: SmartObjectDto = {
    modelKey: 'EQUIPMENT',
    properties: [
        {
            key: 'NAME',
            value: '3019-MFG-LO2-FLR-SOUTIREUSE_MATRIX-10482952-EQP-UTIL-ELEC-0',
        },
        {
            key: 'DOCUMENTS',
            value: ['5594b3cf-8d93-4da2-a3f0-e65277a9af99'],
        },
    ],
    skills: {},
};

export const smartObject2Patched: SmartObjectDto = {
    modelKey: 'EQUIPMENT',
    properties: [
        {
            key: 'NAME',
            value: '3019-MFG-LO2-FLR-SOUTIREUSE_MATRIX-10482952-EQP-UTIL-ELEC-0',
        },
        {
            key: 'DOCUMENTS',
            value: ['5594b3cf-8d93-4da2-a3f0-e65277a9af99'],
        },
    ],
    skills: {},
};

// objet test pour la pagination
export const smartObject3: SmartObjectDto = {
    uuid: 'f04b3f52-4df9-46d3-b336-eb53c7d99783',
    modelKey: 'APPLICATION',
    properties: [
        {
            key: 'APP_KEY',
            value: 'plan',
        },
        {
            key: 'NAME',
            value: 'Plan',
        },
        {
            key: 'LOGO_URL',
            value: '/assets/icon/plan.svg',
        },
        {
            key: 'APPLICATION_URL',
            value: '/plan',
        },
        {
            key: 'CATEGORY',
            value: 'Applications',
        },
    ],
    skills: {},
};

export const smartObject4: SmartObjectDto = {
    uuid: '474c27bd-109f-4459-b521-715bbc9aeb73',
    modelKey: 'APPLICATION',
    properties: [
        {
            key: 'APP_KEY',
            value: 'docs',
        },
        {
            key: 'NAME',
            value: 'Documents',
        },
        {
            key: 'LOGO_URL',
            value: '/assets/icon/documents.svg',
        },
        {
            key: 'APPLICATION_URL',
            value: '/documents',
        },
        {
            key: 'CATEGORY',
            value: 'Applications',
        },
    ],
    skills: {},
};

export const smartObject5: SmartObjectDto = {
    uuid: '247b59b3-3695-484f-850c-fe4af7ef025c',
    modelKey: 'APPLICATION',
    properties: [
        {
            key: 'APP_KEY',
            value: 'tasks',
        },
        {
            key: 'NAME',
            value: 'Tasks',
        },
        {
            key: 'LOGO_URL',
            value: '/assets/icon/tasks.svg',
        },
        {
            key: 'APPLICATION_URL',
            value: '/tasks',
        },
        {
            key: 'CATEGORY',
            value: 'Applications',
        },
    ],
    skills: {},
};

export const smartObject6: SmartObjectDto = {
    uuid: '518537a4-7a7e-48e9-bcd3-39ee09c22a6f',
    modelKey: 'APPLICATION',
    properties: [
        {
            key: 'APP_KEY',
            value: 'workflow',
        },
        {
            key: 'NAME',
            value: 'Workflow',
        },
        {
            key: 'LOGO_URL',
            value: '/assets/icon/workflow.svg',
        },
        {
            key: 'APPLICATION_URL',
            value: '/workflow',
        },
        {
            key: 'CATEGORY',
            value: 'Paramétrage',
        },
    ],
    skills: {},
};

export const smartObject7: SmartObjectDto = {
    uuid: '8f6dba2c-a090-4cdf-ac37-2ebe854a669a',
    modelKey: 'APPLICATION',
    properties: [
        {
            key: 'APP_KEY',
            value: 'data',
        },
        {
            key: 'NAME',
            value: 'Data',
        },
        {
            key: 'LOGO_URL',
            value: '/assets/icon/database.svg',
        },
        {
            key: 'APPLICATION_URL',
            value: '/data',
        },
        {
            key: 'CATEGORY',
            value: 'Paramétrage',
        },
    ],
    skills: {},
};

export const smartObject8: SmartObjectDto = {
    uuid: '1a9cf3e7-090e-4df5-89f0-614762b0fc4f',
    modelKey: 'APPLICATION',
    properties: [
        {
            key: 'APP_KEY',
            value: 'security',
        },
        {
            key: 'NAME',
            value: 'Security',
        },
        {
            key: 'LOGO_URL',
            value: '/assets/icon/security.svg',
        },
        {
            key: 'APPLICATION_URL',
            value: '/security',
        },
        {
            key: 'CATEGORY',
            value: 'Paramétrage',
        },
    ],
    skills: {},
};

export const smartObject9: SmartObjectDto = {
    uuid: '6f9fd267-21d3-4a09-b7c6-be4ea7215692',
    modelKey: 'APPLICATION',
    properties: [
        {
            key: 'APP_KEY',
            value: 'preferences',
        },
        {
            key: 'NAME',
            value: 'Preference',
        },
        {
            key: 'LOGO_URL',
            value: '/assets/icon/preferences.svg',
        },
        {
            key: 'APPLICATION_URL',
            value: '/preferences',
        },
        {
            key: 'CATEGORY',
            value: 'Paramétrage',
        },
    ],
    skills: {},
};

export const smartObjectR: SmartObjectDto = {
    uuid: '8dbe2b22-7335-11e9-a923-1681be663d3e',
    modelKey: 'PERMISSION_TEST_R',
    properties: [
        {
            key: 'PROP_R1',
            value: 'PROP_R1_VALUE',
        }, {
            key: 'PROP_R2',
            value: 'PROP_R2_VALUE',
        },
    ],
    skills: {
    },
};

export const smartObjectRW: SmartObjectDto = {
    uuid: '91721490-7335-11e9-a923-1681be663d3e',
    modelKey: 'PERMISSION_TEST_RW',
    properties: [
        {
            key: 'PROP_RW1',
            value: 'PROP_RW1_VALUE',
        },
        {
            key: 'PROP_RW2',
            value: 'PROP_RW2_VALUE',
        },
    ],
    skills: {
    },
};

export const smartObjectX: SmartObjectDto = {
    uuid: '9549796e-7335-11e9-a923-1681be663d3e',
    modelKey: 'PERMISSION_TEST_X',
    properties: [
        {
            key: 'PROP_X1',
            value: 'PROP_X1_VALUE',
        }, {
            key: 'PROP_X2',
            value: 'PROP_X2_VALUE',
        },
    ],
    skills: {
    },
};

export const smartObjectsRecursive: SmartObjectDto[] = [
    {
        uuid: '698658de-789a-4b01-80e9-f1ecd8898346',
        modelKey: 'parent',
        properties: [
            {
                key: 'CHILDS',
                value: [
                    '698658de-789a-4b01-80e9-f1ecd8898347',
                ],
            },
        ],
        skills: {},
    },
    {
        uuid: '698658de-789a-4b01-80e9-f1ecd8898347',

        modelKey: 'child',
        properties: [
            {
                key: 'CHILDS',
                value: [
                    '698658de-789a-4b01-80e9-f1ecd8898347',
                    '698658de-789a-4b01-80e9-f1ecd8898348',
                    '698658de-789a-4b01-80e9-f1ecd8898349',
                ],
            },
        ],
        skills: {},
    },
    {
        uuid: '698658de-789a-4b01-80e9-f1ecd8898348',

        modelKey: 'child',
        properties: [
            {
                key: 'CHILDS',
                value: [],
            },
        ],
        skills: {},
    },
    {
        uuid: '698658de-789a-4b01-80e9-f1ecd8898349',

        modelKey: 'child',
        properties: [
            {
                key: 'CHILDS',
                value: [
                    '698658de-789a-4b01-80e9-f1ecd8898350',
                ],
            },
        ],
        skills: {},
    },
];

export const smartObjectRecursiveDeleted: SmartObjectDto = {
    uuid: '698658de-789a-4b01-80e9-f1ecd8898350',
    modelKey: 'child',
    properties: [
        {
            key: 'CHILDS',
            value: [
            ],
        },
    ],
    skills: {},
};
// SO pour les skill geo
export const createSmartObectGeo: SmartObjectDto = {
    uuid: '66a741da-41ac-4ac9-9273-73ded472ba46',
    modelKey: 'LOCALISATION',
    properties: [
        {
            key: 'NAME',
            value: 'test-local-1',
        },
    ],
    skills: {
        atGeolocation: {
            geo: [
                {
                    uuid: '12075c7c-9146-4956-91d4-81cd4cba079e',
                    layerKey: 'layer-key-1',
                    geometries: [{
                        coordinates: [50, 100],
                        type: 'point',
                    }],
                },
            ],
        },
    },
};

export const removeSmartObectGeoLayer: SmartObjectDto = {
    uuid: '66a741da-41ac-4ac9-9273-73ded472ba46',
    modelKey: 'LOCALISATION',
    properties: [
        {
            key: 'NAME',
            value: 'test-local-1',
        },
    ],
    skills: {
        atGeolocation: {
            geo: [
            ],
        },
    },
};

export const createSmartObject: SmartObjectDto =
{
    uuid: '698658de-789a-1201-80e9-f1ecd8898350',
    modelKey: 'NATURE',
    properties: [
        {
            key: 'NAME',
            value: 'MAINT/PROD',
        }, {
            key: 'TYPE',
            value: null,
        },
    ],
    skills: {},
};

export const receiveSmartModel: SmartObjectDto = {
    uuid: '5594b3cf-8d93-4da2-a3f0-e65277a9afhh',
    modelKey: 'NATURE',
    properties: [
        {
            key: 'NAME',
            value: 'Nature',
        },
        {
            key: 'TYPE',
            value: '5594b3cf-8d93-4da2-a3f0-e65277a9accc',
        },
    ],
    skills: {
    },
};

export const natureType: SmartObjectDto = {
    uuid: '5594b3cf-8d93-4da2-a3f0-e65277a9accc',
    modelKey: 'NATURE_TYPE',
    properties: [
        {
            key: 'TYPE',
            value: 'Type',
        },
    ],
    skills: {
    },
}

export const user: SmartObjectDto = {
    uuid: 'd36b26dd-1bcc-4b67-b632-9edd0b312bca',
    modelKey: 'USER',
    properties: [
        {
            key: 'EMAIL',
            value: 'j.ford@mail.fr'
        },
        {
            key: 'FIRSTNAME',
            value: 'John'
        },
        {
            key: 'LASTNAME',
            value: 'Ford'
        },
        {
            key: 'LOGIN',
            value: 'jford'
        },
        {
            key: 'PASSWORD',
            value: '123456'
        },
        {
            key: 'CREDENTIALS_TYPE',
            value: 'password'
        },
        {
            key: 'CREDENTIALS_TOKEN',
            value: 'null'
        },
        {
            key: 'EXPIRATION_DATE',
            value: 'null'
        },
        {
            key: 'GROUPS',
            value: 'admin'
        },
        {
            key: 'AUTHORIZED_APPLICATIONS',
            value: [
                'plan',
                'documents',
                'tasks',
                'workflow',
                'data',
                'security',
                'preferences'
            ]
        },
        {
            key: 'ENABLED',
            value: 'true'
        },
        {
            key: 'PICTURE_URL',
            value: ''
        }
    ],
    skills: {}
};

export const newUser: SmartObjectDto = {
    modelKey: 'USER',
    properties: [
        {
            key: 'EMAIL',
            value: 'jford@hotmail.com',
        },
        {
            key: 'LOGIN',
            value: 'jford',
        },
    ],
    skills: {},
};

export const smartObjectMultiple: SmartObjectDto = {
    modelKey: 'EQUIPMENT',
    properties: [
        {
            key: 'NAME',
            value: '3019-MFG-LO2-FLR-SOUTIREUSE_MATRIX-10482952-EQP-UTIL-ELEC-0',
        },
        {
            key: 'DOCUMENTS',
            value: ['5594b3cf-8d93-4da2-a3f0-e65277a9af99'],
        },
    ],
    skills: {},
};

export const smartObjectMultipleUpdate: SmartObjectDto = {
    modelKey: 'EQUIPMENT',
    properties: [
        {
            key: 'NAME',
            value: 'UPDATED-3019-MFG-LO2-FLR-SOUTIREUSE_MATRIX-10482952-EQP-UTIL-ELEC-0',
        },
        {
            key: 'DOCUMENTS',
            value: ['5594b3cf-8d93-4da2-a3f0-e65277a9af99'],
        },
    ],
    skills: {},
};

export const searchByDoc: SmartObjectDto = {
    uuid: 'a14dc702-9a0e-46ec-bc1f-5adfd3ff7e4a',
    modelKey: 'EQUIPMENT',
    properties: [
        {
            key: 'NAME',
            value: 'Equipment_01',
        },
        {
            key: 'DOCUMENTS',
            value: [
                '5594b3cf-8d93-4da2-a3f0-e65277a9af99',
            ],
        },
    ],
    skills: {
        atDocument: {
            documents: [
                '3c731aa0-025c-4d70-8587-be8371194d0b',
                'ca48c07e-06c5-11ea-9a9f-362b9e155667',
            ],
        },
    },
};

export const smartObjectsTree: SmartObjectDto[] = [
    {
        uuid: '698658de-789a-4b01-80e9-f1ecd8898500',
        modelKey: 'parent',
        properties: [
            {
                key: 'CHILDS',
                value: [
                    '698658de-789a-4b01-80e9-f1ecd8898501',
                ],
            },
        ],
        skills: {},
    },
    {
        uuid: '698658de-789a-4b01-80e9-f1ecd8898501',
        modelKey: 'child',
        properties: [
            {
                key: 'CHILDS',
                value: [
                    '698658de-789a-4b01-80e9-f1ecd8898502',
                ],
            },
        ],
        skills: {},
    }, {
        uuid: '698658de-789a-4b01-80e9-f1ecd8898502',
        modelKey: 'child',
        properties: [
            {
                key: 'CHILDS',
                value: [
                    '698658de-789a-4b01-80e9-f1ecd8898503',
                    '698658de-789a-4b01-80e9-f1ecd8898504',
                ],
            },
        ],
        skills: {},
    }, {
        uuid: '698658de-789a-4b01-80e9-f1ecd8898503',
        modelKey: 'child',
        properties: [
            {
                key: 'CHILDS',
                value: [
                ],
            },
        ],
        skills: {},
    },
    {
        uuid: '698658de-789a-4b01-80e9-f1ecd8898504',
        modelKey: 'child',
        properties: [
            {
                key: 'CHILDS',
                value: [
                ],
            },
        ],
        skills: {},
    },
];

export const createSOProperties: SmartObjectDto = {
    uuid: '812b317a-a76a-4477-9143-378ca172427d',
    modelKey: 'DOCUMENT',
    properties: [
        {
            key: 'NAME',
            value: 'Plan de masse',
        },
        {
            key: 'VERSION',
            value: [],
        },
        {
            key: 'DATE',
            value: new Date('2020-01-01T08:00:00.000Z'),
        },
        {
            key: 'STATES',
            value: 'borrowed',
        },
        {
            key: 'USER',
            value: 'd36b26dd-1bcc-4b67-b632-9edd0b312bca',
        }, {
            key: 'NATURE',
            value: '698658de-789a-1201-80e9-f1ecd8898350',
        },
    ],
    skills: {},
};

export const smartObjectAllTypes = {
    uuid: 'db2cb9e3-499f-4c79-9f6a-88f5497da228',
    modelKey: 'alltypes',
    properties: [
        {
            key: 'KEY',
            value: '31'
        },
        {
            key: 'DATE',
            value: null
        },
        {
            key: 'DATETIME',
            value: '2030-01-01T00:00:00Z'
        },
        {
            key: 'TIME',
            value: '1:08 PM'
        },
        {
            key: 'HTML',
            value: '<i>text</i>'
        },
        {
            key: 'COMMENT',
            value: null
        },
        {
            key: 'SO',
            value: '698658de-789a-4b01-80e9-f1ecd8898510'
        },
        {
            key: 'STRING_M',
            value: [
                'text',
            ]
        },
        {
            key: 'so_m',
            value: [
                '698658de-789a-4b01-80e9-f1ecd8898510',
                '698658de-789a-4b01-80e9-f1ecd8898507'
            ]
        },
        {
            key: 'NUMBER_M',
            value: [
                15.88
            ]
        },
        {
            key: 'BOOL_M',
            value: [
                true
            ]
        },
        {
            key: 'GLIST_M',
            value: [
                'depannage'
            ]
        },
        {
            key: 'DATETIME_M',
            value: [
                '2032-01-01T00:00:00Z'
            ]
        },
        {
            key: 'SO_COMP',
            value: '698658de-789a-4b01-80e9-f1ecd8898511'
        }
    ],
    skills: {
        atGeolocation: {
            geo: []
        },
        atDocument: {
            documents: []
        },
        atSignature: null,
        atTag: {
            tags: []
        },
        atMagnet: {
            zones: []
        }
    }
}