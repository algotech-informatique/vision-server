import { PatchPropertyDto, SettingsDto } from '@algotech-ce/core';

export const settings: SettingsDto = {
    uuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
    plan: {
        general: {
            displayPlanSO: {
                uuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                propertyList: [
                    {
                        name: 'Name',
                        smartModel: [
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'EQUIPEMENT.NAME',
                                smModel: 'EQUIPEMENT',
                                smField: 'name',
                                color: 'primary',
                            },
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'GROUP.NAME',
                                smModel: 'GROUP',
                                smField: 'name',
                                color: 'primary',
                            },
                        ],
                    },
                    {
                        name: 'hastag',
                        smartModel: [
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'EQUIPEMENT.DESCRIPTION',
                                smModel: 'EQUIPEMENT',
                                smField: 'description',
                                color: 'primary',
                            },
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'DOCUMENT.DESCRIPTION',
                                smModel: 'DOCUMENT',
                                smField: 'description',
                                color: 'primary',
                            },
                        ],
                    },
                    {
                        name: 'tags',
                        smartModel: [

                        ],
                    },
                    {
                        name: 'location',
                        smartModel: [
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'EQUIPEMENT.LOCATION',
                                smModel: 'EQUIPEMENT',
                                smField: 'location',
                                color: 'primary',
                            },
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'DOCUMENT.LOCATION',
                                smModel: 'DOCUMENT',
                                smField: 'location',
                                color: 'primary',
                            },
                        ],
                    },
                ],
            },
        },
        poi: [
            {
                uuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                icon: '<i class="fas fa-unicorn"></i>',
                color: 'secondary',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Equipement electrique',
                    },
                    {
                        lang: 'en-US',
                        value: 'Electrical equipement',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                content: {
                    path: 'EQUIPEMENT.TYPE',
                    value: 'ELEC',
                },
                displayValue: 'EQUIPEMENT.NAME',
                toolTip: '<p>Blabla</p>',
                actionType: 'workflow',
                zoomMin: 15,
                zoomMax: 3,
                type: 'poi',
                widgets: [],
            },
        ],
        containers: [
            {
                uuid: '9aa4aed8-4c7f-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Site Ouest',
                    },
                    {
                        lang: 'en-US',
                        value: 'West Site',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: null,
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '734d94e1-3717-4111-ae5e-c54e6b3f1a6c',
                        key: 'site-ouest',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Site Ouest',
                            },
                            {
                                lang: 'en-US',
                                value: 'West Site',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: 'e1d57b3e-4c7f-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'CHLS-1C-E',
                    },
                    {
                        lang: 'en-US',
                        value: 'CHLS-1C-E',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: null,
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '0837932d-6020-4d48-9eb0-7fb2b8db1adc',
                        key: 'chls-1c-e',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'CHLS-1C-E',
                            },
                            {
                                lang: 'en-US',
                                value: 'CHLS-1C-E',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Souffleuse',
                    },
                    {
                        lang: 'en-US',
                        value: 'Blower',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '9aa4aed8-4c7f-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: 'a036be36-56b8-4a27-a7ff-0addb9e0067d',
                        key: 'souffleuse',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Souffleuse',
                            },
                            {
                                lang: 'en-US',
                                value: 'Blower',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: '586ad942-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Carrousel de soufflage',
                    },
                    {
                        lang: 'en-US',
                        value: 'Blowing carousel',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '9a0b12eb-2582-4dec-b401-d912cc4c820f',
                        key: 'carrousel-de-soufflage',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Carrousel de soufflage',
                            },
                            {
                                lang: 'en-US',
                                value: 'Blowing carousel',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: 'ab544b70-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Alimentation preformes',
                    },
                    {
                        lang: 'en-US',
                        value: 'Alimentation preformes',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '711255a9-3597-4c82-99d4-8e09e05339f1',
                        key: 'alimentation-preformes',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Alimentation preformes',
                            },
                            {
                                lang: 'en-US',
                                value: 'Alimentation preformes',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: 'd728143e-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Machine general',
                    },
                    {
                        lang: 'en-US',
                        value: 'General machine',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '902f2ad2-8044-4821-abbc-d997c0381c1b',
                        key: 'machine-general',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Machine general',
                            },
                            {
                                lang: 'en-US',
                                value: 'General machine',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
        ],
    },
    workflows: [
        {
            uuid: '40d21113-d167-4d5e-88cb-60c2fea4097e',
            filters: [],
            platforms: [],
            securityGroup: [
                {
                    profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    group: 'technician',
                    login: '',
                },
                {
                    profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                    group: 'admin',
                    login: '',
                },
            ],
            workflowUuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
            savingMode: 'END',
            unique: false,
            context: '',
        }, {
            uuid: '40d21113-d167-4d5e-88cb-60c2fea4098e',
            filters: [],
            platforms: [],
            securityGroup: [
                {
                    profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    group: 'sadmin',
                    login: '',
                },
            ],
            workflowUuid: '7fba6169-8a8d-4fee-9001-abe6d9ebef86',
            savingMode: 'END',
            unique: false,
            context: '',
        },
    ],
    agenda: [
        {
            statutGroupList: 'schedulestatus',
            key: 'Equipement-Type',
            owner: 'sadmin',
            workflowUuid: '7fba6169-8a8d-4fee-9001-abe6d9ebef86',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Type equipement',
                },
                {
                    lang: 'en-US',
                    value: 'equipement Type',
                },
                {
                    lang: 'es-ES',
                    value: '',
                },
            ],
            displays: [
                {
                    smartModelsKey: 'EQUIPMENT',
                    hasTitle: true,
                    securityGroupsKey: [
                        'technician',
                        'admin',
                    ],
                    primary: 'test',
                    secondary: 'test',
                    tertiary: 'test',
                    highlight: 'test',
                },
            ],
            defaultWorkflowModels: [
                {
                    workflowUuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
                    parameters: [
                        {
                            key: 'smart-object-selected.NAME',
                            source: 'smart-object-selected.NAME',
                        },
                    ],
                    profils: [
                        {
                            profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                            group: 'technician',
                            login: '',
                        },
                        {
                            profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                            group: 'admin',
                            login: '',
                        },
                    ],
                },
            ],
            defaultReceivers: [
                {
                    userUuid: '110e8400-e29b-11d4-a716-446655440000',
                    groupUuid: '256b3672-6d60-11e8-adc0-fa7ae01bbebc',
                    permission: 'RW',
                },
                {
                    userUuid: '110e8400-e29b-11d4-a716-446655440003',
                    groupUuid: '88af50c0-6d5f-11e8-adc0-fa7ae01bbebc',
                    permission: 'R',
                },
            ],
            attribuable: true,
            attributionMaxNumber: 1,
            defaultTags: [
                'tag 1',
                'tag 2',
                'tag 3',
            ],

        },
    ],
    audit: {
        activated: true,
        traceOriginal: false,
    },
    documents: {
        metadatas: [],
    },
    theme: {
        themeKey: 'light',
        customColors: [],
    },
    player: {
        name: "Vision Player",
        short_name: "Vision",
        gcm_sender_id: "103953800507",
        theme_color: "#212121",
        background_color: "#fafafa",
        display: "standalone",
        scope: "./",
        start_url: "./",
        id: "",
        orientation: "portrait-primary",
        related_applications: [],
        icons: [
            {
                src: "files/player/player_icon-72x72",
                sizes: "72x72",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-144x144",
                sizes: "144x144",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-192x192",
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-256x256",
                sizes: "256x256",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-384x384",
                sizes: "384x384",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-512x512",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            }
        ]
    }
};

