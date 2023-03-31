import { Injectable } from '@nestjs/common';
import { InterpretorUtils } from '@algotech-ce/interpretor';
import { ReportsUtilsService } from '../@utils/reports-utils.service';
import { ScheduleUtilsService } from '../@utils/schedule-utils.service';
import { SkillsUtilsService } from '../@utils/skills-utils.service';
import { SoUtilsService } from '../@utils/so-utils.service';
import { SysUtilsService } from '../@utils/sys-utils.service';
import { WorkflowServiceService } from '../workflow-reader/workflow-task/workflow-service.service';
import { SmartFlowUtilsService } from '../@utils/smartflow-utils.service';
import { TaskUtilsService } from '../@utils/task-utils.service';

@Injectable()
export class WorkflowUtilsService extends InterpretorUtils {
    constructor(
        protected workflowServiceService: WorkflowServiceService,
        protected reportUtilsService: ReportsUtilsService,
        protected scheduleUtilsService: ScheduleUtilsService,
        protected skillsUtilsService: SkillsUtilsService,
        protected soUtilsService: SoUtilsService,
        protected sysUtilsService: SysUtilsService,
        protected smartFlowUtilsService: SmartFlowUtilsService,
        protected TaskUtilsService: TaskUtilsService) {
        super(workflowServiceService, reportUtilsService,
            scheduleUtilsService, skillsUtilsService, soUtilsService,
            sysUtilsService, smartFlowUtilsService, TaskUtilsService);
    }
}
