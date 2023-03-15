export interface WorkflowsSettingsSecurityGroup {
    readonly role: {
        readonly uuid: string;
        readonly name: string;
        readonly color: string;
    };
    readonly group: string;
    readonly login: string;
}
