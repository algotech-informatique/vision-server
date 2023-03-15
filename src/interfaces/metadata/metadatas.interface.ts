import { Lang } from '../lang/lang.interface';

export interface MetaDatas {
    readonly uuid: string;
    readonly key: string;
    readonly displayName: Lang[];
    readonly value: string;
}
