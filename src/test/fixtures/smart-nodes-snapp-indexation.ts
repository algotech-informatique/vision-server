import { SnApp, SnModel, SnPage, SnPageEvent, SnPageEventPipe, SnPageWidget, SnVersion } from '../../interfaces';

export const eventsPipes1: SnPageEventPipe[] = [
    {
        id: 'id',
        key: 'key1',
        type: 'type',
        action: 'action1',
        inputs: [],
        custom: {
            title: 'action1ticustomtle',
            columns: 'action1colucustommns',
            src: 'action1customsrc',
            collection: 'action1collectcustomion',
            collectionType: 'action1collectionTcustomype',
            propertyKey: 'action1propertycustomKey',
            propertyType: 'action1propertyTcustomype',
            value: 'action1vacustomlue',
        },
    },
    {
        id: 'id',
        key: 'key2',
        type: 'type',
        action: 'action2',
        inputs: [],
        custom: 'custom',
        smartflowResult: {
            type: 'so:machin',
            multiple: false,
        },        
    },
    {
        id: 'id',
        key: 'key3',
        type: 'type',
        action: 'action3',
        inputs: [],
        custom: 'custom',
        smartflowResult: {
            type: 'so:chose',
            multiple: true,
        }
    }
];

export const custom1 = {
    title: 'title1',
    columns: ['column1', 'column2'],
    src: 'src1',
    collection: 'collection1',
    collectionType: 'collectionType1',
    propertyKey: 'propertyKey1',
    propertyType: 'propertyType1',
    value: 'value',
};

export const custom2 = {
    title: 'title2',
    columns: [],
    src: 'src2',
    collection: 'collection2',
    collectionType: 'collectionType2',
    propertyKey: 'propertyKey2',
    propertyType: 'propertyType2',
    value: 1,
}

export const custom3 = {
    title: 'title3',
    src: 'src3',
    collection: 'collection3',
    collectionType: 'collectionType3',
    propertyKey: 'propertyKey3',
    propertyType: 'propertyType3',
    value: false,
};

export const pageEvent1: SnPageEvent = {
    id: 'id1',
    eventKey: 'event1',
    pipe: [
        {
            id: 'id',
            key: 'key1',
            type: 'workflow',
            action: 'action1',
            inputs: [],
            custom: 'custom',
        },
        {
            id: 'id',
            key: 'key2',
            type: 'smartflow',
            action: 'action2',
            inputs: [],
            custom: 'custom',
        },
        {
            id: 'id',
            key: 'key3',
            type: 'app',
            action: 'action3',
            inputs: [],
            custom: 'custom',
        },
        {
            id: 'id',
            key: 'key4',
            type: 'page::nav',
            action: 'action4',
            inputs: [],
            custom: 'custom',
        },
        {
            id: 'id',
            key: 'key5',
            type: 'call::onLoad',
            action: 'action5',
            inputs: [],
            custom: 'custom',
        },
        {
            id: 'id',
            key: 'key6',
            type: 'url',
            action: 'action6',
            inputs: [],
            custom: 'custom',
        }
    ]
};

export const emptyPipPageEvent: SnPageEvent = {
    id: 'id1',
    eventKey: 'event1',
    pipe: []
};

export const button: SnPageWidget = {
    id: 'f4c6cf3c-16e5-d064-7efb-03ba8b530bd8',
    typeKey: 'button',
    name: 'ButtonSolidPrimaryRound',
    isActive: false,
    css: {
        button: {
            'background-color': 'var(--ALGOTECH-PRIMARY)',
            'border-radius': '50px 50px 50px 50px',
            'box-shadow': 'unset',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        },
        text: {
            color: 'var(--ALGOTECH-PRIMARY-HOVER)',
            'font-size': '15px',
            'font-style': 'normal',
            'text-decoration': 'none',
            'font-weight': 'bold',
            padding: '0px 0px 0px 0px',
            margin: '0px 0px 0px 0px'
        },
        icon: {
            color: 'var(--ALGOTECH-PRIMARY-HOVER)',
            'font-size': '15px',
            padding: '0px 0px 0px 0px',
            margin: '10px 10px 10px 10px'
        },
        layout: {
            'flex-direction': 'row',
            'justify-content': 'center',
            'align-items': 'center'
        }
    },
    custom: {
        title: [
            {
                lang: 'fr-FR',
                value: 'Click'
            },
            {
                lang: 'en-US',
                value: 'Click'
            },
            {
                lang: 'es-ES',
                value: 'Click'
            }
        ],
        action: '',
        iterable: true,
        disabled: false,
        hidden: false,
    },
    box: {
        x: 130,
        y: 100,
        width: 160,
        height: 50
    },
    events: [
        {
            id: '597b2ca6-33c7-53a2-7361-8137f7275141',
            eventKey: 'onClick',
            pipe: [
                {
                    id: '212561f8-f70d-d6e6-27b4-9af5f0da3952',
                    type: 'page',
                    inputs: [
                        {
                            key: 'test',
                            value: null
                        }
                    ],
                    custom: null,
                    action: 'ea39e2a6-88cf-dad9-5411-65719fdf80ed'
                },
                {
                    id: '4396c100-383b-1350-7cb6-ac0599cc608b',
                    type: 'page::nav',
                    inputs: [],
                    custom: {
                        page: 'f3774431-caa3-3a29-bb3a-4202910ffaf0'
                    },
                    action: 'kosta_web'
                },
                {
                    id: 'b68b5500-bb28-29ae-af69-59d5ad614bfa',
                    type: 'smartflow',
                    inputs: [],
                    custom: null,
                    action: 'Vision-liste-des-contacts'
                },
                {
                    id: 'd989b24c-4632-d335-75b2-0f62355ecfcf',
                    type: 'workflow',
                    inputs: [],
                    custom: {
                        pair: [
                            {
                                profiles: [
                                    {
                                        uuid: '5138126f-4252-46f3-8a1d-03369b671d4f',
                                        groups: [
                                            'sadmin',
                                            'process-manager'
                                        ]
                                    }
                                ]
                            }
                        ],
                        savingMode: 'END',
                        unique: false
                    },
                    action: 'crud-signatures'
                },
                {
                    id: 'f564e476-ebc2-a7c5-9287-458cf4730758',
                    type: 'call::onLoad',
                    inputs: [],
                    custom: null,
                    action: 'b6b4451e-a90b-3649-406b-b1b5b6f4dddc'
                }
            ],
            custom: {
                mode: 'sequence'
            }
        }
    ],
    rules: [
        {
            id: '4064d179-48ec-6d1c-f205-627fc6ed464f',
            name: 'Nouvelle règle',
            color: '#664a8d',
            conditions: [
                {
                    input: '{{system.page-name}}',
                    criteria: 'startsWith',
                    value: 't'
                }
            ],
            operator: 'and',
            css: {},
            custom: {},
            events: []
        }
    ],
};

