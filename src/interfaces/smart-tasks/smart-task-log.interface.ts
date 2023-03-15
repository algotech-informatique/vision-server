import { BaseDocument } from '../base/base.interface';

export interface SmartTaskLog extends BaseDocument {
    smartTaskUuid: string;
    runAt: string;
    finishAt: string;
    status: 'success' | 'failure' | 'start';
    failureMsg?: string;
}
