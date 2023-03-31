import { PatchPropertyDto, SmartModelDto } from '@algotech-ce/core';

export const smartModel1: SmartModelDto = {
    uuid: '4e4551fa-e964-4492-99ff-171cea42791c',
    key: 'DOCUMENT',
    domainKey: 'GED',
    system: false,
    uniqueKeys: [],
    displayName: [
        {
            lang: 'en-US',
            value: 'Document',
        },
        {
            lang: 'fr-FR',
            value: 'Document',
        },
    ],
    properties: [
        {
            uuid: 'a06834d3-501b-4a76-847a-ce9862b464a1',
            key: 'NAME',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Name',
                },
                {
                    lang: 'fr-FR',
                    value: 'Nom',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
        {
            uuid: 'b178aae6-12cf-4dec-bf7e-e74808b8cdc0',
            key: 'VERSION',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Version',
                },
                {
                    lang: 'fr-FR',
                    value: 'Version',
                },
            ],
            keyType: 'string',
            multiple: true,
            required: true,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
        {
            uuid: 'a06834d3-501b-4a76-847a-ce9862b46zzz',
            key: 'DATE',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Date',
                },
                {
                    lang: 'fr-FR',
                    value: 'Date',
                },
            ],
            keyType: 'date',
            multiple: false,
            required: true,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
        {
            uuid: 'a4310f4f-3485-43a8-8e6b-80450d1807fe',
            key: 'STATES',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'States',
                },
                {
                    lang: 'fr-FR',
                    value: 'Etats',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            system: false,
            hidden: true,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
        {
            uuid: '35516285-8710-4277-a471-87726d1ad45c',
            key: 'USER',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'User',
                },
                {
                    lang: 'fr-FR',
                    value: 'Utilisateur',
                },
            ],
            keyType: 'so:USER',
            multiple: false,
            required: true,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
        {
            uuid: 'a99e25d7-05bc-287f-5ea9-66c7b5089942',
            key: 'NATURE',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Nature',
                },
                {
                    lang: 'fr-FR',
                    value: 'Nature',
                },
            ],
            keyType: 'so:NATURE',
            multiple: false,
            required: false,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
            composition: true,
        },
    ],
    skills: {
        atGeolocation: false,
        atDocument: true,
    },
    permissions: {
        R: [],
        RW: [
            'admin',
            'technician',
        ],
    },
};

export const smartModelPermR: SmartModelDto = {
    uuid: '6435d3b8-7245-11e9-a923-1681be663d3e',
    key: 'PERMISSION_TEST_R',
    domainKey: 'SYSTEM',
    system: true,
    uniqueKeys: [],
    displayName: [
        {
            lang: 'en-US',
            value: 'PERMISSION_TEST_R',
        },
        {
            lang: 'fr-FR',
            value: 'PERMISSION_TEST_R',
        },
    ],
    properties: [
        {
            uuid: '36b107b8-724b-11e9-a923-1681be663d3e',
            key: 'PROP_R1',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Application Key',
                },
                {
                    lang: 'fr-FR',
                    value: 'Clé d\'application',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            system: true,
            hidden: true,
            permissions: {
                R: [
                    'admin',
                ],
                RW: [
                    'technician',
                ],
            },
        },
        {
            uuid: '3b26e966-724b-11e9-a923-1681be663d3e',
            key: 'PROP_R2',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Name',
                },
                {
                    lang: 'fr-FR',
                    value: 'Nom',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            system: true,
            hidden: false,
            permissions: {
                R: [
                    'admin',
                ],
                RW: [
                    'technician',
                ],
            },
        },
    ],
    skills: {
        atGeolocation: false,
        atDocument: false,
    },
    permissions: {
        R: [
            'admin',
        ],
        RW: [
            'technician',
        ],
    },
};

export const smartModelPermRW: SmartModelDto = {
    uuid: '45bf237a-724b-11e9-a923-1681be663d3e',
    key: 'PERMISSION_TEST_RW',
    domainKey: 'SYSTEM',
    system: true,
    uniqueKeys: [],
    displayName: [
        {
            lang: 'en-US',
            value: 'PERMISSION_TEST_RW',
        },
        {
            lang: 'fr-FR',
            value: 'PERMISSION_TEST_RW',
        },
    ],
    properties: [
        {
            uuid: '4c20408c-724b-11e9-a923-1681be663d3e',
            key: 'PROP_RW1',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Application Key',
                },
                {
                    lang: 'fr-FR',
                    value: 'Clé d\'application',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            defaultValue: 'PROP_RW1_VALUE',
            system: true,
            hidden: true,
            permissions: {
                R: [
                    'admin',
                ],
                RW: [
                    'technician',
                ],
            },
        },
        {
            uuid: '520f709e-724b-11e9-8848-1681be663d3e',
            key: 'PROP_RW2',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Name',
                },
                {
                    lang: 'fr-FR',
                    value: 'Nom',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            system: true,
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
    ],
    skills: {
        atGeolocation: false,
        atDocument: false,
    },
    permissions: {
        R: [],
        RW: [
            'admin',
            'technician',
        ],
    },
};

export const smartModelPermX: SmartModelDto = {
    uuid: 'af643ea2-7334-11e9-a923-1681be663d3e',
    key: 'PERMISSION_TEST_X',
    domainKey: 'SYSTEM',
    system: true,
    uniqueKeys: [],
    displayName: [
        {
            lang: 'en-US',
            value: 'PERMISSION_TEST_X',
        },
        {
            lang: 'fr-FR',
            value: 'PERMISSION_TEST_X',
        },
    ],
    properties: [
        {
            uuid: 'b399a61a-7334-11e9-a923-1681be663d3e',
            key: 'PROP_X1',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Application Key',
                },
                {
                    lang: 'fr-FR',
                    value: 'Clé d\'application',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            system: true,
            hidden: true,
            permissions: {
                R: [],
                RW: [
                    'technician',
                ],
            },
        },
        {
            uuid: 'c0a6cf90-7334-11e9-a923-1681be663d3e',
            key: 'PROP_X2',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Name',
                },
                {
                    lang: 'fr-FR',
                    value: 'Nom',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            system: true,
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'technician',
                ],
            },
        },
    ],
    skills: {
        atGeolocation: false,
        atDocument: false,
    },
    permissions: {
        R: [],
        RW: [
            'technician',
        ],
    },
};

