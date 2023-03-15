import { UserDto } from '@algotech/core';

export const user1: UserDto = {
    customerKey: 'algotech',
    uuid: '110e8400-e29b-11d4-a716-446655440000',
    enabled: true,
    groups: ['admin', 'process-manager'],
    preferedLang: 'fr-FR',
    username: 'jsmith',
    email: 'joe.smith@mail.fr',
    firstName: 'Joe',
    lastName: 'Smith',
    pictureUrl: 'https://picture.url',
    mobileToken: '',
    following: [
        '8837d594-ab33-467a-8b5d-9a5591d5929d',
        '5d660373-a029-4e1a-8e0f-f51b344cddeb',
        '7f2d4443-fd80-4f90-bac4-83e36cfd8b40',
    ],
    favorites: {
        documents: [
            'bed0878d-4402-41d3-a655-849feb8b9184',
            '353c6edc-8896-4d7c-a668-9360f94628a3',
        ],
        smartObjects: [],
    },
};

export const user2: UserDto = {
    customerKey: 'algotech',
    uuid: '110e8400-e29b-11d4-a716-446655440001',
    enabled: true,
    groups: ['sadmin'],
    preferedLang: 'fr-FR',
    username: 'jford',
    email: 'j.ford@mail.fr',
    firstName: '',
    lastName: '',
    pictureUrl: 'https://',
    mobileToken: '',
    following: [],
    favorites: {
        documents: [],
        smartObjects: [],
    },
};

export const user3: UserDto = {
    customerKey: 'algotech',
    uuid: '110e8400-e29b-11d4-a716-446655440003',
    enabled: true,
    groups: ['viewer'],
    preferedLang: 'fr-FR',
    username: 'jbernard',
    email: 'j.bernard@mail.fr',
    firstName: 'Jean',
    lastName: 'Bernard',
    pictureUrl: 'https://picture.url',
    mobileToken: '',
    following: [
        '8837d594-ab33-467a-8b5d-9a5591d5929d',
        '7f2d4443-fd80-4f90-bac4-83e36cfd8b40',
    ],
    favorites: {
        documents: [
            '40d51dfc-adff-46b4-a0db-ed1b1cb0e03a',
        ],
        smartObjects: [
            'b311c1e6-027e-4140-b41f-863b0f94f370',
        ],
    },
};

export const user4: UserDto = {
    customerKey: 'algotech',
    uuid: '110e8400-e29b-11d4-a716-446655440004',
    enabled: true,
    groups: ['viewer'],
    preferedLang: 'fr-FR',
    username: 'jgodrie',
    email: 'j.godrie@mail.fr',
    firstName: 'Jean',
    lastName: 'Godrie',
    pictureUrl: 'https://picture.url',
    mobileToken: '',
    following: [
        '8837d594-ab33-467a-8b5d-9a5591d5929d',
        '7f2d4443-fd80-4f90-bac4-83e36cfd8b40',
    ],
    favorites: {
        documents: [],
        smartObjects: [],
    },
};
