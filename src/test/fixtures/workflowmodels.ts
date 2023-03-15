import { WorkflowModelDto } from '@algotech/core';


export const workflowModel1: WorkflowModelDto = {
    tags: [],
    uuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
    key: 'create-document',
    snModelUuid: '66131b59-ebc8-4f31-ab1c-1134f1caf967',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Créer un document',
        },
        {
            lang: 'en-US',
            value: 'Create a document',
        },
    ],
    description: [
        {
            lang: 'fr-FR',
            value: 'sur equipement géolocalisé',
        },
        {
            lang: 'en-US',
            value: 'on geolocalised equipment',
        },
    ],
    iconName: 'far fa-map',
    variables: [],
    parameters: [],
    profiles: [
        {
            uuid: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
            name: 'Emitter',
            color: '#EB6317',
        },
        {
            uuid: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
            name: 'Reviewers',
            color: '#2D9CDB',
        },
    ],
    steps: [
        {
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Proposition de document',
                },
                {
                    lang: 'en-US',
                    value: 'Document submission',
                },
            ],
            tasks: [
                {
                    uuid: '6b443bbe-1b2d-11e9-ab14-d663bd873d93',
                    key: 'equipement-selection',
                    type: 'TaskList',
                    position: {
                        x: 100,
                        y: 74.17024230957031,
                    },
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Selection d un equipement',
                            },
                            {
                                lang: 'en-US',
                                value: 'Equipment selection',
                            },
                        ],
                        iconName: 'far fa-list',
                        profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    },
                    properties: {
                        services: [
                            {
                                header: [],
                                params: [
                                    {
                                        key: 'modelKey',
                                        type: 'url-segment',
                                        value: 'EQUIPMENT',
                                    },
                                ],
                                mappedParams: [],
                                uuid: '9af07f9f-5d30-4b4f-b677-ea867b3e93bc',
                                key: 'get-smart-objects-by-model',
                                type: 'GET',
                                cache: true,
                                execute: 'start',
                                api: 'algotech',
                                route: '{{SERVER}}/smart-objects/model/{{modelKey}}',
                                return: {
                                    multiple: true,
                                    type: 'so:equipment',
                                },
                            },
                        ],
                        transitions: [
                            {
                                displayName: [],
                                data: [
                                    {
                                        uuid: 'c04736fb-d958-de05-64d7-b732a37f4c9c',
                                        key: 'equipment',
                                        multiple: false,
                                        type: 'so:equipment',
                                        placeToSave: [],
                                    },
                                ],
                                uuid: 'd2275d14-9342-14a9-c9fb-50029e80e141',
                                key: 'select',
                                position: {
                                    x: 64,
                                    y: 32,
                                },
                                task: 'e7d81563-6adb-a84a-4d1a-31295dd55205',
                            },
                        ],
                        custom: {
                            columnsDisplay: [
                                'NAME',
                            ],
                            multipleSelection: false,
                            items: ['{{get-smart-objects-by-model}}'],
                        },
                        expressions: [],
                    },
                },
                {
                    uuid: '793461b8-1b2d-11e9-ab14-d663bd873d93',
                    key: 'document-upload',
                    type: 'TaskUpload',
                    position: {
                        x: 537.81201171875,
                        y: 53.712799072265625,
                    },
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Upload d un document',
                            },
                            {
                                lang: 'en-US',
                                value: 'Document upload',
                            },
                        ],
                        iconName: 'far fa-file-upload',
                        profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [],
                                data: [
                                    {
                                        uuid: 'af50a7fb-71c1-f8bc-26c9-16de6b7db811',
                                        key: 'file',
                                        multiple: false,
                                        type: 'sys:file',
                                        placeToSave: [],
                                    },
                                ],
                                uuid: 'a2e6ab1e-bd87-f922-706a-b76816330019',
                                key: 'done',
                                position: {
                                    x: 64,
                                    y: 32,
                                },
                                task: '893287ba-1b2e-11e9-ab14-d663bd873d93',
                            },
                        ],
                        custom: {
                            multiple: false,
                            documents: '{{document}}',
                        },
                        expressions: [],
                    },
                },
                {
                    uuid: '893287ba-1b2e-11e9-ab14-d663bd873d93',
                    key: 'document-form',
                    type: 'TaskForm',
                    position: {
                        x: 786.6240234375,
                        y: 109.47520446777344,
                    },
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Formulaire de document',
                            },
                            {
                                lang: 'en-US',
                                value: 'Document form',
                            },
                        ],
                        iconName: 'fab fa-wpforms',
                        profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [],
                                data: [],
                                uuid: '07bf96eb-50ed-496c-3284-9f50c8a883e0',
                                key: 'done',
                                position: {
                                    x: 64,
                                    y: 32,
                                },
                                task: 'd951a0be-1b2e-11e9-ab14-d663bd873d93',
                            },
                        ],
                        custom: {
                            columnsDisplay: [
                                'NAME',
                                'VERSION',
                                'DATE',
                                'STATES',
                                'USER',
                            ],
                            object: '{{document}}',
                        },
                        expressions: [],
                    },
                },
                {
                    uuid: 'd951a0be-1b2e-11e9-ab14-d663bd873d93',
                    key: 'notify-reviewers',
                    type: 'TaskNotification',
                    position: {
                        x: 997.9733276367188,
                        y: 68.47520446777344,
                    },
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Notification des reviewers',
                            },
                            {
                                lang: 'en-US',
                                value: 'Notify reviewers',
                            },
                        ],
                        iconName: 'far fa-bell',
                        profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [],
                                data: [
                                    {
                                        uuid: '37dbc6a0-c82e-65b9-cba7-8b2b56e92a05',
                                        key: 'notify',
                                        multiple: false,
                                        type: 'sys:notification',
                                        placeToSave: [],
                                    },
                                ],
                                uuid: '075427d5-da78-1a1f-1f66-662bfe38187a',
                                key: 'notify',
                                position: {
                                    x: 64,
                                    y: 32,
                                },
                                task: 'eb51f0d4-1b2e-11e9-ab14-d663bd873d93',
                            },
                        ],
                        custom: {
                            title: 'Creation of new document : {{file.name}} ',
                            content: 'Creator : {{file.user}} \nEquipment : {{equipment.NAME}} \nDate : ' +
                                '{{file.dateUpdated}} \nDocument : {{file.name}} ',
                            profiles: [
                                '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                            ],
                        },
                        expressions: [],
                    },
                },
                {
                    uuid: 'e7d81563-6adb-a84a-4d1a-31295dd55205',
                    key: '',
                    type: 'TaskObjectCreate',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Nouveau Document',
                            },
                            {
                                lang: 'en-US',
                                value: 'New Document',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                        iconName: 'far fa-cube',
                    },
                    position: {
                        x: 338.5215759277344,
                        y: 104.5248031616211,
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [],
                                data: [
                                    {
                                        uuid: 'a68873d4-d42b-345d-fbe6-190ef980178c',
                                        key: 'document',
                                        multiple: false,
                                        type: 'so:document',
                                        placeToSave: ['{{equipment.DOCUMENTS}}'],
                                    },
                                ],
                                uuid: '7584f9b5-63f3-23f3-220c-4f8f5774a94c',
                                key: 'done',
                                position: {
                                    x: 64,
                                    y: 32,
                                },
                                task: '793461b8-1b2d-11e9-ab14-d663bd873d93',
                            },
                        ],
                        custom: {
                            smartModel: 'DOCUMENT',
                        },
                        expressions: [],
                    },
                },
            ],
            uuid: '66fc4312-1b2d-11e9-ab14-d663bd873d93',
            key: 'document-submission',
            color: '#C66E20',
        },
        {
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Revue',
                },
                {
                    lang: 'en-US',
                    value: 'Review',
                },
            ],
            tasks: [
                {
                    uuid: 'eb51f0d4-1b2e-11e9-ab14-d663bd873d93',
                    key: 'reviewers-check',
                    type: 'TaskReview',
                    position: {
                        x: 900,
                        y: 300,
                    },
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Verification du reviewer',
                            },
                            {
                                lang: 'en-US',
                                value: 'Reviewers Check',
                            },
                        ],
                        iconName: 'far fa-binoculars',
                        profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Confirmer',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Confirm',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                                data: [],
                                uuid: '25e99d4a-1b30-11e9-ab14-d663bd873d93',
                                key: 'ok',
                                task: '2adafc78-1b2f-11e9-ab14-d663bd873d93',
                                position: {
                                    x: 62,
                                    y: 20,
                                },
                            },
                            {
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Refuser',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Refuse',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                                data: [],
                                uuid: '297252e0-1b30-11e9-ab14-d663bd873d93',
                                key: 'revision',
                                task: '3be361cc-1b2f-11e9-ab14-d663bd873d93',
                                position: {
                                    x: 62,
                                    y: 44,
                                },
                            },
                        ],
                        custom: {
                            comment: true,
                            notification: '{{notify}}',
                            linkedFiles: '{{file}}',
                        },
                        expressions: [],
                    },
                },
                {
                    uuid: '2adafc78-1b2f-11e9-ab14-d663bd873d93',
                    key: 'notify-all',
                    type: 'TaskNotification',
                    position: {
                        x: 1100,
                        y: 300,
                    },
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Notification à tous',
                            },
                            {
                                lang: 'en-US',
                                value: 'Notify all',
                            },
                        ],
                        iconName: 'far fa-bell',
                        profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [],
                                data: [
                                    {
                                        uuid: 'a6629986-1690-29f0-a611-5088306e1cd7',
                                        key: '',
                                        multiple: false,
                                        type: 'sys:notification',
                                        placeToSave: [],
                                    },
                                ],
                                uuid: '665ae374-4792-a35a-1dce-89d1fc54a48b',
                                key: 'notify',
                                position: {
                                    x: 64,
                                    y: 32,
                                },
                                task: '2586ce28-b88f-639b-7d7f-ec72fd4b6501',
                            },
                        ],
                        custom: {
                            title: '(ACCEPT) document : {{file.name}}',
                            content: '{{notify.content}} ',
                            profiles: [
                                'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                                '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                            ],
                        },
                        expressions: [],
                    },
                },
                {
                    uuid: '3be361cc-1b2f-11e9-ab14-d663bd873d93',
                    key: 'notify-emitter',
                    type: 'TaskNotification',
                    position: {
                        x: 1000,
                        y: 458,
                    },
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Notification de l\'envoyeur',
                            },
                            {
                                lang: 'en-US',
                                value: 'Notify emitter',
                            },
                        ],
                        iconName: 'far fa-bell',
                        profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [],
                                data: [
                                    {
                                        uuid: 'e7056444-2141-9436-4d7c-1ca6cefd0d74',
                                        key: 'notify',
                                        multiple: false,
                                        type: 'sys:notification',
                                        placeToSave: [],
                                    },
                                ],
                                uuid: '502f1873-f9ef-edea-9931-3fbcd165f14c',
                                key: 'notify',
                                position: {
                                    x: 64,
                                    y: 32,
                                },
                                task: '4b63f940-1b2f-11e9-ab14-d663bd873d93',
                            },
                        ],
                        custom: {
                            title: '(REVISION) document : {{file.name}}',
                            content: '{{notify.content}} ',
                            profiles: [
                                'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                            ],
                        },
                        expressions: [],
                    },
                },
                {
                    uuid: '2586ce28-b88f-639b-7d7f-ec72fd4b6501',
                    key: '',
                    type: 'TaskFinisher',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: '',
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
                        profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                        iconName: 'far fa-flag-checkered',
                    },
                    properties: {
                        services: [],
                        transitions: [],
                        custom: {
                            save: true,
                        },
                        expressions: [],
                    },
                    position: {
                        x: 1277.234375,
                        y: 303,
                    },
                },
            ],
            uuid: 'f32fb3fe-1b2e-11e9-ab14-d663bd873d93',
            key: 'review',
            color: '#9B51E0',
        },
        {
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Revision',
                },
                {
                    lang: 'en-US',
                    value: 'Révision',
                },
            ],
            tasks: [
                {
                    uuid: '4b63f940-1b2f-11e9-ab14-d663bd873d93',
                    key: 'revision-comments',
                    type: 'TaskReview',
                    position: {
                        x: 278,
                        y: 426,
                    },
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Commentaire de la revision',
                            },
                            {
                                lang: 'en-US',
                                value: 'Revision comments',
                            },
                        ],
                        iconName: 'far fa-binoculars',
                        profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Mettre à jour',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Update',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                                data: [],
                                uuid: 'c69d5b7d-dada-9f99-5751-66ce249c3b52',
                                key: 'update',
                                position: {
                                    x: 62,
                                    y: 20,
                                },
                                task: '67eadb70-9f8a-3e56-bcd5-637dea197464',
                            },
                            {
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Annuler',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Discard',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                                data: [],
                                uuid: '7c815a69-279a-8388-2a97-46141e361024',
                                key: 'discard',
                                position: {
                                    x: 62,
                                    y: 44,
                                },
                                task: '6446c8b6-1b2f-11e9-ab14-d663bd873d93',
                            },
                        ],
                        custom: {
                            comment: false,
                            notification: '{{notify}}',
                            linkedFiles: '{{file}}',
                        },
                        expressions: [],
                    },
                },
                {
                    uuid: '6446c8b6-1b2f-11e9-ab14-d663bd873d93',
                    key: 'notify-all',
                    type: 'TaskNotification',
                    position: {
                        x: 492,
                        y: 403,
                    },
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Notification à tous',
                            },
                            {
                                lang: 'en-US',
                                value: 'Notify all',
                            },
                        ],
                        iconName: 'far fa-bell',
                        profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [],
                                data: [
                                    {
                                        uuid: 'a1b8c0dd-4d1b-8ecd-2233-c76b11cbb2d0',
                                        key: '',
                                        multiple: false,
                                        type: 'sys:notification',
                                        placeToSave: [],
                                    },
                                ],
                                uuid: 'de26aecc-6a7a-124b-bb94-67dfd436f821',
                                key: 'notify',
                                position: {
                                    x: 64,
                                    y: 32,
                                },
                                task: '2d0c6e1c-b6a4-b6a2-78be-4dcf8097c20d',
                            },
                        ],
                        custom: {
                            title: '(DISCARD) document : {{file.name}}',
                            content: '{{notify.content}} ',
                            profiles: [
                                'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                                '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                            ],
                        },
                        expressions: [],
                    },
                },
                {
                    uuid: '67eadb70-9f8a-3e56-bcd5-637dea197464',
                    key: '',
                    type: 'TaskUndo',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: '',
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
                        profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                        iconName: 'far fa-undo',
                    },
                    position: {
                        x: 390.234375,
                        y: 309,
                    },
                    properties: {
                        services: [],
                        transitions: [
                            {
                                displayName: [],
                                data: [],
                                uuid: '648853f5-2551-3856-e181-a13f73ec682d',
                                key: 'done',
                                position: {
                                    x: 64,
                                    y: 32,
                                },
                                task: '793461b8-1b2d-11e9-ab14-d663bd873d93',
                            },
                        ],
                        custom: {},
                        expressions: [],
                    },
                },
                {
                    uuid: '2d0c6e1c-b6a4-b6a2-78be-4dcf8097c20d',
                    key: '',
                    type: 'TaskFinisher',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: '',
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
                        profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                        iconName: 'far fa-flag-checkered',
                    },
                    properties: {
                        services: [],
                        transitions: [],
                        custom: {
                            save: false,
                        },
                        expressions: [],
                    },
                    position: {
                        x: 658.234375,
                        y: 366,
                    },
                },
            ],
            uuid: '7486f6b4-1b12-11e9-ab14-d663bd873d93',
            key: 'revision',
            color: '#3CA4DC',
        },
    ],
};