export const createsmartModel: SmartModelDto  = {
    key: 'CI-KEY',
    system: false,
    uniqueKeys: [],
    domainKey: 'GED',
    displayName: [
        {
            lang: 'en-US',
            value: 'Nature',
        },
        {
            lang: 'fr-FR',
            value: 'Nature',
        },
    ],
    properties: [
        {
            uuid: '10a5971c-30f2-4581-a680-606c37013fac',
            key: 'name',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Name',
                },
                {
                    lang: 'fr-FR',
                    value: 'Nom',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
    ],
    skills: {
        atGeolocation: false,
        atDocument: false,
    },
    permissions: {
        R: [],
        RW: [
            'admin',
            'technician',
        ],
    },
};

export const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/properties/[key:VERSION]/displayName/[lang:fr-FR]/value',
    value: 'Une Version',
};

export const patchPush: PatchPropertyDto = {
    op: 'add',
    path: '/properties/[key:VERSION]/displayName/[?]',
    value:
    {
        lang: 'es-ES',
        value: 'Versión',
    },
};

export const patchSetError: PatchPropertyDto = {
    op: 'add',
    path: '/ppppppproperties/[key:VERSION]/displayName/[lang:en-US]/caption',
    value: 'Version',
};

export const patchSetNoRespectModel: PatchPropertyDto = {
    op: 'add',
    path: '/properties/[key:VERSION]/displayName/[lang:en-US]/caption',
    value: 'Version',
};

export const patchPull: PatchPropertyDto = {
    op: 'remove',
    path: '/properties/[key:NAME]/displayName/[lang:fr-FR]',
};

export const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/key',
};

export const smartModulePatched = {
    displayName: [
        {
            lang: 'en-US',
            value: 'Version',
        },
        {
            lang: 'fr-FR',
            value: 'Une Version',
        },
        {
            lang: 'es-ES',
            value: 'Versión',
        },
    ],
};

export const findSmartModel: SmartModelDto = {
    key: 'EQUIPMENT',
    system: false,
    domainKey: 'GED',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Equipement',
        },
        {
            lang: 'en-US',
            value: 'Equipment',
        },
        {
            lang: 'es-ES',
            value: '',
        },
    ],
    properties: [
        {
            validations: [],
            uuid: 'bf32f32f-3f7e-ff21-05c5-9acbd1ebc658',
            key: 'NAME',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Nom',
                },
                {
                    lang: 'en-US',
                    value: 'Name',
                },
                {
                    lang: 'es-ES',
                    value: '',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            defaultValue: '',
            system: false,
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
        {
            validations: [],
            uuid: 'ef872be6-2221-3dec-b8e8-ec470b5296ef',
            key: 'DOCUMENTS',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Documents',
                },
                {
                    lang: 'en-US',
                    value: 'Documents',
                },
                {
                    lang: 'es-ES',
                    value: '',
                },
            ],
            keyType: 'so:DOCUMENT',
            multiple: true,
            required: true,
            system: false,
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
    ],
    skills: {
        atGeolocation: false,
        atDocument: false,
    },
    permissions: {
        R: [],
        RW: [
            'admin',
            'technician',
        ],
    },
    uniqueKeys: [],
};

export const recursiveModel: SmartModelDto = {
    key: 'parent',
    domainKey: 'RECURSIVE',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'PARENT',
        },
        {
            lang : 'en-US',
            value : '',
        },
        {
            lang : 'es-ES',
            value : '',
        },
    ],
    permissions: {
        R: [],
        RW: [
            'admin',
            'technician',
        ],
    },
    properties: [
        {
            composition: true,
            defaultValue : '',
            displayName : [
                {
                    lang : 'fr-FR',
                    value : '',
                },
                {
                    lang : 'en-US',
                    value : '',
                },
                {
                    lang : 'es-ES',
                    value : '',
                },
            ],
            hidden: false,
            key: 'CHILDS',
            keyType: 'so:child',
            multiple: true,
            permissions : {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
            required : false,
            system : false,
            uuid : 'b19a21ef-6735-b7b8-4f71-786419209a9d',
            validations : [],
        },
    ],
    skills: {
        atDocument: false,
        atGeolocation : false,
    },
    system: false,
    uniqueKeys: [],
    uuid: '37552efc-64ca-c600-59c3-6919b91ebced',
};