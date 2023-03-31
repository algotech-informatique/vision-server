import { Injectable } from '@nestjs/common';
import { WorkflowServiceService } from './workflow-service.service';
import { WorkflowProfilesService } from '../workflow-profiles/workflow-profiles.service';
import { WorkflowAbstractService } from '../../workflow-abstract/workflow-abstract.service';
import { InterpretorTask } from '@algotech-ce/interpretor';
import { WorkflowUtilsService } from '../../workflow-utils/workflow-utils.service';
import { WorkflowMetricsService } from '../../workflow-metrics/workflow-metrics.service';

@Injectable()
export class WorkflowTaskService extends InterpretorTask {
    constructor(
        protected workflowUtilsService: WorkflowUtilsService,
        protected workflowServiceService: WorkflowServiceService,
        protected workflowProfilsService: WorkflowProfilesService,
        protected workflowAbstractService: WorkflowAbstractService,
        protected workflowMetricsService: WorkflowMetricsService) {
        super(workflowUtilsService, workflowServiceService, workflowProfilsService, workflowAbstractService, workflowMetricsService);
    }
}
