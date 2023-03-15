import { Lang } from '../lang/lang.interface';

export interface Tag {
    readonly uuid: string;
    readonly key: string;
    readonly displayName: Lang[];
    readonly color: string;
}
