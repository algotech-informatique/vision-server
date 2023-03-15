import { WorkflowEventParameter } from '../settings/workflow/workflow-event-parameter.interface';
import { WorkflowSettingsSecurityGroup } from '../settings/workflow/workflow-settings-security-group.interface';

export interface ScheduleWorkflow {

    workflowUuid: string;
    parameters: WorkflowEventParameter[];
    profils: WorkflowSettingsSecurityGroup[];
}
