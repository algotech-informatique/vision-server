import { Injectable } from '@nestjs/common';
import { ScheduleUtils } from '@algotech-ce/interpretor';
import { WorkflowAbstractService } from '../workflow-abstract/workflow-abstract.service';

@Injectable()
export class ScheduleUtilsService extends ScheduleUtils {
    constructor(protected workflowAbstractServie: WorkflowAbstractService) {
        super(workflowAbstractServie);
    }
}
