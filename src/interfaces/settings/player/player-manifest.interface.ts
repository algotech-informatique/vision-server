export interface PlayerManifestIcon {
    readonly src: string;
    readonly sizes: string;
    readonly type: string;
    readonly purpose: string;
}

export interface PlayerManifestRelatedApps {
    readonly platform: string;
    readonly url: string;
}

export interface PlayerManifest {
    readonly name: string;
    readonly short_name: string;
    readonly gcm_sender_id: string;
    readonly theme_color: string;
    readonly background_color: string;
    readonly orientation: 'landscape' | 'portrait' | 'landscape-primary' | 'portrait-primary';
    readonly display: string;
    readonly scope: string;
    readonly start_url: string;
    readonly id: string;
    readonly related_applications: PlayerManifestRelatedApps[];
    readonly icons: PlayerManifestIcon[];
}
