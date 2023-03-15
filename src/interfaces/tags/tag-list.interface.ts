import { BaseDocument } from '../base/base.interface';
import { Lang } from '../lang/lang.interface';
import { Tag } from './tag.interface';

export interface TagList extends BaseDocument {
    readonly key: string;
    readonly displayName: Lang[];
    readonly modelKeyApplication: string[];
    readonly applyToDocuments: boolean;
    readonly applyToImages: boolean;
    readonly tags: Tag[];
}
