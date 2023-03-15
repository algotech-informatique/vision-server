export interface WorkflowVariableModel {
    readonly uuid: string;
    readonly key: string;
    readonly type: string;
    readonly multiple: boolean;
    readonly required?: boolean;
    readonly deprecated?: boolean;
    readonly allowEmpty?: boolean;
    readonly use?: 'header' | 'url-segment' | 'query-parameter' | 'body' | 'formData';
    readonly description?: string;
}
