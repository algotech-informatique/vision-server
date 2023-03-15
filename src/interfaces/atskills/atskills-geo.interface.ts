import { Geometry } from './atskills-geometry.interface';

export interface Geo {
    readonly uuid: string;
    readonly layerKey: string;
    readonly geometries: Geometry[];
}
