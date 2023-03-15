export interface WorkflowOperation {
    readonly type: string;
    readonly value: any;
    readonly saveOnApi: boolean;
}
