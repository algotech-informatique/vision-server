import { Settings } from '../../interfaces';

export class DefaultSettings {

    public static defaultSettings: Settings = {
        uuid: '',
        deleted: false,
        customerKey: '',
        createdDate: '',
        updateDate: '',
        documents: {
            metadatas: [],
        },
        plan: {
            general: {
                displayPlanSO: {
                    uuid: '5db40a55-a7d8-420e-beb4-55e5e5e808f6',
                    propertyList: [
                        {
                            name: 'primary',
                            smartModel: [],
                        },
                        {
                            name: 'secondary',
                            smartModel: [],
                        },
                        {
                            name: 'tertiary',
                            smartModel: [],
                        },
                        {
                            name: 'icon',
                            smartModel: [],
                        },
                    ],
                },
            },
            poi: [],
            containers: [],
        },
        workflows: [],
        agenda: [],
        audit: {
            activated: false,
            traceOriginal: false,
        },
        theme: {
            themeKey: 'light',
            customColors: [],
        },
        player: {
            name: "Vision Player",
            short_name: "Vision Player",
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
}
