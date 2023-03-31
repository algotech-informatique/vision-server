import { ApplicationModelDto } from '@algotech-ce/core';

export const applicationModel1: ApplicationModelDto = {
    uuid: 'b3cd1662-deb7-4a0f-aa24-376c5001ad91',
    key: 'test-page',
    snModelUuid: '209b84e7-9e82-2c0c-e13a-238cf23f5e60',
    appId: '209b84e7-9e82-2c0c-e13a-238cf23f5e61',
    appVersion: 1,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Créer une application',
        },
        {
            lang: 'en-US',
            value: 'Create application',
        },
    ],
    description: [
        {
            lang: 'fr-FR',
            value: 'Site web',
        },
        {
            lang: 'en-US',
            value: 'Site Web',
        },
    ],
    environment: 'page-web',
    snApp: {
        id: 'd9b16d91-7ddc-3a7a-7b82-422e9e3dff4f',
        description: [],
        environment: 'web',
        securityGroups: [
            'sadmin',
            'admin',
        ],
        icon: '',
        pageHeight: 700,
        pageWidth: 700,
        pages: [
            {
                id: '97780cc5-7393-31d5-22ea-176b6ab9090b',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'test mmb',
                    },
                    {
                        lang: 'en_US',
                        value: '',
                    },
                ],
                canvas: {
                    x: 0,
                    y: 0,
                },
                css: '',
                pageHeight: 700,
                pageWidth: 700,
                icon: '',
                events: [],
                variables: [],
                dataSources: [],
                securityGroups: [],
                widgets: [
                    {
                        id: 'd10c7ed1-797b-6233-e057-6815f91e13cd',
                        typeKey: 'button',
                        name: 'Bouton',
                        isActive: true,
                        css: '{\"title\":{\"color\":\"#ffffff\"}}',
                        custom: {
                            title: [
                                {
                                    lang: 'fr-FR',
                                    value: 'Titre',
                                },
                                {
                                    lang: 'en-US',
                                    value: '',
                                },
                            ],
                        },
                        box: {
                            x: 6,
                            y: 7,
                            height: 1,
                            width: 1,
                        },
                        events: [],
                        rules: []
                    },
                ],
            },
        ],
        shared: [],
    },
};

export const applicationModel2: ApplicationModelDto = {
    uuid: '3ee82b8b-418a-4267-a08c-ddb46bc50248',
    key: 'test-application',
    snModelUuid: '051fbd18-4a39-462f-95ef-98f9d0b06d8f',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'web',
        },
        {
            lang: 'en-US',
            value: 'web',
        },
    ],
    description: [
        {
            lang: 'fr-FR',
            value: 'test application',
        },
        {
            lang: 'en-US',
            value: 'application test',
        },
    ],
    environment: 'page-mobile',
    snApp: {
        environment: 'web',
        icon: '',
        id: 'eb9a30a7-decd-4400-bbae-1fcb6edf43a0',
        pageHeight: 0,
        pageWidth: 0,
        pages: [],
        securityGroups: [],
        description: [],
        shared: [],
    },
};
