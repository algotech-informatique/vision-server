import { ScheduleStatusSearch } from './schedule-status-search';
import { ScheduleReceiversSearch } from './schedule-receivers-search';
import { ScheduleWorkflowsSearch } from './schedule-workflows-search';
import { ScheduleActivitiesSearch } from './schedule-activities-search';
import { DateRange } from '../../base/base.dateRange';

export class ScheduleSearch {

    uuid: string[];
    creationDate?: DateRange[];
    beginPlannedDate?: DateRange[];
    endPlannedDate?: DateRange[];
    soUuid?: string[];
    scheduleTypeKey?: string[];
    tags?: string[];
    assignedUserUuid?: string[];
    title?: string[];
    emitterUuid?: string[];
    source?: string[];
    repetitionMode?: string[];

    scheduleStatus?: ScheduleStatusSearch;

    receivers?: ScheduleReceiversSearch;

    workflows?: ScheduleWorkflowsSearch;

    activities?: ScheduleActivitiesSearch;
}
