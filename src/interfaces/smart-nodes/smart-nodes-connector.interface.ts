import { Lang } from '../lang/lang.interface';

export interface SnConnector {

    readonly id: string;
    readonly key?: string;
    readonly displayName?: Lang[] | string;
    readonly direction?: 'in' | 'out';
    readonly toward?: string;
    readonly custom?: any;

}
