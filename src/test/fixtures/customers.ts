import { CustomerDto, PatchPropertyDto } from '@algotech/core';

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

export let createCustomer: CustomerDto = {
    uuid: '17238b5e-9314-43bd-a733-6df75f08fcab',
    customerKey: 'test-customer',
    name: 'Test Customer',
    logoUrl: 'fake-url:test-customer',
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
    licenceKey: 'U2FsdGVkX19Qi4u1tBzPDXXkaju+hOJeU1qjn/MeUZA1Hbs40XjPbs0pltlPx4UyxmNvK6Xi5r5ZUAAR/hiEN9m77A6UxLvMYEz2b/WTsdJ8=',
    applicationsKeys: [
        '5f9a0d75-847d-488f-85cd-57581d9c0dc6',
    ],
};

export let updateCustomer: CustomerDto = {
    uuid: '17238b5e-9314-43bd-a733-6df75f08fcab',
    customerKey: 'test-customer',
    name: 'Test Customer',
    logoUrl: 'fake-url:test-customer',
    languages: [
        {
            lang: 'fr-FR',
            value: 'Français',
        },
    ],
    licenceKey: 'U2FsdGVkX19Qi4u1tBzPDXXkaju+hOJeU1qjn/MeUZA1Hbs40XjPbs0pltlPx4UyxmNvK6Xi5r5ZUAAR/hiEN9m77A6UxLvMYEz2b/WTsdJ8=',
    applicationsKeys: [
        '5f9a0d75-847d-488f-85cd-57581d9c0dc6',
        '9143d896-019d-4cd0-85f8-2bfefe3eafeb',
    ],
};

export const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/name',
    value: 'Test customer (patch)',
};