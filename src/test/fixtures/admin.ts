import { CustomerDto, CustomerInitDto, CustomerInitResultDto, UserDto } from '@algotech-ce/core';

export const initCustomer: CustomerInitDto = {
    customerKey: 'nouveau',
    name: 'Le nouveau client',
    login: 'sadmin-nouveaux',
    email: 'abc@abc.com',
    password: '123456',
    languages: [{ lang: 'fr-FR', value: 'français' }, { lang: 'en-US', value: 'English' }],
    licenceKey: 'dsqdsqds',
};

export const initDatabase: CustomerInitDto = {
    customerKey: 'nouveau-database',
    name: 'Le nouveau client',
    login: 'sadmin-nouveaux',
    email: 'abc@database.com',
    password: '123456',
    languages: [{ lang: 'fr-FR', value: 'français' }, { lang: 'en-US', value: 'English' }],
    licenceKey: 'dsqdsqds',
};

export const initOk: CustomerInitResultDto[] = [
    { key: 'customers', value: 'ok' },
    { key: 'users', value: 'ok' },
    { key: 'groups', value: 'ok' },
    { key: 'settings', value: 'ok' },
    { key: 'environment', value: 'ok' },
    { key: 'smartnodes', value: 'ok' },
    { key: 'Smart Objects index', value: 'ok' }];

export const initko = {
    errorMsg: [
        { lang: 'fr', value: 'customer already set up' }],
    hasError: true,
    httpCode: 400,
};

export const deleteESIndex: CustomerInitResultDto[] = [
    { key: 'Smart Objects index', value: 'ok' },
    { key: 'Documents index', value: 'ok' },
];

export let newCustomer: CustomerDto = {
    uuid: 'c4251b97-f40d-705f-356f-a1ab2e2126da',
    customerKey: 'nouveau',
    name: 'Le nouveau client',
    logoUrl: null,
    languages: [
        {
            lang: 'fr-FR',
            value: 'français',
        },
        {
            lang: 'en-US',
            value: 'English',
        },
    ],
    licenceKey: 'dsqdsqds',
    applicationsKeys: [
    ],
};
export const newUser: UserDto = {
    groups : [
        'admin',
    ],
    following : [ ],
    uuid : '3a93f346-00ec-7438-20f0-31a911003a35',
    preferedLang : 'fr-FR',
    username : 'sadmin-nouveaux',
    email : 'abc@abc.com',
    firstName : '',
    lastName : '',
    customerKey : 'nouveau',
    pictureUrl : 'https://',
    favorites : {
        documents : [

        ],
        smartObjects : [
        ],
    },
};

export let customer1: CustomerDto = {
    uuid: 'd3f179ac-3415-49e9-857b-ead1b70cee92',
    customerKey: 'algotech',
    name: 'Algotech Informatique',
    logoUrl: 'fake-url:algotech',
    languages: [
        {
            lang: 'fr-FR',
            value: 'Français',
        },
        {
            lang: 'en-US',
            value: 'English',
        },
        {
            lang: 'es-ES',
            value: 'Español',
        },
    ],
    licenceKey: 'U2FsdGVkX19Qi4u1tBzPDXXkaju+hOJeU1qjn/MeUZMXHbs40XjPbs0pltlPx4UyxmNvK6Xi5r5ZULZR/hiEN9mG16UxLvMYEz2b/WTsdJ8=',
    applicationsKeys: [
        '5f9a0d75-847d-488f-85cd-57581d9c0dc6',
        '77378424-cc2d-4e0b-93bb-c0a996044dcc',
        'f8312f4d-b0e1-4fd8-a171-dbce6b44b5a0',
        '6410f97a-ea0e-4e47-9319-c86dcde7beab',
        '89ed7585-d170-403c-8fa1-ffe77bb098fc',
        '9143d896-019d-4cd0-85f8-2bfefe3eafeb',
        'a426a915-2f6f-406d-bdbf-1d1cd6f6fe2e',
    ],
};

export let customer2: CustomerDto = {
    uuid: '3db930f8-5f0f-4d78-a87f-ffb508de0e0c',
    customerKey: 'customerKey2',
    name: 'customerKey2',
    logoUrl: 'fake-url:customerKey2',
    languages: [
        {
            lang: 'fr-FR',
            value: 'Français',
        },
        {
            lang: 'en-US',
            value: 'English',
        },
        {
            lang: 'es-ES',
            value: 'Español',
        },
        {
            lang: 'de-DE',
            value: 'Deutsch',
        },
    ],
    licenceKey: 'U2FsdGVkX19Qi4u1tBzPDXXkaju+hOJeU1qjn/MeUZMXHbs40XjPbs0pltlPx4UyxmNvK6Xi5r5ZULZR/hiEN9mG16UxLvMYEz2b/WTsdJ8=',
    applicationsKeys: [
        'a426a915-2f6f-406d-bdbf-1d1cd6f6fe2e',
        '9143d896-019d-4cd0-85f8-2bfefe3eafeb',
        '5f9a0d75-847d-488f-85cd-57581d9c0dc6',
    ],
};

export let customer3: CustomerDto = {
    uuid : '8c01d259-ca93-4e66-822a-cfb53fa0d1fa',
    customerKey : 'customerKey3',
    name : 'customeKey3',
    logoUrl : 'fake-url:customerKey3',
    languages : [
        {
            lang : 'fr-FR',
            value : 'Français',
        },
    ],
    licenceKey : 'U2FsdGVkX19Qi4u1tBzPDXXkaju+hOJeU1qjn/MeUZMXHbs40XjPbs0pltlPx4UyxmNvK6Xi5r5ZULZR/hiEN9mG16UxLvMYEz2b/WTsdJ8=',
    applicationsKeys : [
        'a426a915-2f6f-406d-bdbf-1d1cd6f6fe2e',
        '9143d896-019d-4cd0-85f8-2bfefe3eafeb',
        '5f9a0d75-847d-488f-85cd-57581d9c0dc6',
    ],
};

export const createdUser: UserDto = {
    groups: [],
    following: [],
    uuid: 'c5b17623-9c6e-76f8-38e4-c32dc282fc63',
    createdDate: null,
    updateDate: null,
    enabled: true,
    preferedLang: 'fr-FR',
    username: 'sadmin-nouveaux',
    email: 'abc@abc.com',
    firstName: '',
    lastName: '',
    customerKey: 'nouveau',
    pictureUrl: 'https://',
    favorites: { documents: [], smartObjects: [] },
};