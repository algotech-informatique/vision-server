import { Injectable } from '@nestjs/common';
import { WorkflowUtilsService } from '../../workflow-utils/workflow-utils.service';
import { InterpretorProfiles } from '@algotech-ce/interpretor';

@Injectable()
export class WorkflowProfilesService extends InterpretorProfiles {
    constructor(
        protected workflowUtils: WorkflowUtilsService) {
        super(workflowUtils);
    }
}
