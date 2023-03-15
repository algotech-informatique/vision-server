import { BaseDocument } from '../base/base.interface';

export interface Notification extends BaseDocument {
    readonly title: string;
    readonly content: string;
    readonly additionalInformation: string;
    readonly icon: string;
    readonly author: string;
    readonly date: Date;
    readonly comment: string;
    readonly action: {
        readonly key: string,
        readonly object: string,
    };
    readonly state: {
        readonly from: string,
        readonly to: string[],
        readonly read: string[],
        readonly execute: string,
    };
    readonly channels?: string[],
}