export const image: SnPageWidget = {
    id: '7dafede5-1788-7fe6-a17a-c77f43e0690e',
    typeKey: 'image',
    name: 'Image',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'box-shadow': 'unset'
        },
        image: {
            'border-radius': '0px 0px 0px 0px',
            'object-fit': 'unset',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        }
    },
    custom: {
        src: 'src1',
        iterable: true,
        disabled: false,
        hidden: false,
        locked: false,
        typeSrc: 'datasource',
        imageUuid: '',
        input: '{{variable.test}}',
        tag: 'da'
    },
    box: {
        x: 370,
        y: 60,
        width: 300,
        height: 300
    },
    events: [
        {
            id: '0ecab168-7277-045d-8e2d-2ad01ec57328',
            eventKey: 'onClick',
            pipe: [
                {
                    id: 'c883c02c-9f88-1c6c-9558-ac16af447738',
                    type: 'workflow',
                    inputs: [
                        {
                            key: 'smart-object-selected',
                            value: null
                        }
                    ],
                    custom: {
                        pair: [
                            {
                                profiles: [
                                    {
                                        uuid: '5138126f-4252-46f3-8a1d-03369b671d4f',
                                        groups: [
                                            'sadmin',
                                            'process-manager'
                                        ]
                                    }
                                ]
                            }
                        ],
                        savingMode: 'END',
                        unique: false
                    },
                    action: 'documents-de-l\'intervention'
                }
            ],
            custom: {
                mode: 'sequence'
            }
        }
    ],
    rules: [
        {
            id: 'bbb3d78a-8888-92ea-a815-5aae9550c31a',
            name: 'Nouvelle règle 1',
            color: '#664a8d',
            conditions: [
                {
                    input: '{{datasource.test}}',
                    criteria: 'notStartsWith',
                    value: 'dd'
                }
            ],
            operator: 'or',
            css: {},
            custom: {},
            events: []
        }
    ],
};

export const text: SnPageWidget = {
    id: 'd39f2bba-0a4f-d056-a749-db8c803b5fcc',
    typeKey: 'text',
    name: 'Title',
    isActive: false,
    css: {
        main: {
            'background-color': '#FFFFFF00',
            'border-radius': '4px 4px 4px 4px',
            'box-shadow': 'unset',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        },
        'text': {
            color: 'var(--ALGOTECH-TERTIARY)',
            'font-size': '30px',
            'justify-content': 'flex-start',
            'text-align': 'left',
            'font-style': 'normal',
            'text-decoration': 'none',
            'font-weight': 'bold',
            padding: '0px 5px 0px 5px',
            margin: '0px 0px 0px 0px'
        },
        layout: {
            'align-items': 'center'
        }
    },
    custom: {
        text: [
            {
                lang: 'fr-FR',
                value: 'Un joli titre {{current-list.item.TYPE-D\'INTERVENTION}}'
            },
            {
                lang: 'en-US',
                value: 'A nice title'
            },
            {
                lang: 'es-ES',
                value: 'Un título bonito'
            }
        ],
        iterable: true,
        disabled: false,
        hidden: false,
        locked: false
    },
    box: {
        x: 0,
        y: 0,
        width: 330,
        height: 75
    },
    events: [
        {
            id: 'ea4b8985-a76c-a778-8f90-ba9ed78b4b72',
            eventKey: 'onClick',
            pipe: [],
            custom: {
                mode: 'sequence'
            }
        }
    ],
    rules: [],
};

export const list: SnPageWidget = {
    id: '6c004860-8d96-9182-4a61-8691f77de696',
    typeKey: 'list',
    name: 'Liste',
    isActive: false,
    css: {
        main: {
            'background-color': '#FFFFFF00',
            'border-radius': '4px 4px 4px 4px',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        },
        layout: {
            gap: '5px'
        }
    },
    custom: {
        iterable: false,
        disabled: false,
        hidden: false,
        paginate: {
            limit: null,
            mode: 'infinite'
        },
        collection: '{{datasource.smart-object-selected}}',
        search: false,
        direction: 'column',
        scrollbar: true,
        locked: false
    },
    box: {
        x: 780,
        y: 90,
        height: 235,
        width: 330
    },
    events: [],
    rules: [],
    group: {
        widgets: [
            text
        ]
    }
}

