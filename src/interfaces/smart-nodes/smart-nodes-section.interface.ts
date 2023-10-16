import { SnParam } from './smart-nodes-param.interface';
import { Lang } from '../lang/lang.interface';

export interface SnSection {
    readonly id: string;
    readonly displayName: Lang[] | string;
    readonly key: string;
    readonly editable: boolean;
    readonly open: boolean;
    readonly hidden: boolean;
    readonly params: SnParam[];
}
