import { Injectable } from '@nestjs/common';
import { WorkflowReaderService } from './workflow-reader/workflow-reader.service';
import { WorkflowUtilsService } from './workflow-utils/workflow-utils.service';
import { WorkflowDataService } from './workflow-data/workflow-data.service';
import { WorkflowSaveService } from './workflow-save/workflow-save.service';
import { Interpretor } from '@algotech-ce/interpretor';
import { WorkflowSoService } from './workflow-reader/workflow-so/workflow-so.service';
import { WorkflowMetricsService } from './workflow-metrics/workflow-metrics.service';

@Injectable()
export class WorkflowInterpretorService extends Interpretor {
    constructor(
        protected worfklowSoService: WorkflowSoService,
        protected workflowReaderService: WorkflowReaderService,
        protected workflowUtilsService: WorkflowUtilsService,
        protected workflowDataService: WorkflowDataService,
        protected workflowSaveService: WorkflowSaveService,
        protected workflowMetricsService: WorkflowMetricsService) {

        super(worfklowSoService, workflowReaderService, workflowUtilsService, workflowDataService, workflowSaveService, workflowMetricsService);
    }
}
