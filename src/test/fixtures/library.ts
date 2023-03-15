import { LibraryDto } from '@algotech/core';

export const library1: LibraryDto = {
    uuid: 'ea72651e-3ff4-11e9-b210-d663bd873d93',
    name: 'norm-name',
    symboles: [
        {
            uuid: 'bdf0551e-3f36-11e9-b210-d663bd873d93',
            key: 'symbol-key',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Symbol',
                },
                {
                    lang: 'fr-FR',
                    value: 'Symbole',
                },
            ],
            date: '2019-03-04T13:18:31',
            defaultDrawingBehavior: 'break',
            defaultPosition: {
                x: 100,
                y: 100,
            },
            connections: [
                {
                    x: 100,
                    y: 100,
                },
            ],
            nomenclature: 'Une nomenclature',
            transform: 'transform',
            parameters: [
                {
                    key: 'parameter-key',
                    templateHTML: '<html></html>',
                    value: 'Tetess',
                    defaultValue: 'Test',
                    hidden: false,
                    position: {
                        x: 100,
                        y: 100,
                    },
                    angle: 12,
                    transform: 'string',
                    type: 'array',
                },
            ],
        },
    ],
};

export const library2: LibraryDto = {
    uuid: 'b89b1168-4499-11e9-b210-d663bd873d93',
    name: 'norm-name2',
    symboles: [
        {
            uuid: 'bdf0551e-3f36-11e9-b210-d663bd873d93',
            key: 'symbol-key',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Symbol Norme2',
                },
                {
                    lang: 'fr-FR',
                    value: 'Symbole Norme2',
                },
            ],
            date: '2019-03-04T13:18:31+00:00',
            defaultDrawingBehavior: 'break',
            defaultPosition: {
                x: 100,
                y: 100,
            },
            connections: [
                {
                    x: 100,
                    y: 100,
                },
            ],
            nomenclature: 'Une nomenclature',
            transform: '',
            parameters: [
                {
                    key: 'parameter-key',
                    templateHTML: '<html></html>',
                    value: 'Tetess',
                    defaultValue: 'Test',
                    hidden: false,
                    position: {
                        x: 100,
                        y: 100,
                    },
                    angle: 12,
                    transform: 'string',
                    type: 'array',
                },
            ],
        },
    ],
};

export const createLibrary: LibraryDto = {
    uuid: '54eb500e-44d7-11e9-b210-d663bd873d93',
    name: 'norm-name3',
    symboles: [
        {
            uuid: '5a84af1a-44d7-11e9-b210-d663bd873d93',
            key: 'symbol-key',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Symbol Norme3',
                },
                {
                    lang: 'fr-FR',
                    value: 'Symbole Norme3',
                },
            ],
            date: '2019-03-04T13:18:31',
            defaultDrawingBehavior: 'break',
            defaultPosition: {
                x: 100,
                y: 100,
            },
            connections: [
                {
                    x: 100,
                    y: 100,
                },
            ],
            nomenclature: 'Une nomenclature',
            transform: 'transform',
            parameters: [
                {
                    key: 'parameter-key',
                    templateHTML: '<html></html>',
                    value: 'Tetess',
                    defaultValue: 'Test',
                    hidden: false,
                    position: {
                        x: 100,
                        y: 100,
                    },
                    angle: 12,
                    transform: 'string',
                    type: 'array',
                },
            ],
        },
    ],
};

export const createWrongLibraryMissingName = {
    uuid: 'b89b1168-4499-11e9-b210-d663bd873d93',
    symboles: [
        {
            uuid: 'bdf0551e-3f36-11e9-b210-d663bd873d93',
            key: 'symbol-key',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Symbol Norme2',
                },
                {
                    lang: 'fr-FR',
                    value: 'Symbole Norme2',
                },
            ],
            date: '2019-03-04T13:18:31+00:00',
            defaultDrawingBehavior: 'break',
            defaultPosition: {
                x: 100,
                y: 100,
            },
            connections: [
                {
                    x: 100,
                    y: 100,
                },
            ],
            nomenclature: 'Une nomenclature',
            transform: '',
            parameters: [
                {
                    key: 'parameter-key',
                    templateHTML: '<html></html>',
                    value: 'Tetess',
                    defaultValue: 'Test',
                    hidden: false,
                    position: {
                        x: 100,
                        y: 100,
                    },
                    angle: 12,
                    transform: 'string',
                    type: 'array',
                },
            ],
        },
    ],
};

export const createWrongLibraryEmptyName: LibraryDto = {
    uuid: 'b89b1168-4499-11e9-b210-d663bd873d93',
    name: '',
    symboles: [
        {
            uuid: 'bdf0551e-3f36-11e9-b210-d663bd873d93',
            key: 'symbol-key',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Symbol Norme2',
                },
                {
                    lang: 'fr-FR',
                    value: 'Symbole Norme2',
                },
            ],
            date: '2019-03-04T13:18:31+00:00',
            defaultDrawingBehavior: 'break',
            defaultPosition: {
                x: 100,
                y: 100,
            },
            connections: [
                {
                    x: 100,
                    y: 100,
                },
            ],
            nomenclature: 'Une nomenclature',
            transform: '',
            parameters: [
                {
                    key: 'parameter-key',
                    templateHTML: '<html></html>',
                    value: 'Tetess',
                    defaultValue: 'Test',
                    hidden: false,
                    position: {
                        x: 100,
                        y: 100,
                    },
                    angle: 12,
                    transform: 'string',
                    type: 'array',
                },
            ],
        },
    ],
};