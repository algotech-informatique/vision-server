export interface GroupApplication {
    readonly authorized: string[];
    readonly default: {
        readonly mobile: string;
        readonly web: string;
    };
}
