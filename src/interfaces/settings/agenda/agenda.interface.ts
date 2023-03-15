import { Lang } from '../../lang/lang.interface';
import { ScheduleTypeDisplay } from './scheduler/schedule-type-display.interface';
import { ScheduleWorkflow } from '../../scheduler/schedule-workflow.interface';
import { ScheduleReceiver } from '../../scheduler/schedule-receiver.interface';
export interface AgendaSettings {
    key: string;
    owner: string;
    workflowUuid: string;
    displayName: Lang[];
    displays: ScheduleTypeDisplay[];
    defaultWorkflowModels: ScheduleWorkflow[];
    defaultReceivers: ScheduleReceiver[];
    defaultTags: string[];
    attribuable: boolean;
    attributionMaxNumber: number;
    statutGroupList: string;
}