export const tabs: SnPageWidget = {
    id: '01f8d0a5-ed22-ef13-54e8-506c8cf97d93',
    typeKey: 'tabs',
    name: 'TabSolid',
    isActive: false,
    css: {
        tabs: {
            'flex-direction': 'row',
            'justify-content': 'flex-start',
            gap: '0px'
        },
        main: {
            'background-color': 'var(--ALGOTECH-PRIMARY)',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none',
            'border-radius': '0px 0px 0px 0px',
            'box-shadow': '0px 2px 5px 0px #000000a6'
        }
    },
    custom: {
        iterable: true,
        hidden: false,
        selectedTabId: '65ab9fb2-d57a-f145-7752-1d98449084f1'
    },
    box: {
        x: 210,
        y: 470,
        width: 300,
        height: 50
    },
    events: [],
    rules: [],
    group: {
        widgets: [
            {
                id: '4c337316-e784-6b15-97bc-03eea899a79f',
                typeKey: 'tabModel',
                name: 'APP-WIDGET-TAB-MODEL',
                isActive: false,
                css: {
                    text: {
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        'font-size': '14px',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'font-style': 'normal',
                        'text-decoration': 'none',
                        'font-weight': 'normal'
                    },
                    main: {
                        'background-color': '#FFFFFF00',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none',
                        'border-radius': '0px 0px 0px 0px',
                        'box-shadow': 'unset'
                    },
                    icon: {
                        'flex-direction': 'row',
                        'font-size': '14px',
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        padding: '10px 10px 10px 10px',
                        margin: '0px 0px 0px 0px'
                    },
                    tab: {
                        'flex-direction': 'row',
                        'justify-content': 'flex-start',
                        'align-items': 'center'
                    }
                },
                custom: {
                    selected: false,
                    icon: 'fa-solid fa-columns'
                },
                box: {
                    x: 0,
                    y: 0,
                    height: 0,
                    width: 0
                },
                events: [],
                rules: [],
            },
            {
                id: '2998261d-012e-071e-8306-7c1f245ac8a3',
                typeKey: 'tabModel',
                name: 'APP-WIDGET-TAB-MODEL',
                isActive: false,
                css: {
                    text: {
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        'font-size': '14px',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'font-style': 'normal',
                        'text-decoration': 'none',
                        'font-weight': 'normal'
                    },
                    main: {
                        'background-color': 'var(--ALGOTECH-PRIMARY-TINT)',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none',
                        'border-radius': '0px 0px 0px 0px',
                        'box-shadow': 'unset'
                    },
                    icon: {
                        'flex-direction': 'row',
                        'font-size': '14px',
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        padding: '10px 10px 10px 10px',
                        margin: '0px 0px 0px 0px'
                    },
                    tab: {
                        'flex-direction': 'row',
                        'justify-content': 'flex-start',
                        'align-items': 'center'
                    }
                },
                custom: {
                    selected: true,
                    icon: 'fa-solid fa-columns'
                },
                box: {
                    x: 0,
                    y: 0,
                    height: 0,
                    width: 0
                },
                events: [],
                rules: [],
            },
            {
                id: 'b6b4451e-a90b-3649-406b-b1b5b6f4dddc',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {},
                custom: {
                    tabId: '65ab9fb2-d57a-f145-7752-1d98449084f1',
                    disabled: false,
                    icon: 'fa-solid fa-home',
                    text: [
                        {
                            lang: 'fr-FR',
                            value: 'Home'
                        },
                        {
                            lang: 'en-US',
                            value: 'Home'
                        },
                        {
                            lang: 'es-ES',
                            value: 'Home'
                        }
                    ],
                    page: '',
                    pageInputs: [],
                    iterable: false,
                    hidden: false,
                },
                box: {
                    x: 0,
                    y: 0,
                    height: 70,
                    width: 100
                },
                events: [
                    {
                        id: '9f947407-bc60-a7fb-4128-15c5b1e0f383',
                        eventKey: 'onClick',
                        pipe: [],
                        custom: {
                            mode: 'sequence'
                        }
                    }
                ],
                rules: [],
            },
            {
                id: 'd35a46db-a990-2fc2-612e-95cc49ca1324',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {},
                custom: {
                    tabId: 'ddb939a8-0fa0-e811-9f2b-e7331cb27329',
                    disabled: false,
                    icon: 'fa-solid fa-circle-info',
                    text: [
                        {
                            lang: 'fr-FR',
                            value: 'Info'
                        },
                        {
                            lang: 'en-US',
                            value: 'Info'
                        },
                        {
                            lang: 'es-ES',
                            value: 'Info'
                        }
                    ],
                    page: '',
                    pageInputs: [],
                    iterable: false,
                    hidden: false,
                },
                box: {
                    x: 0,
                    y: 0,
                    height: 70,
                    width: 100
                },
                events: [
                    {
                        id: '2df77533-d007-aed6-d5f7-68475bab4819',
                        eventKey: 'onClick',
                        pipe: [],
                        custom: {
                            mode: 'sequence'
                        }
                    }
                ],
                rules: [],
            },
            {
                id: '64af9c94-5218-7fb3-c826-a92ca93f6c98',
                typeKey: 'tab',
                name: 'toto',
                isActive: false,
                css: {},
                custom: {
                    tabId: '4098a84e-9ef9-ca9e-333b-ff86091238ac',
                    disabled: false,
                    icon: 'fa-solid fa-ellipsis-vertical',
                    text: [
                        {
                            lang: 'fr-FR',
                            value: 'More'
                        },
                        {
                            lang: 'en-US',
                            value: 'More'
                        },
                        {
                            lang: 'es-ES',
                            value: 'More'
                        }
                    ],
                    page: '',
                    pageInputs: [],
                    iterable: false,
                    hidden: false,
                },
                box: {
                    x: 0,
                    y: 0,
                    height: 70,
                    width: 100
                },
                events: [
                    {
                        id: '0a66042c-3cf9-010f-8827-9252baf39311',
                        eventKey: 'onClick',
                        pipe: [],
                        custom: {
                            mode: 'sequence'
                        }
                    }
                ],
                rules: [],
            }
        ]
    },
};

