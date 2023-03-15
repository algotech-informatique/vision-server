import { Lang } from '../../lang/lang.interface';
import { PlanLayersSettings } from './plan-layers-settings.interface';
import { MetaDatas } from '../../metadata/metadatas.interface';

export interface PlanContainersSettings {
    readonly uuid: string;
    readonly displayName: Lang[];
    readonly description: Lang[];
    readonly metadataSoUuid: string;
    readonly imageIds: string[];
    readonly parentUuid: string;
    readonly defaultLayer?: string;
    readonly layers: PlanLayersSettings[];
    readonly metadatas: MetaDatas[];
}
