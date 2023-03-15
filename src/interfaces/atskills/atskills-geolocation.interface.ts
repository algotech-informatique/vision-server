export interface ATSkillsGeolocation {
    readonly geo: {
        readonly uuid: string;
        readonly layerKey: string;
        readonly geometries: {
            readonly type: string;
            readonly coordinates: any[];
        }[];
    }[];
}
