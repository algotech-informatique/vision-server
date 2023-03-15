import { BaseDocument } from '../base/base.interface';
import { ScheduleWorkflow } from './schedule-workflow.interface';
import { ScheduleReceiver } from './schedule-receiver.interface';
import { ScheduleActivity } from './schedule-activity.interface';

export interface Schedule extends BaseDocument {

    scheduleTypeKey: string;
    title: string;
    beginPlannedDate: Date;
    endPlannedDate: Date;
    emitterUuid: string;
    receivers: ScheduleReceiver[];
    soUuid: string[];
    workflows: ScheduleWorkflow[];
    repetitionMode: string;
    scheduleStatus: string;
    tags: string[];
    assignedUserUuid?: string[];
    activities: ScheduleActivity[];
    source: string;
}