export const table: SnPageWidget = {
    id: '173f3068-cd42-7b4f-08c3-f706fdafff29',
    typeKey: 'table',
    name: 'Tableau',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'border-radius': '0px 0px 0px 0px',
            'border-top': '1px solid var(--ALGOTECH-BACKGROUND-SHADE)',
            'border-right': '1px solid var(--ALGOTECH-BACKGROUND-SHADE)',
            'border-bottom': '1px solid var(--ALGOTECH-BACKGROUND-SHADE)',
            'border-left': '1px solid var(--ALGOTECH-BACKGROUND-SHADE)'
        },
        cell: {
            color: 'var(--ALGOTECH-TERTIARY)',
            'font-size': '12px',
            'text-align': 'left',
            'font-style': 'normal',
            'text-decoration': 'none',
            'font-weight': 'normal',
            'justify-content': 'flex-start'
        },
        column: {
            width: '200px',
            'border-width': '0px',
            'border-color': 'var(--ALGOTECH-TERTIARY)'
        },
        row: {
            height: '40px',
            'border-width': '1px',
            'border - color': 'var(--ALGOTECH-BACKGROUND-SHADE)'
        },
        header: {
            color: 'var(--ALGOTECH-BACKGROUND)',
            'font-size': '12px',
            'text-align': 'left',
            'font-style': 'normal',
            'text-decoration': 'none',
            'font-weight': 'bold',
            'justify-content': 'flex-start',
            'background-color': 'var(--ALGOTECH-PRIMARY)',
            'border-bottom-width': '0px',
            'border-bottom-color': 'var(--ALGOTECH-TERTIARY)'
        }
    },
    returnData: [
        {
            key: 'smart-object-selected',
            multiple: false,
            type: 'so:actiavoiture',
            name: 'TABLE.SMART-OBJECT-SELECTED'
        },
        {
            key: 'smart-objects-selected',
            multiple: true,
            type: 'so:actiavoiture',
            name: 'TABLE.SMART-OBJECTS-SELECTED'
        }
    ],
    custom: {
        iterable: false,
        hidden: false,
        collection: '{{datasource.test}}',
        collectionType: 'so:actiavoiture',
        paginate: {
            limit: null,
            mode: 'infinite'
        },
        search: false,
        columns: [
            'DATE-DE-CREATION',
            'NOM',
            'NS'
        ],
        sort: true,
        filter: true,
        resize: true,
        reorder: false,
        multiselection: true,
        editable: true
    },
    box: {
        x: 550,
        y: 320,
        width: 940,
        height: 400
    },
    events: [
        {
            id: '57eb342c-37bb-d147-0e11-29654294d1a1',
            eventKey: 'onRowClick',
            pipe: [],
            custom: {
                mode: 'sequence'
            }
        },
        {
            id: '94e8e565-e950-e1cb-a7aa-17767eb23535',
            eventKey: 'onRowDblClick',
            pipe: [],
            custom: {
                mode: 'sequence'
            }
        },
        {
            id: 'ab899ba1-afb0-6795-bf56-32cd92624049',
            eventKey: 'onRowSelection',
            pipe: [],
            custom: {
                mode: 'list'
            }
        }
    ],
    rules: [],
    group: {
        widgets: [
            {
                id: '03b9899f-3f14-a3ac-bbad-cf97485411a1',
                typeKey: 'column',
                name: 'NS-44',
                isActive: false,
                css: {
                    main: {
                        'background-color': '#FFFFFF00',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none'
                    },
                    cell: {
                        color: 'var(--ALGOTECH-TERTIARY)',
                        'font-size': '12px',
                        'text-align': 'left',
                        'font-style': 'normal',
                        'text-decoration': 'none',
                        'font-weight': 'normal',
                        'justify-content': 'flex-start'
                    }
                },
                custom: {
                    iterable: false,
                    hidden: false,
                    propertyKey: 'NS',
                    propertyType: 'number',
                    filter: true,
                    resize: true,
                    sort: true,
                    display: [
                        'text'
                    ],
                    format: {
                        key: 'decimal'
                    },
                    icon: '',
                    overloadStyle: false,
                    formatted: true,
                    value: '{{current-list.item.NS}}'
                },
                box: {
                    x: 0,
                    y: 0,
                    height: 400,
                    width: 200
                },
                events: [
                    {
                        id: 'a6a83aa3-5356-5831-a7d6-8cf0add7c5d1',
                        eventKey: 'onCellClick',
                        pipe: [
                            {
                                id: 'd171500f-2b79-8692-ac77-a92e125f6e51',
                                type: 'workflow',
                                inputs: [
                                    {
                                        key: 'smart-object-selected',
                                        value: '{{variable.test}}'
                                    }
                                ],
                                custom: {
                                    pair: [
                                        {
                                            profiles: [
                                                {
                                                    uuid: '5138126f-4252-46f3-8a1d-03369b671d4f',
                                                    groups: [
                                                        'admin',
                                                        'doc',
                                                        'plan-editor'
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    savingMode: 'END',
                                    unique: false
                                },
                                action: 'details-du-bilan'
                            },
                            {
                                id: 'b1d4ab04-9b6f-6ed5-1193-85f4b7fd7647',
                                type: 'smartflow',
                                inputs: [],
                                action: 'liste-users',
                                custom: null
                            }
                        ],
                        custom: {
                            mode: 'sequence'
                        }
                    },
                    {
                        id: 'd6fb8fd9-73c8-7351-d18b-1a952e2c1a71',
                        eventKey: 'onCellDblClick',
                        pipe: [
                            {
                                id: 'd61fc5f3-a71f-fc38-4890-de946adbf3cc',
                                type: 'url',
                                inputs: [],
                                action: 'test',
                                custom: null
                            },
                            {
                                id: 'a94055c4-76f2-7c1b-8d00-e662c567f717',
                                type: 'page',
                                inputs: [],
                                custom: null,
                                action: '1dc53da9-5815-9dd8-0bf2-50b41d168ba6'
                            }
                        ],
                        custom: {
                            mode: 'sequence'
                        }
                    }
                ],
                rules: [],
            }
        ]
    }
}

export const deepWidget: SnPageWidget = {
    id: 'deepWidgetId',
    typeKey: 'deepWidget',
    name: 'widget niveau 1',
    isActive: false,
    css: {
    },
    custom: {
        iterable: false,
        hidden: false,
        collection: '{{datasource.test}}',
        collectionType: 'so:actiavoiture',
        paginate: {
            limit: null,
            mode: 'infinite'
        },
        search: false,
        columns: [
            'DATE-DE-CREATION',
            'NOM',
            'NS'
        ],
        sort: true,
        filter: true,
        resize: true,
        reorder: false,
        multiselection: true,
        editable: true
    },
    box: {
        x: 550,
        y: 320,
        width: 940,
        height: 400
    },
    events: [
        {
            id: '57eb342c-37bb-d147-0e11-29654294d1a1',
            eventKey: 'onRowClick',
            pipe: [],
            custom: {
                mode: 'sequence'
            }
        },
        {
            id: '94e8e565-e950-e1cb-a7aa-17767eb23535',
            eventKey: 'onRowDblClick',
            pipe: [],
            custom: {
                mode: 'sequence'
            }
        },
        {
            id: 'ab899ba1-afb0-6795-bf56-32cd92624049',
            eventKey: 'onRowSelection',
            pipe: [],
            custom: {
                mode: 'list'
            }
        }
    ],
    rules: [],
    group: {
        widgets: [
            {
                id: 'deepWidgetId',
                typeKey: 'deepWidget',
                name: 'widget niveau 2',
                isActive: false,
                css: {
                },
                custom: {
                    iterable: false,
                    hidden: false,
                    text: [
                        {
                            lang: 'fr-FR',
                            value: 'text wideget niveau 2'
                        },
                        {
                            lang: 'en-US',
                            value: 'wideget 2nd level'
                        },
                    ],
                    sort: true,
                    filter: true,
                    resize: true,
                    reorder: false,
                    multiselection: true,
                    editable: true
                },
                box: {
                    x: 550,
                    y: 320,
                    width: 940,
                    height: 400
                },
                events: [
                    {
                        id: '57eb342c-37bb-d147-0e11-29654294d1a1',
                        eventKey: 'onRowClick',
                        pipe: [
                            {
                                id: 'b68b5500-bb28-29ae-af69-59d5ad614bfa',
                                type: 'smartflow',
                                inputs: [],
                                custom: null,
                                action: 'Vision-liste-des-contacts'
                            },
                            {
                                id: 'd989b24c-4632-d335-75b2-0f62355ecfcf',
                                type: 'workflow',
                                inputs: [],
                                custom: {
                                    pair: [
                                        {
                                            profiles: [
                                                {
                                                    uuid: '5138126f-4252-46f3-8a1d-03369b671d4f',
                                                    groups: [
                                                        'sadmin',
                                                        'process-manager'
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    savingMode: 'END',
                                    unique: false
                                },
                                action: 'crud-signatures'
                            },
                        ],
                        custom: {
                            mode: 'sequence'
                        }
                    },
                    {
                        id: '94e8e565-e950-e1cb-a7aa-17767eb23535',
                        eventKey: 'onRowDblClick',
                        pipe: [],
                        custom: {
                            mode: 'sequence'
                        }
                    },
                    {
                        id: 'ab899ba1-afb0-6795-bf56-32cd92624049',
                        eventKey: 'onRowSelection',
                        pipe: [],
                        custom: {
                            mode: 'list'
                        }
                    }
                ],
                rules: [],
                group: {
                    widgets: [
                        {
                            id: 'deepWidgetId',
                            typeKey: 'deepWidget',
                            name: 'widget niveau 3.1',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                iterable: false,
                                hidden: false,
                                text: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'text wideget niveau 3.1'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'wideget 3.1nd level'
                                    },
                                ],
                                sort: true,
                                filter: true,
                                resize: true,
                                reorder: false,
                                multiselection: true,
                                editable: true
                            },
                            box: {
                                x: 550,
                                y: 320,
                                width: 940,
                                height: 400
                            },
                            events: [
                                {
                                    id: '57eb342c-37bb-d147-0e11-29654294d1a1',
                                    eventKey: 'onRowClick',
                                    pipe: [
                                        {
                                            id: 'b68b5500-bb28-29ae-af69-59d5ad614bfa',
                                            type: 'smartflow',
                                            inputs: [],
                                            custom: null,
                                            action: '3rdlevelsmartflow'
                                        },
                                    ],
                                    custom: {
                                        mode: 'sequence'
                                    }
                                },
                                {
                                    id: '94e8e565-e950-e1cb-a7aa-17767eb23535',
                                    eventKey: 'onRowDblClick',
                                    pipe: [],
                                    custom: {
                                        mode: 'sequence'
                                    }
                                },
                                {
                                    id: 'ab899ba1-afb0-6795-bf56-32cd92624049',
                                    eventKey: 'onRowSelection',
                                    pipe: [],
                                    custom: {
                                        mode: 'list'
                                    }
                                }
                            ],
                            rules: [],
                            group: {
                                widgets: [

                                ]
                            }
                        },
                        {
                            id: 'deepWidgetId',
                            typeKey: 'deepWidget',
                            name: 'widget niveau 3.2',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                iterable: false,
                                hidden: false,
                                text: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'text wideget niveau 3.2'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'wideget 3.2nd level'
                                    },
                                ],
                                sort: true,
                                filter: true,
                                resize: true,
                                reorder: false,
                                multiselection: true,
                                editable: true
                            },
                            box: {
                                x: 550,
                                y: 320,
                                width: 940,
                                height: 400
                            },
                            events: [
                                {
                                    id: '57eb342c-37bb-d147-0e11-29654294d1a1',
                                    eventKey: 'onRowClick',
                                    pipe: [
                                    ],
                                    custom: {
                                        mode: 'sequence'
                                    }
                                },
                                {
                                    id: '94e8e565-e950-e1cb-a7aa-17767eb23535',
                                    eventKey: 'onRowDblClick',
                                    pipe: [],
                                    custom: {
                                        mode: 'sequence'
                                    }
                                },
                                {
                                    id: 'ab899ba1-afb0-6795-bf56-32cd92624049',
                                    eventKey: 'onRowSelection',
                                    pipe: [],
                                    custom: {
                                        mode: 'list'
                                    }
                                }
                            ],
                            rules: [],
                            group: {
                                widgets: [
                                    {
                                        id: 'deepWidgetId',
                                        typeKey: 'deepWidget',
                                        name: 'widget niveau 4',
                                        isActive: false,
                                        css: {
                                        },
                                        custom: {
                                            iterable: false,
                                            hidden: false,
                                            text: [
                                                {
                                                    lang: 'fr-FR',
                                                    value: 'text wideget niveau 4'
                                                },
                                                {
                                                    lang: 'en-US',
                                                    value: 'wideget 4nd level'
                                                },
                                            ],
                                            sort: true,
                                            filter: true,
                                            resize: true,
                                            reorder: false,
                                            multiselection: true,
                                            editable: true
                                        },
                                        box: {
                                            x: 550,
                                            y: 320,
                                            width: 940,
                                            height: 400
                                        },
                                        events: [
                                            {
                                                id: '57eb342c-37bb-d147-0e11-29654294d1a1',
                                                eventKey: 'onRowClick',
                                                pipe: [
                                                    {
                                                        id: 'b68b5500-bb28-29ae-af69-59d5ad614bfa',
                                                        type: 'smartflow',
                                                        inputs: [],
                                                        custom: null,
                                                        action: '4thlevelsmartflow'
                                                    },
                                                ],
                                                custom: {
                                                    mode: 'sequence'
                                                }
                                            },
                                            {
                                                id: '94e8e565-e950-e1cb-a7aa-17767eb23535',
                                                eventKey: 'onRowDblClick',
                                                pipe: [],
                                                custom: {
                                                    mode: 'sequence'
                                                }
                                            },
                                            {
                                                id: 'ab899ba1-afb0-6795-bf56-32cd92624049',
                                                eventKey: 'onRowSelection',
                                                pipe: [],
                                                custom: {
                                                    mode: 'list'
                                                }
                                            }
                                        ],
                                        rules: [],
                                        group: {
                                            widgets: [

                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }

        ]
    }
}
export const page1: SnPage = {
    id: 'ea39e2a6-88cf-dad9-5411-65719fdf80ed',
    canvas: {
        x: 0,
        y: 0
    },
    css: {
        'background-color': 'var(--ALGOTECH-BACKGROUND)'
    },
    pageHeight: 1080,
    pageWidth: 1920,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'test liens'
        },
        {
            lang: 'en-US',
            value: ''
        },
        {
            lang: 'es-ES',
            value: ''
        }
    ],
    variables: [
        {
            uuid: 'a43f0472-2699-5a7c-6da7-18d82394df76',
            key: 'test',
            type: 'so:*',
            multiple: false
        }
    ],
    dataSources: [
        {
            id: 'b5b8ace9-7ca5-9ff9-5f4a-993a08eaa1e6',
            type: 'smartobjects',
            inputs: [],
            action: 'demande-d\'intervention',
            key: 'smart-object-selected'
        },
        {
            id: 'af6e802c-bf4c-b063-8522-b8012cf654d2',
            type: 'smartflow',
            inputs: [],
            key: 'test',
            action: 'liste-des-demandes-d\'interventions'
        }
    ],
    widgets: [
        button,
        image,
        list,
        table,
        tabs
    ],
    events: [
        {
            eventKey: 'onLoad',
            id: '5fd15d7f-a2a1-274f-4d9e-a89ccb14748d',
            pipe: [
                {
                    id: 'd171500f-2b79-8692-ac77-a92e125f6e51',
                    type: 'workflow',
                    inputs: [
                        {
                            key: 'smart-object-selected',
                            value: '{{variable.test}}'
                        }
                    ],
                    custom: {
                        pair: [
                            {
                                profiles: [
                                    {
                                        uuid: '5138126f-4252-46f3-8a1d-03369b671d4f',
                                        groups: [
                                            'admin',
                                            'doc',
                                            'plan-editor'
                                        ]
                                    }
                                ]
                            }
                        ],
                        savingMode: 'END',
                        unique: false
                    },
                    action: 'details-du-bilan'
                },
                {
                    id: 'b1d4ab04-9b6f-6ed5-1193-85f4b7fd7647',
                    type: 'smartflow',
                    inputs: [],
                    action: 'liste-users',
                    custom: null
                },
                {
                    id: 'd61fc5f3-a71f-fc38-4890-de946adbf3cc',
                    type: 'url',
                    inputs: [],
                    action: 'test',
                    custom: null
                },
                {
                    id: 'a94055c4-76f2-7c1b-8d00-e662c567f717',
                    type: 'page',
                    inputs: [],
                    custom: null,
                    action: '1dc53da9-5815-9dd8-0bf2-50b41d168ba6'
                }
            ]
        }
    ],
    main: true,
    custom: {}
};

export const page2: SnPage = {
    id: '1dc53da9-5815-9dd8-0bf2-50b41d168ba6',
    canvas: {
        x: 1970,
        y: 0
    },
    css: {
        'background-color': 'var(--ALGOTECH-BACKGROUND)'
    },
    pageWidth: 1920,
    pageHeight: 1080,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'ttt'
        },
        {
            lang: 'en-US',
            value: ''
        },
        {
            lang: 'es-ES',
            value: ''
        }
    ],
    dataSources: [],
    variables: [],
    widgets: [
        deepWidget
    ],
    events: [
        {
            id: '3361500d-e7a1-e191-9fb4-25a853b30f9a',
            eventKey: 'onLoad',
            pipe: []
        }
    ],
    custom: {}
};


export const app: SnApp = {
    id: 'a5de6a64-eb79-f273-b080-698cd74c628d',
    environment: 'web',
    icon: 'fa-solid fa-check',
    securityGroups: [],
    pageHeight: 1080,
    pageWidth: 1920,
    pages: [page1, page2],
    drawing: {
        lines: [],
        elements: []
    },
    theme: {
        themeKey: 'light',
        customColors: [
            {
                key: 'BACKGROUND',
                value: '#ffffff'
            },
            {
                key: 'PRIMARY',
                value: '#455d7a'
            },
            {
                key: 'SECONDARY',
                value: '#404553'
            },
            {
                key: 'TERTIARY',
                value: '#222428'
            },
            {
                key: 'SUCCESS',
                value: '#9551ae'
            },
            {
                key: 'WARNING',
                value: '#e17a40'
            },
            {
                key: 'DANGER',
                value: '#d33939'
            }
        ]
    },
};

export const version1: SnVersion = {
    uuid: 'e9950e6b-4891-f390-25b9-b29f1fb96e4a',
    createdDate: '2023-06-19T17:33:47+02:00',
    creatorUuid: '08bf1d8c-2cba-4394-a9a2-0d506643a1fd',
    deleted: false,
    view: app,
    updatedDate: '2023-06-30T09:22:06.084Z'
};



export const appModel: SnModel = {
    uuid: 'Modeluuid',
    customerKey: 'customerKey',
    deleted: false,
    createdDate: '12/12/2012',
    updateDate: '12/12/2012',
    key: 'model1',
    displayName: [{
        lang: 'fr',
        value: 'frModel1'
    },
    {
        lang: 'es',
        value: 'esModel1'
    }],
    type: '',
    versions: [version1],
};

export const buttonToIndex = {
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: button.id,
    updateDate: appModel.updateDate,
    displayName: button.name,
    connectedTo: [
        'page:ea39e2a6-88cf-dad9-5411-65719fdf80ed',
        'app:kosta_web',
        'sf:Vision-liste-des-contacts',
        'wf:crud-signatures',
        'call::onLoad:b6b4451e-a90b-3649-406b-b1b5b6f4dddc'
    ],
    texts: '¤ButtonSolidPrimaryRound¤kosta_web¤Vision-liste-des-contacts¤crud-signatures¤Click¤Click¤Click¤startsWith¤{{system.page-name}}¤t¤',
    type: 'widget'
}

export const imageToIndex = {
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: image.id,
    updateDate: appModel.updateDate,
    displayName: image.name,
    connectedTo: ['wf:documents-de-l\'intervention'],
    texts: '¤Image¤documents-de-l\'intervention¤src1¤da¤notStartsWith¤{{datasource.test}}¤dd¤',
    type: 'widget'
}

export const textToIndex = {
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: text.id,
    updateDate: appModel.updateDate,
    displayName: text.name,
    connectedTo: [],
    texts: '¤Title¤Un joli titre {{current-list.item.TYPE-D\'INTERVENTION}}¤A nice title¤Un título bonito¤',
    type: 'widget'
}

export const listToIndex = {
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: list.id,
    updateDate: appModel.updateDate,
    displayName: list.name,
    connectedTo: [],
    texts: '¤Liste¤{{datasource.smart-object-selected}}¤',
    type: 'widget'
}

export const tabsToIndex = {
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: tabs.id,
    updateDate: appModel.updateDate,
    displayName: tabs.name,
    connectedTo: [],
    texts: '¤TabSolid¤',
    type: 'widget'
}

export const tabHomeToIndex = {
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: 'b6b4451e-a90b-3649-406b-b1b5b6f4dddc',
    updateDate: appModel.updateDate,
    displayName: 'Onglet',
    connectedTo: [],
    texts: '¤Onglet¤Home¤Home¤Home¤',
    type: 'widget'
}

export const tabInfosToIndex = {
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: 'd35a46db-a990-2fc2-612e-95cc49ca1324',
    updateDate: appModel.updateDate,
    displayName: 'Onglet',
    connectedTo: [],
    texts: '¤Onglet¤Info¤Info¤Info¤',
    type: 'widget'
}

export const tabMoreToIndex = {
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: '64af9c94-5218-7fb3-c826-a92ca93f6c98',
    updateDate: appModel.updateDate,
    displayName: 'toto',
    connectedTo: [],
    texts: '¤toto¤More¤More¤More¤',
    type: 'widget'
}

export const tableToIndex = {
    connectedTo: [],
    displayName: 'Tableau',
    elementUuid: table.id,
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    texts: '¤Tableau¤DATE-DE-CREATION¤NOM¤NS¤{{datasource.test}}¤so:actiavoiture¤',
    type: 'widget',
    updateDate: appModel.updateDate,
}

export const tableColumn1ToIndex = {
    connectedTo: [
        'wf:details-du-bilan',
        'sf:liste-users',
        'url:test',
        'page:1dc53da9-5815-9dd8-0bf2-50b41d168ba6',

    ],
    displayName: 'NS-44',
    elementUuid: '03b9899f-3f14-a3ac-bbad-cf97485411a1',
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    texts: '¤NS-44¤details-du-bilan¤liste-users¤test¤NS¤number¤{{current-list.item.NS}}¤',
    type: 'widget',
    updateDate: appModel.updateDate,
}


export const page1ToIndex = {
    connectedTo: [
        'so:demande-d\'intervention',
        'sf:liste-des-demandes-d\'interventions',
        'wf:details-du-bilan',
        'sf:liste-users',
        'url:test',
        'page:1dc53da9-5815-9dd8-0bf2-50b41d168ba6',
    ],
    displayName: [
        {
            lang: 'fr-FR',
            value: 'test liens',
        },
        {
            lang: 'en-US',
            value: '',
        },
        {
            lang: 'es-ES',
            value: '',
        },
    ],
    elementUuid: page1.id,
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    texts: '¤test liens¤test¤so:*¤smart-object-selected¤demande-d\'intervention¤test¤liste-des-demandes-d\'interventions¤details-du-bilan¤liste-users¤test¤',
    type: 'page',
    updateDate: appModel.updateDate,
}


export const deepWidgetToIndex = {
    updateDate: appModel.updateDate,
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: deepWidget.id,
    displayName: deepWidget.name,
    connectedTo: [],
    texts: '¤widget niveau 1¤DATE-DE-CREATION¤NOM¤NS¤{{datasource.test}}¤so:actiavoiture¤',
    type: 'widget'
};

export const deepWidget2ToIndex = {
    updateDate: appModel.updateDate,
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: 'deepWidgetId',
    displayName: 'widget niveau 2',
    connectedTo: ['sf:Vision-liste-des-contacts', 'wf:crud-signatures'],
    texts: '¤widget niveau 2¤Vision-liste-des-contacts¤crud-signatures¤text wideget niveau 2¤wideget 2nd level¤',
    type: 'widget'
};

export const deepWidget31ToIndex = {
    updateDate: appModel.updateDate,
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: 'deepWidgetId',
    displayName: 'widget niveau 3.1',
    connectedTo: ['sf:3rdlevelsmartflow'],
    texts: '¤widget niveau 3.1¤3rdlevelsmartflow¤text wideget niveau 3.1¤wideget 3.1nd level¤',
    type: 'widget'
};

export const deepWidget32ToIndex = {
    updateDate: appModel.updateDate,
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: 'deepWidgetId',
    displayName: 'widget niveau 3.2',
    connectedTo: [],
    texts: '¤widget niveau 3.2¤text wideget niveau 3.2¤wideget 3.2nd level¤',
    type: 'widget'
};

export const deepWidget4ToIndex = {
    updateDate: appModel.updateDate,
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: 'deepWidgetId',
    displayName: 'widget niveau 4',
    connectedTo: ['sf:4thlevelsmartflow'],
    texts: '¤widget niveau 4¤4thlevelsmartflow¤text wideget niveau 4¤wideget 4nd level¤',
    type: 'widget'
};

export const page2ToIndex = {
    updateDate: appModel.updateDate,
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: page2.id,
    displayName: page2.displayName,
    connectedTo: [],
    texts: '¤ttt¤',
    type: 'page'
}

export const appToIndex = {
    updateDate: appModel.updateDate,
    key: appModel.key,
    snModelUuid: appModel.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: '',
    displayName: appModel.displayName,
    connectedTo: [],
    texts: '¤model1¤frModel1¤esModel1¤',
    type: 'app'
  }