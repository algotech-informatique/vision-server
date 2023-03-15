import { Injectable } from '@nestjs/common';
import { WorkflowProfilesService } from './workflow-profiles/workflow-profiles.service';
import { WorkflowTaskService } from './workflow-task/workflow-task.service';
import { WorkflowUtilsService } from '../workflow-utils/workflow-utils.service';
import { WorkflowBreadCrumbService } from './workflow-breadcrumb/workflow-breadcrumb.service';
import { WorkflowSoService } from './workflow-so/workflow-so.service';
import { WorkflowAbstractService } from '../workflow-abstract/workflow-abstract.service';
import { InterpretorReader } from '@algotech/interpretor';
import { WorkflowMetricsService } from '../workflow-metrics/workflow-metrics.service';
import { WorkflowInstanceDto } from '@algotech/core';

@Injectable()
export class WorkflowReaderService extends InterpretorReader {

    constructor(
        protected workflowProfilService: WorkflowProfilesService,
        protected workflowTaskService: WorkflowTaskService,
        protected workflowBreadCrumbService: WorkflowBreadCrumbService,
        protected workflowUtilsService: WorkflowUtilsService,
        protected workflowSoService: WorkflowSoService,
        protected workflowAbstractService: WorkflowAbstractService,
        protected workflowMetricsService: WorkflowMetricsService) {

        super(workflowProfilService, workflowTaskService, workflowBreadCrumbService,
            workflowUtilsService, workflowSoService, workflowAbstractService, workflowMetricsService);
    }
    
    get date() {
        return null;
    }

    generateId(instance: WorkflowInstanceDto) {
        return (instance.stackTasks.length - 1).toString();
    }
}
