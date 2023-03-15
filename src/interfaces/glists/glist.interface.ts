import { Lang } from '../lang/lang.interface';
import { GenericListValue } from './glist-value.interface';
import { BaseDocument } from '../base/base.interface';

export interface GenericList extends BaseDocument {
    readonly key: string;
    readonly displayName: Lang[];
    readonly protected: boolean;
    readonly values: GenericListValue[];
}
