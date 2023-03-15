import { WorkflowsSettingsSecurityGroup } from './workflows-settings-security-group.interface';

export interface WorkflowsSettings {
    readonly actionBinding: string;
    readonly owner: string;
    readonly securityGroup: WorkflowsSettingsSecurityGroup[];
    readonly workflowUuid: string;
}

