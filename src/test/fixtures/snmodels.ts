import { SnModelDto } from '@algotech/core';

export const listSnModel: SnModelDto[] = [
    {
        uuid: 'bfd4aaff-e4d0-c7ff-70b5-d1fb8b4c1a00',
        key: 'testModel01',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'Test Model-01',
            },
            {
                lang: 'en-US',
                value: 'test model-01',
            },
            {
                lang: 'es-ES',
                value: 'test model-01'
            }
        ],
        type: 'workflow',
        versions: [],
    },
    {
        uuid: '3b01859b-d9cf-f650-8187-aa46ac487663',
        key: 'testModel02',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'Test Model-02',
            },
            {
                lang: 'en-US',
                value: 'test model en-02',
            },
            {
                lang: 'es-ES',
                value: 'test model es-02'
            }
        ],
        type: 'workflow',
        versions: [
            {
                createdDate: '2020-05-19T11:13:45.511Z',
                deleted: false,
                uuid: 'e8dfa860-01ff-11ea-8d71-362b9e155661',
                creatorUuid: 'd36b26dd-1bcc-4b67-b632-9edd0b312bca',
                view: {
                    box: [
                        {
                            id: '80e08d5a-790c-48ca-a152-02a29f134008',
                            displayName: 'box - 11',
                            canvas: {
                                x: 200,
                                y: 400,
                            },
                            open: true,
                        },
                    ],
                    groups: [],
                    nodes: [],
                    comments: [],
                    drawing: {
                        lines: [],
                        elements: [],
                    },
                    id: '727fce50-cd9d-d57b-168c-006846f20fa1',
                },
            },
        ],
    }, {
        uuid: 'c0a9e078-7a48-4a05-8a90-a382226fc636',
        key: 'New-Model-test',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'Nouveau SnModel Test',
            },
            {
                lang: 'en-US',
                value: 'New SnModel Test',
            },
            {
                lang: 'es-ES',
                value: 'Nueva prueba SnModel'
            },
        ],
        type: 'workflow',
        versions: [],
    },
];

export const createSnModel: SnModelDto = {
    uuid: 'c0a9e078-7a48-4a05-8a90-a382226fc636',
    key: 'New-Model-test',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
        {
            lang: 'en-US',
            value: 'test model en-02',
        },
        {
            lang: 'es-ES',
            value: 'test model es-02'
        },
    ],
    type: 'workflow',
    versions: [],
};