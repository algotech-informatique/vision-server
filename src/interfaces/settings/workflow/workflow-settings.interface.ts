import { WorkflowSettingsSecurityGroup } from './workflow-settings-security-group.interface';

export interface WorkflowSettings {
    readonly uuid: string;
    readonly context: string;
    readonly platforms: string[];
    readonly filters: {
        readonly filterKey: string;
        readonly filterValue: any;
    }[];
    readonly securityGroup: WorkflowSettingsSecurityGroup[];
    readonly workflowUuid: string;
    readonly savingMode: string;
    readonly unique: boolean;
}
