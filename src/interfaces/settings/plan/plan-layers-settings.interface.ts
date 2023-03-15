import { Lang } from '../../lang/lang.interface';
import { PlanLayersRastersSettings } from './plan-layers-rasters-settings.interface';
import { MetaDatas } from '../../metadata/metadatas.interface';
import { PlanLayersIframeSettings } from './plan-layers-iframe-settings.interface';

export interface PlanLayersSettings {
    readonly layerType: 'mapWorld' | 'mapCustom' | 'iframe';
    readonly uuid: string;
    readonly key: string;
    readonly displayName: Lang[];
    readonly rasters: PlanLayersRastersSettings[];
    readonly defaultZoom: number;
    readonly zoomMin: number;
    readonly zoomMax: number;
    readonly defaultCenter: number[];
    readonly defaultRaster: string;
    readonly clustersMode?: boolean;
    readonly metadatas: MetaDatas[];
    readonly iframe?: PlanLayersIframeSettings;
}
