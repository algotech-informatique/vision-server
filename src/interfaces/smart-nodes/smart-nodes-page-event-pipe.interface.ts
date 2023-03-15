export interface SnPageEventPipe {
    readonly id: string;
    readonly key?: string;
    readonly type: string;
    readonly action?: string;
    readonly inputs: {
        readonly key: string;
        readonly value: any;
    }[];
    readonly custom?: any;
}
