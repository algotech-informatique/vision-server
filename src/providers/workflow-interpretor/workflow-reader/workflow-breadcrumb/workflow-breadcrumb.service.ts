import { Injectable } from '@nestjs/common';
import { WorkflowUtilsService } from '../../workflow-utils/workflow-utils.service';
import { BreadCrumbDto, InterpretorBreadCrumb } from '@algotech-ce/interpretor';
import { WorkflowInstanceDto } from '@algotech-ce/core';

@Injectable()
export class WorkflowBreadCrumbService extends InterpretorBreadCrumb {

    constructor(protected workflowUtils: WorkflowUtilsService) {
        super(workflowUtils);
    }

    calculateStepBreadCrumb(instance: WorkflowInstanceDto): BreadCrumbDto[] {
        return [];
    }
    calculateTaskBreadCrumb(instance: WorkflowInstanceDto): BreadCrumbDto[] {
        return [];
    }
}
