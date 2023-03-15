export interface WorkflowApiModel {
    readonly route: string;
    readonly type: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
    readonly auth: {
        readonly jwt: boolean;
        readonly webhook?: any;
        readonly groups?: string[];
    };
    readonly description: string;
    readonly summary: string;
    readonly result: {
        readonly code: string;
        readonly description: string;
        readonly content: string;
        readonly multiple: boolean;
        readonly type: string;
    }[];
}
