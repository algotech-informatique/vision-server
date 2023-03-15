export interface EnvironmentDirectory {
    readonly uuid: string;
    readonly name: string;
    readonly custom: any;
    readonly subDirectories: EnvironmentDirectory[];
}
