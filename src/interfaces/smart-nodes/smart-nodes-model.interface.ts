import { BaseDocument } from '../base/base.interface';
import { LangDto } from '@algotech/core';
import { SnVersion } from './smart-nodes-version.interface';

export interface SnModel extends BaseDocument {

    readonly key: string;
    readonly displayName: LangDto[];
    readonly dirUuid?: string;
    readonly type: string;
    readonly publishedVersion?: string;
    readonly versions: SnVersion[];

}