export const createSettings: SettingsDto = {
    plan: {
        general: {
            displayPlanSO: {
                uuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                propertyList: [
                    {
                        name: 'Name',
                        smartModel: [
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'EQUIPEMENT.NAME',
                                smModel: 'EQUIPEMENT',
                                smField: 'name',
                                color: 'primary',
                            },
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'GROUP.NAME',
                                smModel: 'GROUP',
                                smField: 'name',
                                color: 'primary',
                            },
                        ],
                    },
                    {
                        name: 'hastag',
                        smartModel: [
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'EQUIPEMENT.DESCRIPTION',
                                smModel: 'EQUIPEMENT',
                                smField: 'description',
                                color: 'primary',
                            },
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'DOCUMENT.DESCRIPTION',
                                smModel: 'DOCUMENT',
                                smField: 'description',
                                color: 'primary',
                            },
                        ],
                    },
                    {
                        name: 'tags',
                        smartModel: [

                        ],
                    },
                    {
                        name: 'location',
                        smartModel: [
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'EQUIPEMENT.LOCATION',
                                smModel: 'EQUIPEMENT',
                                smField: 'location',
                                color: 'primary',
                            },
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'DOCUMENT.LOCATION',
                                smModel: 'DOCUMENT',
                                smField: 'location',
                                color: 'primary',
                            },
                        ],
                    },
                ],
            },
        },
        poi: [
            {
                uuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                icon: '<i class="fas fa-unicorn"></i>',
                color: 'secondary',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Equipement electrique',
                    },
                    {
                        lang: 'en-US',
                        value: 'Electrical equipement',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                content: {
                    path: 'EQUIPEMENT.TYPE',
                    value: 'ELEC',
                },
                displayValue: 'EQUIPEMENT.NAME',
                toolTip: '<p>Blabla</p>',
                actionType: 'workflow',
                zoomMin: 15,
                zoomMax: 3,
                type: 'poi',
                widgets: [],
            },
        ],
        containers: [
            {
                uuid: '9aa4aed8-4c7f-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Site Ouest',
                    },
                    {
                        lang: 'en-US',
                        value: 'West Site',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: null,
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '734d94e1-3717-4111-ae5e-c54e6b3f1a6c',
                        key: 'site-ouest',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Site Ouest',
                            },
                            {
                                lang: 'en-US',
                                value: 'West Site',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: 'e1d57b3e-4c7f-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'CHLS-1C-E',
                    },
                    {
                        lang: 'en-US',
                        value: 'CHLS-1C-E',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: null,
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '0837932d-6020-4d48-9eb0-7fb2b8db1adc',
                        key: 'chls-1c-e',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'CHLS-1C-E',
                            },
                            {
                                lang: 'en-US',
                                value: 'CHLS-1C-E',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Souffleuse',
                    },
                    {
                        lang: 'en-US',
                        value: 'Blower',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '9aa4aed8-4c7f-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: 'a036be36-56b8-4a27-a7ff-0addb9e0067d',
                        key: 'souffleuse',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Souffleuse',
                            },
                            {
                                lang: 'en-US',
                                value: 'Blower',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: '586ad942-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Carrousel de soufflage',
                    },
                    {
                        lang: 'en-US',
                        value: 'Blowing carousel',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '9a0b12eb-2582-4dec-b401-d912cc4c820f',
                        key: 'carrousel-de-soufflage',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Carrousel de soufflage',
                            },
                            {
                                lang: 'en-US',
                                value: 'Blowing carousel',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: 'ab544b70-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Alimentation preformes',
                    },
                    {
                        lang: 'en-US',
                        value: 'Alimentation preformes',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '711255a9-3597-4c82-99d4-8e09e05339f1',
                        key: 'alimentation-preformes',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Alimentation preformes',
                            },
                            {
                                lang: 'en-US',
                                value: 'Alimentation preformes',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: 'd728143e-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Machine general',
                    },
                    {
                        lang: 'en-US',
                        value: 'General machine',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '902f2ad2-8044-4821-abbc-d997c0381c1b',
                        key: 'machine-general',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Machine general',
                            },
                            {
                                lang: 'en-US',
                                value: 'General machine',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
        ],
    },
    workflows: [
        {
            uuid: '40d21113-d167-4d5e-88cb-60c2fea4097e',
            filters: [],
            platforms: [],
            securityGroup: [
                {
                    profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    group: 'technician',
                    login: '',
                },
                {
                    profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                    group: 'admin',
                    login: '',
                },
            ],
            workflowUuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
            savingMode: 'END',
            unique: false,
            context: '',
        }, {
            uuid: '40d21113-d167-4d5e-88cb-60c2fea4098e',
            filters: [],
            platforms: [],
            securityGroup: [
                {
                    profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    group: 'sadmin',
                    login: '',
                },
            ],
            workflowUuid: '7fba6169-8a8d-4fee-9001-abe6d9ebef86',
            savingMode: 'END',
            unique: false,
            context: '',
        },
    ],
    agenda: [
        {
            statutGroupList: 'schedulestatus',
            key: 'Equipement-Type',
            owner: 'sadmin',
            workflowUuid: '7fba6169-8a8d-4fee-9001-abe6d9ebef86',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Type equipement',
                },
                {
                    lang: 'en-US',
                    value: 'equipement Type',
                },
                {
                    lang: 'es-ES',
                    value: '',
                },
            ],
            displays: [
                {
                    smartModelsKey: 'EQUIPMENT',
                    hasTitle: true,
                    securityGroupsKey: [
                        'technician',
                        'admin',
                    ],
                    primary: 'test',
                    secondary: 'test',
                    tertiary: 'test',
                    highlight: 'test',
                },
            ],
            defaultWorkflowModels: [
                {
                    workflowUuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
                    parameters: [
                        {
                            key: 'smart-object-selected.NAME',
                            source: 'smart-object-selected.NAME',
                        },
                    ],
                    profils: [
                        {
                            profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                            group: 'technician',
                            login: '',
                        },
                        {
                            profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                            group: 'admin',
                            login: '',
                        },
                    ],
                },
            ],
            defaultReceivers: [
                {
                    userUuid: '110e8400-e29b-11d4-a716-446655440000',
                    groupUuid: '256b3672-6d60-11e8-adc0-fa7ae01bbebc',
                    permission: 'RW',
                },
                {
                    userUuid: '110e8400-e29b-11d4-a716-446655440003',
                    groupUuid: '88af50c0-6d5f-11e8-adc0-fa7ae01bbebc',
                    permission: 'R',
                },
            ],
            attribuable: true,
            attributionMaxNumber: 1,
            defaultTags: [
                'tag 1',
                'tag 2',
                'tag 3',
            ],
        },
    ],
    audit: {
        activated: false,
        traceOriginal: false,
    },
    documents: {
        metadatas: [],
    },
    theme: {
        themeKey: 'light',
        customColors: [],
    },
    player: {
        name: "Vision Player",
        short_name: "Vision",
        gcm_sender_id: "103953800507",
        theme_color: "#212121",
        background_color: "#fafafa",
        display: "standalone",
        scope: "./",
        start_url: "./",
        id: "",
        orientation: "portrait-primary",
        related_applications: [],
        icons: [
            {
                src: "files/player/player_icon-72x72",
                sizes: "72x72",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-144x144",
                sizes: "144x144",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-192x192",
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-256x256",
                sizes: "256x256",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-384x384",
                sizes: "384x384",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-512x512",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            }
        ]
    }
};

