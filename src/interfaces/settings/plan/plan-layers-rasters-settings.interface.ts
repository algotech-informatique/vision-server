import { Lang } from '../../lang/lang.interface';

export interface PlanLayersRastersSettings {
    readonly uuid: string;
    readonly key: string;
    readonly backgroundColor: string;
    readonly displayName: Lang[];
    readonly url?: string;
}
