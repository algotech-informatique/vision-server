import { Lang } from '../lang/lang.interface';

export interface GenericListValue {
    readonly key: string;
    readonly value: Lang[];
    readonly index: number;
}