export const updateSettings: SettingsDto = {
    plan: {
        general: {
            displayPlanSO: {
                uuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                propertyList: [
                    {
                        name: 'Name',
                        smartModel: [
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'EQUIPEMENT.NAME',
                                smModel: 'EQUIPEMENT',
                                smField: 'name',
                                color: 'primary',
                            },
                        ],
                    },
                    {
                        name: 'hastag',
                        smartModel: [
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'EQUIPEMENT.DESCRIPTION',
                                smModel: 'EQUIPEMENT',
                                smField: 'description',
                                color: 'primary',
                            },
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'DOCUMENT.DESCRIPTION',
                                smModel: 'DOCUMENT',
                                smField: 'description',
                                color: 'primary',
                            },
                        ],
                    },
                    {
                        name: 'tags',
                        smartModel: [

                        ],
                    },
                    {
                        name: 'location',
                        smartModel: [
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'EQUIPEMENT.LOCATION',
                                smModel: 'EQUIPEMENT',
                                smField: 'location',
                                color: 'primary',
                            },
                            {
                                smUuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                                smFormated: 'DOCUMENT.LOCATION',
                                smModel: 'DOCUMENT',
                                smField: 'location',
                                color: 'primary',
                            },
                        ],
                    },
                ],
            },
        },
        poi: [
            {
                uuid: 'd806e514-4bf0-11e9-8646-d663bd873d93',
                icon: '<i class="fas fa-unicorn"></i>',
                color: 'secondary',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Equipement electrique',
                    },
                    {
                        lang: 'en-US',
                        value: 'Electrical equipement',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                content: {
                    path: 'EQUIPEMENT.TYPE',
                    value: 'ELEC',
                },
                displayValue: 'EQUIPEMENT.NAME',
                toolTip: '<p>Blabla</p>',
                actionType: 'workflow',
                zoomMin: 15,
                zoomMax: 3,
                type: 'poi',
                widgets: [],
            },
        ],
        containers: [
            {
                uuid: '9aa4aed8-4c7f-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Site Ouest',
                    },
                    {
                        lang: 'en-US',
                        value: 'West Site',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: null,
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '734d94e1-3717-4111-ae5e-c54e6b3f1a6c',
                        key: 'site-ouest',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Site Ouest',
                            },
                            {
                                lang: 'en-US',
                                value: 'West Site',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: 'e1d57b3e-4c7f-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'CHLS-1C-E',
                    },
                    {
                        lang: 'en-US',
                        value: 'CHLS-1C-E',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: null,
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '0837932d-6020-4d48-9eb0-7fb2b8db1adc',
                        key: 'chls-1c-e',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'CHLS-1C-E',
                            },
                            {
                                lang: 'en-US',
                                value: 'CHLS-1C-E',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Souffleuse',
                    },
                    {
                        lang: 'en-US',
                        value: 'Blower',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '9aa4aed8-4c7f-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: 'a036be36-56b8-4a27-a7ff-0addb9e0067d',
                        key: 'souffleuse',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Souffleuse',
                            },
                            {
                                lang: 'en-US',
                                value: 'Blower',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: '586ad942-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Carrousel de soufflage',
                    },
                    {
                        lang: 'en-US',
                        value: 'Blowing carousel',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '9a0b12eb-2582-4dec-b401-d912cc4c820f',
                        key: 'carrousel-de-soufflage',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Carrousel de soufflage',
                            },
                            {
                                lang: 'en-US',
                                value: 'Blowing carousel',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: 'ab544b70-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Alimentation preformes',
                    },
                    {
                        lang: 'en-US',
                        value: 'Alimentation preformes',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '711255a9-3597-4c82-99d4-8e09e05339f1',
                        key: 'alimentation-preformes',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Alimentation preformes',
                            },
                            {
                                lang: 'en-US',
                                value: 'Alimentation preformes',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
            {
                uuid: 'd728143e-4c80-11e9-8646-d663bd873d93',
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Machine general',
                    },
                    {
                        lang: 'en-US',
                        value: 'General machine',
                    },
                    {
                        lang: 'es-ES',
                        value: '',
                    },
                ],
                description: [
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
                metadataSoUuid: null,
                metadatas: [],
                imageIds: [

                ],
                parentUuid: '04eb47ac-4c80-11e9-8646-d663bd873d93',
                layers: [
                    {
                        layerType: 'mapCustom',
                        uuid: '902f2ad2-8044-4821-abbc-d997c0381c1b',
                        key: 'machine-general',
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Machine general',
                            },
                            {
                                lang: 'en-US',
                                value: 'General machine',
                            },
                            {
                                lang: 'es-ES',
                                value: '',
                            },
                        ],
                        rasters: [
                            {
                                uuid: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                                key: 'raster-batiment',
                                backgroundColor: '#000000',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Raster batiment',
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Building Raster',
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: '',
                                    },
                                ],
                            },
                        ],
                        defaultZoom: 4,
                        zoomMin: 15,
                        zoomMax: 3,
                        defaultCenter: [
                            120.0,
                            -120.0,
                        ],
                        defaultRaster: 'a423af96-4bf2-11e9-8646-d663bd873d93',
                        clustersMode: false,
                        metadatas: [],
                    },
                ],
            },
        ],
    },
    workflows: [
        {
            uuid: '40d21113-d167-4d5e-88cb-60c2fea4097e',
            filters: [],
            platforms: [],
            securityGroup: [
                {
                    profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    group: 'technician',
                    login: '',
                },
                {
                    profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                    group: 'admin',
                    login: '',
                },
            ],
            workflowUuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
            savingMode: 'END',
            unique: false,
            context: '',
        }, {
            uuid: '40d21113-d167-4d5e-88cb-60c2fea4098e',
            filters: [],
            platforms: [],
            securityGroup: [
                {
                    profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    group: 'sadmin',
                    login: '',
                },
            ],
            workflowUuid: '7fba6169-8a8d-4fee-9001-abe6d9ebef86',
            savingMode: 'END',
            unique: false,
            context: '',
        },
    ],
    agenda: [
        {
            statutGroupList: 'schedulestatus',
            key: 'Equipement-Type',
            owner: 'sadmin',
            workflowUuid: '7fba6169-8a8d-4fee-9001-abe6d9ebef86',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Type equipement',
                },
                {
                    lang: 'en-US',
                    value: 'equipement Type',
                },
                {
                    lang: 'es-ES',
                    value: '',
                },
            ],
            displays: [
                {
                    smartModelsKey: 'EQUIPMENT',
                    hasTitle: true,
                    securityGroupsKey: [
                        'technician',
                        'admin',
                    ],
                    primary: 'test',
                    secondary: 'test',
                    tertiary: 'test',
                    highlight: 'test',
                },
            ],
            defaultWorkflowModels: [
                {
                    workflowUuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
                    parameters: [
                        {
                            key: 'smart-object-selected.NAME',
                            source: 'smart-object-selected.NAME',
                        },
                    ],
                    profils: [
                        {
                            profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                            group: 'technician',
                            login: '',
                        },
                        {
                            profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                            group: 'admin',
                            login: '',
                        },
                    ],
                },
            ],
            defaultReceivers: [
                {
                    userUuid: '110e8400-e29b-11d4-a716-446655440000',
                    groupUuid: '256b3672-6d60-11e8-adc0-fa7ae01bbebc',
                    permission: 'RW',
                },
                {
                    userUuid: '110e8400-e29b-11d4-a716-446655440003',
                    groupUuid: '88af50c0-6d5f-11e8-adc0-fa7ae01bbebc',
                    permission: 'R',
                },
            ],
            attribuable: true,
            attributionMaxNumber: 1,
            defaultTags: [
                'tag 1',
                'tag 2',
                'tag 3',
            ],
        },
    ],
    audit: {
        activated: false,
        traceOriginal: false,
    },
    documents: {
        metadatas: [],
    },
    theme: {
        themeKey: 'light',
        customColors: [],
    },
    player: {

        name: "Vision Player",
        short_name: "Vision",
        gcm_sender_id: "103953800507",
        theme_color: "#212121",
        background_color: "#fafafa",
        display: "standalone",
        scope: "./",
        start_url: "./",
        id: "",
        orientation: "portrait-primary",
        related_applications: [],
        icons: [
            {
                src: "files/player/player_icon-72x72",
                sizes: "72x72",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-144x144",
                sizes: "144x144",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-192x192",
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-256x256",
                sizes: "256x256",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-384x384",
                sizes: "384x384",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "files/player/player_icon-512x512",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            }
        ]
    }
};

export const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/plan/poi/[0]/displayName/[lang:fr-FR]/value',
    value: 'Un équipement électrique',
};

export const patchPush: PatchPropertyDto = {
    op: 'add',
    path: '/plan/poi/[0]/displayName/[?]',
    value:
    {
        lang: 'es-ES',
        value: 'Equipo Electrico',
    },
};

export const patchSetError: PatchPropertyDto = {
    op: 'add',
    path: '/plan/poi/[0]/displayName/[lang:fr-FR]/caption',
    value: 'Version',
};

export const patchSetNoRespectModel: PatchPropertyDto = {
    op: 'add',
    path: '/plan/poi/[0]/display/[lang:fr-FR]/test',
    value: 'Version',
};

export const patchPull: PatchPropertyDto = {
    op: 'remove',
    path: '/plan/poi/[0]/displayName/[lang:fr-FR]',
};

export const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/plan/general',
};

export const settingsPatched = {
    displayName: [
        {
            lang: 'en-US',
            value: 'Electrical equipement',
        },
        {
            lang: 'es-ES',
            value: '',
        },
        {
            lang: 'es-ES',
            value: 'Equipo Electrico',
        },
    ],
};
