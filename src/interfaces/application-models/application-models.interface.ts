import { BaseDocument } from '../base/base.interface';
import { Lang } from '../lang/lang.interface';
import { SnApp } from '../smart-nodes/smart-nodes-app.interface';

export interface ApplicationModel extends BaseDocument {
    readonly key: string;
    readonly snModelUuid?: string;
    readonly appId?: string;
    readonly appVersion?: number;
    readonly displayName: Lang[];
    readonly description: Lang[];
    readonly environment: string;
    readonly snApp: SnApp;
}
