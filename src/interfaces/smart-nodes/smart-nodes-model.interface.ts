import { Lang } from 'interfaces/lang/lang.interface';
import { BaseDocument } from '../base/base.interface';
import { SnVersion } from './smart-nodes-version.interface';

export interface SnModel extends BaseDocument {
    readonly key: string;
    readonly displayName: Lang[];
    readonly dirUuid?: string;
    readonly type: string;
    readonly publishedVersion?: string;
    readonly versions: SnVersion[];
}
