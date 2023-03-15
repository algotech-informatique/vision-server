import { TagDto, TagListDto } from '@algotech/core';

export const listTag: TagListDto = {
    uuid: 'e8dfa860-01ff-11ea-8d71-362b9e155667',
    key: 'liste-1',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Liste 1',
        },
        {
            lang: 'en-US',
            value: 'List 1',
        },
        {
            lang: 'es-ES',
            value: 'Lista 1',
        },
    ],
    modelKeyApplication: ['armoire', 'machine'],
    applyToDocuments: false,
    applyToImages: false,
    tags: [
        {
            uuid: 'f345861c-01ff-11ea-8d71-362b9e155667',
            key: 'etude',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Etude',
                },
                {
                    lang: 'en-US',
                    value: 'Study',
                },
                {
                    lang: 'es-ES',
                    value: 'Estudio',
                },
            ],
            color: '#2D9CDB',
        },
        {
            uuid: 'ab485432-0201-11ea-9a9f-362b9e155667',
            key: 'chantier',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Chantier',
                },
                {
                    lang: 'en-US',
                    value: 'Construction site',
                },
                {
                    lang: 'es-ES',
                    value: 'Sitio',
                },
            ],
            color: '#009688',
        },
        {
            uuid: 'af301292-0201-11ea-9a9f-362b9e155667',
            key: 'reserve',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Reserve',
                },
                {
                    lang: 'en-US',
                    value: 'Reserve',
                },
                {
                    lang: 'es-ES',
                    value: 'Reserva',
                },
            ],
            color: '#F95959',
        },
        {
            uuid: 'b3b3d15a-0201-11ea-9a9f-362b9e155667',
            key: 'exe',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Exé',
                },
                {
                    lang: 'en-US',
                    value: 'Exe',
                },
                {
                    lang: 'es-ES',
                    value: 'Exe',
                },
            ],
            color: '#BB6BD9',
        },
        {
            uuid: 'b74c4d10-0201-11ea-8d71-362b9e155667',
            key: 'panne',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Panne',
                },
                {
                    lang: 'en-US',
                    value: 'Breakdown',
                },
                {
                    lang: 'es-ES',
                    value: 'Ruptura',
                },
            ],
            color: '#D77B38',
        },
    ],
};

export const createListTag: TagListDto = {
    key: 'etat',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Etat',
        },
        {
            lang: 'en-US',
            value: 'State',
        },
        {
            lang: 'es-ES',
            value: 'Estado',
        },
    ],
    modelKeyApplication: ['armoire', 'machine'],
    applyToDocuments: false,
    applyToImages: false,
    tags: [
        {
            uuid: 'c7d9205a-020f-11ea-8d71-362b9e155667',
            key: 'repare',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Reparé',
                },
                {
                    lang: 'en-US',
                    value: 'Repared',
                },
                {
                    lang: 'es-ES',
                    value: 'Reparado',
                },
            ],
            color: '#12c474',
        },
        {
            uuid: 'd0ce23a4-020f-11ea-8d71-362b9e155667',
            key: 'casse',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Cassé',
                },
                {
                    lang: 'en-US',
                    value: 'Broken',
                },
                {
                    lang: 'es-ES',
                    value: 'Roto',
                },
            ],
            color: '#d9563f',
        },
    ],
};

export const modifyDuplicateTagKey: TagListDto = {
    key: 'etat',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Etat',
        },
        {
            lang: 'en-US',
            value: 'State',
        },
        {
            lang: 'es-ES',
            value: 'Estado',
        },
    ],
    modelKeyApplication: ['armoire', 'machine'],
    applyToDocuments: false,
    applyToImages: false,
    tags: [
        {
            uuid: 'af301292-0201-11ea-9a9f-362b9e155667',
            key: 'reserve',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Reserve',
                },
                {
                    lang: 'en-US',
                    value: 'Reserve',
                },
                {
                    lang: 'es-ES',
                    value: 'Reserva',
                },
            ],
            color: '#F95959',
        },
        {
            uuid: 'af301292-0201-11ea-9a9f-362b9e155668',
            key: 'reserve',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Reserve',
                },
                {
                    lang: 'en-US',
                    value: 'Reserve',
                },
                {
                    lang: 'es-ES',
                    value: 'Reserva',
                },
            ],
            color: '#F95959',
        },
    ],
};

export const createTagListController: TagListDto = {
    key: 'new-tag-list-cntl',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'test - list fr 1',
        },
        {
            lang: 'en-US',
            value: 'test - list en 1',
        },
        {
            lang: 'es-ES',
            value: 'test - list es 1',
        },
    ],
    modelKeyApplication: [],
    applyToDocuments: false,
    applyToImages: false,
    tags: [{
        uuid: '64cedb0a-3285-4f29-8c91-3c07d34b6600',
        key: 'cnt1-01',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'new tag FR',
            },
            {
                lang: 'en-US',
                value: 'new tag EN',
            },
            {
                lang: 'es-ES',
                value: 'new tag ES',
            },
        ],
        color: '#2D9CDB',
    }],
    uuid: 'dd495608-dd81-4b9c-aa6a-e026b6c30c99',
};

export const addTag: TagDto = {
    uuid: 'ef174ee5-842a-4b84-8065-640892ba24bb',
    key: 'new-tag-',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'new tag FR',
        },
        {
            lang: 'en-US',
            value: 'new tag EN',
        },
        {
            lang: 'es-ES',
            value: 'new tag ES',
        },
    ],
    color: '#2D9CDB',
};

