import { SnModelDto } from '@algotech-ce/core';
import { SnModel } from '../../interfaces';

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
    },
    {
        uuid: 'c0a9e078-7a48-4a05-8a90-a382226fc636',
        key: 'New-Model-test',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'Nouveau SnModel Test',
            },
        ],
        type: 'workflow',
        versions: [],
    },
];

export const createSnModel: SnModelDto = {
    uuid: '7f52a02a-90d2-4393-8ced-43dd23e22fc4',
    key: 'create-Model-test',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
    ],
    type: 'workflow',
    versions: [],
};

export const createSnModelService: SnModel = {
    uuid: '7f52a02a-90d2-4393-8ced-43dd23e22fc4',
    key: 'create-Model-test',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
    ],
    type: 'workflow',
    versions: [],
    customerKey: 'algotech',
    deleted: false,
};

export const modifyCreatedSnModel: SnModelDto = {
    uuid: '7f52a02a-90d2-4393-8ced-43dd23e22fc4',
    key: 'create-Model-test',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
        {
            lang: 'en-US',
            value: 'test model en-02',
        },
    ],
    type: 'workflow',
    versions: [
        {
            createdDate: '2020-08-31T11:13:45.511Z',
            deleted: false,
            uuid: 'cda86945-7e47-4a81-845b-bfe93acc50c9',
            creatorUuid: 'd36b26dd-1bcc-4b67-b632-9edd0b312bca',
            view: {
                box: [
                    {
                        id: '808206d9-0714-4055-ac2a-2e586d494645',
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
                id: '1732ba44-7381-4027-91d0-764534d75314',
            },
        },
    ],
};

export const modifyCreatedSnModelService: SnModel = {
    uuid: '7f52a02a-90d2-4393-8ced-43dd23e22fc4',
    key: 'create-Model-test',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
        {
            lang: 'en-US',
            value: 'test model en-02',
        },
    ],
    type: 'workflow',
    versions: [
        {
            createdDate: '2020-08-31T11:13:45.511Z',
            deleted: false,
            uuid: 'cda86945-7e47-4a81-845b-bfe93acc50c9',
            creatorUuid: 'd36b26dd-1bcc-4b67-b632-9edd0b312bca',
            view: {
                box: [
                    {
                        id: '808206d9-0714-4055-ac2a-2e586d494645',
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
                id: '1732ba44-7381-4027-91d0-764534d75314',
            },
        },
    ],
    customerKey: 'algotech',
    deleted: false,
};

export const snModelTest1: SnModelDto = {
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
    ],
    type: 'workflow',
    versions: [],
};

export const snModelTest2: SnModelDto = {
    uuid: '3b01859b-d9cf-f650-8187-aa46ac487663',
    key: 'testModel02',
    displayName: [
        {
            lang: 'fr-Fr',
            value: 'Test Model-02',
        },
        {
            lang: 'en-US',
            value: 'test model en-02',
        },
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
};

export const NewSnModel: SnModelDto = {
    uuid: '60227e1a-4506-428f-a02d-11c549adfe8d',
    key: 'New-test-001',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
    ],
    type: 'workflow',
    versions: [],
};

export const duplicateNewSnModel: SnModelDto = {
    uuid: '8f3eba64-9e6f-11ea-bb37-0242ac130002',
    key: 'testModel02',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
    ],
    type: 'workflow',
    versions: [],
};

export const duplicateNewSnModelService: SnModel = {
    uuid: '8f3eba64-9e6f-11ea-bb37-0242ac130002',
    key: 'testModel02',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
    ],
    type: 'workflow',
    versions: [],
    customerKey: 'algotech',
    deleted: false,
};

export const modifySnModel: SnModelDto = {
    uuid: 'c0a9e078-7a48-4a05-8a90-a382226fc636',
    key: 'New-test-001-MODIFY',
    displayName: [
        {
            lang: 'fr-Fr',
            value: 'Nouveau SnModel (Test) - Fr',
        },
        {
            lang: 'en-US',
            value: 'New SnModel (Test) - En',
        },
    ],
    type: 'workflow',
    versions: [],
};