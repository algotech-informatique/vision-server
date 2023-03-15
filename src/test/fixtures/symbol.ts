import { SymboleDto } from '@algotech/core';

export const symbole1: SymboleDto = {
    uuid: '7aa15b86-3ff5-11e9-b210-d663bd873d93',
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
    symboles: [
        {
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
    anchor: {
        x: 100,
        y: 100,
    },
    drawing: 'drawing',
};

export const symbole2: SymboleDto = {
    uuid: '8ea113f8-4499-11e9-b210-d663bd873d93',
    key: 'symbol-key2',
    displayName: [
        {
            lang: 'en-US',
            value: 'Symbol 2',
        },
        {
            lang: 'fr-FR',
            value: 'Symbole 2',
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
    symboles: [
        {
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
    anchor: {
        x: 100,
        y: 100,
    },
    drawing: 'drawing',
};

export const createSymbole: SymboleDto = {
    key: 'symbol-keys',
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
    symboles: [
        {
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
            transform: 'sedg',
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
    anchor: {
        x: 100,
        y: 100,
    },
    drawing: 'drawing',
};

export const createWrongSymboleKeyMissing = {
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
    symboles: [
        {
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
            transform: 'sedg',
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
    anchor: {
        x: 100,
        y: 100,
    },
    drawing: 'drawing',
};

export const createWrongSymboleDateMissing = {
    key: 'symbol-keys',
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
    symboles: [
        {
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
            transform: 'sedg',
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
    anchor: {
        x: 100,
        y: 100,
    },
    drawing: 'drawing',
};