export const ExistingList: TagListDto = {
    uuid : '10ad7519-edf2-6b88-9a2b-ea23b08d7ac2',
    key : 'new-tag',
    displayName : [
        {
            lang : 'fr-FR',
            value : 'Liste 1',
        },
        {
            lang : 'en-US',
            value : 'List 1',
        },
        {
            lang : 'es-ES',
            value : 'Lista 1',
        },
    ],
    modelKeyApplication: [],
    applyToDocuments: false,
    applyToImages: false,
    tags: [],
};

export const tagsListWithTags: TagListDto[] = [
    {
        uuid : 'e8dfa860-01ff-11ea-8d71-362b9e155667',
        key: 'liste-1',
        displayName: [
            {
                lang : 'fr-FR',
                value : 'Liste 1',
            },
            {
                lang : 'en-US',
                value : 'List 1',
            },
            {
                lang : 'es-ES',
                value : 'Lista 1',
            },
        ],
        modelKeyApplication : [
            'armoire',
            'machine',
        ],
        applyToDocuments : false,
        applyToImages : false,
        tags: [
            {
                uuid: 'f345861c-01ff-11ea-8d71-362b9e155667',
                key: 'etude',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Etude',
                    },
                    {
                        lang: 'en-US',
                        value: 'Study',
                    },
                    {
                        lang: 'es-ES',
                        value: 'Estudio',
                    },
                ],
                color: '#2D9CDB',
            },
            {
                uuid: 'ab485432-0201-11ea-9a9f-362b9e155667',
                key: 'chantier',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Chantier',
                    },
                    {
                        lang: 'en-US',
                        value: 'Construction site',
                    },
                    {
                        lang: 'es-ES',
                        value: 'Sitio',
                    },
                ],
                color: '#009688',
            },
            {
                uuid: 'af301292-0201-11ea-9a9f-362b9e155667',
                key: 'reserve',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Reserve',
                    },
                    {
                        lang: 'en-US',
                        value: 'Reserve',
                    },
                    {
                        lang: 'es-ES',
                        value: 'Reserva',
                    },
                ],
                color: '#F95959',
            },
            {
                uuid: 'b3b3d15a-0201-11ea-9a9f-362b9e155667',
                key: 'exe',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Exé',
                    },
                    {
                        lang: 'en-US',
                        value: 'Exe',
                    },
                    {
                        lang: 'es-ES',
                        value: 'Exe',
                    },
                ],
                color: '#BB6BD9',
            },
            {
                uuid: 'b74c4d10-0201-11ea-8d71-362b9e155667',
                key: 'panne',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Panne',
                    },
                    {
                        lang: 'en-US',
                        value: 'Breakdown',
                    },
                    {
                        lang: 'es-ES',
                        value: 'Ruptura',
                    },
                ],
                color: '#D77B38',
            },
        ],
    },
];

export const createTagList: TagListDto = {
    key: 'new-tag-list',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'test - list fr 1',
        },
        {
            lang: 'en-US',
            value: 'test - list en 1',
        },
        {
            lang: 'es-ES',
            value: 'test - list es 1',
        },
    ],
    modelKeyApplication: [],
    applyToDocuments: false,
    applyToImages: false,
    tags: [{
        uuid: '64cedb0a-3285-4f29-8c91-3c07d34b6457',
        key: 'nt-01',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'new tag FR',
            },
            {
                lang: 'en-US',
                value: 'new tag EN',
            },
            {
                lang: 'es-ES',
                value: 'new tag ES',
            },
        ],
        color: '#2D9CDB',
    }],
    uuid: 'dd495608-dd81-4b9c-aa6a-e026b6c30c84',
};

export const createTagListDuplicate: TagListDto = {
    key: 'tag-list-dupl',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'test - list fr 2',
        },
        {
            lang: 'en-US',
            value: 'test - list en 2',
        },
        {
            lang: 'es-ES',
            value: 'test - list es 2',
        },
    ],
    modelKeyApplication: [],
    applyToDocuments: false,
    applyToImages: false,
    tags: [
        {
            uuid: 'b9e33873-efa1-4d89-8753-dc58140fae59',
            key: 'etude',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Etude',
                },
                {
                    lang: 'en-US',
                    value: 'Study',
                },
                {
                    lang: 'es-ES',
                    value: 'Estudio',
                },
            ],
            color: '#2D9CDB',
        },
        {
            uuid: '18f780ff-ba86-4e37-949e-1d1018451928',
            key: 'tag-dup',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Chantier',
                },
                {
                    lang: 'en-US',
                    value: 'Construction site',
                },
                {
                    lang: 'es-ES',
                    value: 'Sitio',
                },
            ],
            color: '#009688',
        },
    ],
    uuid: '04529547-3d78-4456-8355-0948f037c83a',
};

export const createTagListNullTag: TagListDto = {
    key: 'new-tag-list-tag',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'test - list tag fr 1',
        },
        {
            lang: 'en-US',
            value: 'test - list tag en 1',
        },
        {
            lang: 'es-ES',
            value: 'test - list tag es 1',
        },
    ],
    modelKeyApplication: [],
    applyToDocuments: false,
    applyToImages: false,
    tags: [
        null,
    ],
    uuid: 'dd495608-de82-4b9c-aa6a-e026b6c30c84',
};

export const tagDuplicate: TagDto = {
    uuid: '87175cb0-dd7d-465a-a626-55644c711daa',
    key: 'etude',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Etude',
        },
        {
            lang: 'en-US',
            value: 'Study',
        },
        {
            lang: 'es-ES',
            value: 'Estudio',
        },
    ],
    color: '#2D9CDB',
};
