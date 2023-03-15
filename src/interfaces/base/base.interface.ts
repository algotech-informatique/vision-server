export interface BaseDocument {
    readonly uuid: string;
    readonly customerKey: string;
    readonly deleted: boolean;
    readonly createdDate?: string;
    readonly updateDate?: string;
}
