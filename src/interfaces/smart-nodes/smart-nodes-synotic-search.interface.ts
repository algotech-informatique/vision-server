import { BaseDocument } from 'interfaces/base/base.interface';
import { Lang } from 'interfaces/lang/lang.interface';

export interface SnSynoticSearch extends BaseDocument {
    key: string;
    snModelUuid: string;
    snVersionUuid: string;
    snViewUuid: string;
    elementUuid: string;
    displayName: Lang[] | string;
    type: 'page' | 'widget' | 'node' | 'view' | 'app' | 'box' | 'group' | 'comment' | 'report';
    connectedTo: string[];
    texts: string;
}
