import { SnPageEventPipeSmartflowResult } from './smart-nodes-page-event-pipe-smartflow-result.interface';
export interface SnPageEventPipe {
    readonly id: string;
    readonly key?: string;
    readonly type: string;
    readonly action?: string;
    readonly inputs: {
        readonly key: string;
        readonly value: any;
    }[];
    smartflowResult?: SnPageEventPipeSmartflowResult;
    readonly custom?: any;
}
