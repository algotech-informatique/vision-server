import { GenericListDto, PatchPropertyDto } from '@algotech/core';

export const gList1: GenericListDto = {
    uuid: '71c81d8e-f4cb-41b3-943e-023780c8e972',
    key: 'positions',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Poste',
        },
        {
            lang: 'en-US',
            value: 'Position',
        },
    ],
    protected: false,
    values: [
        {
            key: 'head',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Directeur',
                },
                {
                    lang: 'en-US',
                    value: 'Head',
                },
            ],
            index: 0,
        },
        {
            key: 'developer',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Développeur',
                },
                {
                    lang: 'en-US',
                    value: 'Developer',
                },
            ],
            index: 1,
        },
    ],
};

export const gList2: GenericListDto = {
    uuid: '22da4298-849e-4df8-ba1d-a97b6c8d4ef1',
    key: 'departments',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Service',
        },
        {
            lang: 'en-US',
            value: 'Department',
        },
    ],
    protected: false,
    values: [
        {
            key: 'computing',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Informatique',
                },
                {
                    lang: 'en-US',
                    value: 'Computing',
                },
            ],
            index: 0,
        },
        {
            key: 'marketing',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Marketing',
                },
                {
                    lang: 'en-US',
                    value: 'Marketing',
                },
            ],
            index: 1,
        },
    ],
};

export const gList3: GenericListDto = {
    uuid: '440e9579-5b6f-403c-ab7f-06fb33b7aa98',
    key: 'phones',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Téléphone',
        },
        {
            lang: 'en-US',
            value: 'Phone',
        },
    ],
    protected: false,
    values: [
        {
            key: 'office',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Bureau',
                },
                {
                    lang: 'en-US',
                    value: 'Office',
                },
            ],
            index: 0,
        },
        {
            key: 'mobile',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Mobile',
                },
                {
                    lang: 'en-US',
                    value: 'Mobile',
                },
            ],
            index: 1,
        },
    ],
};

export const gList4: GenericListDto = {
    uuid: '1a0c86ae-67b9-43b1-8893-8ddc40e7b78e',
    key: 'skills',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Compétence',
        },
        {
            lang: 'en-US',
            value: 'Skill',
        },
    ],
    protected: false,
    values: [
        {
            key: 'project_management',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Gestion de projet',
                },
                {
                    lang: 'en-US',
                    value: 'Project management',
                },
            ],
            index: 0,
        },
        {
            key: 'big_data',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Big data',
                },
                {
                    lang: 'en-US',
                    value: 'Big data',
                },
            ],
            index: 1,
        },
        {
            key: 'management',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Management',
                },
                {
                    lang: 'en-US',
                    value: 'Management',
                },
            ],
            index: 2,
        },
        {
            key: 'electronic',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Électronique',
                },
                {
                    lang: 'en-US',
                    value: 'Electronic',
                },
            ],
            index: 3,
        },
    ],
};

export const createGList: GenericListDto = {
    uuid: '46bb90fa-ac79-4973-9764-2a1ed1eb2725',
    key: 'test-glist',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'GList tests',
        },
        {
            lang: 'en-US',
            value: 'Glist Test (en)',
        },
    ],
    protected: false,
    values: [
        {
            key: 'key_value_1',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Key Value 1',
                },
                {
                    lang: 'en-US',
                    value: 'Key Value 1 (en)',
                },
            ],
            index: 0,
        },
        {
            key: 'key_value_2',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Key Value 2',
                },
                {
                    lang: 'en-US',
                    value: 'Key Value 2 (en)',
                },
            ],
            index: 1,
        },
    ],
};

export const updateGList: GenericListDto = {
    uuid: '46bb90fa-ac79-4973-9764-2a1ed1eb2725',
    key: 'test-glist',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'GList tests UPD',
        },
        {
            lang: 'en-US',
            value: 'Glist Test UPD (en)',
        },
    ],
    protected: false,
    values: [
        {
            key: 'key_value_1',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Key Value 1',
                },
                {
                    lang: 'en-US',
                    value: 'Key Value 1 (en)',
                },
            ],
            index: 0,
        },
        {
            key: 'key_value_2',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Key Value 2',
                },
                {
                    lang: 'en-US',
                    value: 'Key Value 2 (en)',
                },
            ],
            index: 1,
        },
        {
            key: 'key_value_3',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Key Value 3',
                },
                {
                    lang: 'en-US',
                    value: 'Key Value 3 (en)',
                },
            ],
            index: 2,
        },
    ],
};

export const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/values/[key:key_value_1]/value/[lang:fr-FR]/value',
    value: 'Key Value 1 Patched!',
};

export const patchPush: PatchPropertyDto = {
    op: 'add',
    path: '/displayName/[?]',
    value:
    {
        lang: 'es-ES',
        value: 'GList Test Patched (es)',
    },
};