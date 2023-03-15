import { Injectable } from '@nestjs/common';
import { WorkflowInstanceDto } from '@algotech/core';
import { InterpretorSave } from '@algotech/interpretor';
import { WorkflowDataService } from '../workflow-data/workflow-data.service';

@Injectable()
export class WorkflowSaveService extends InterpretorSave {

    constructor(private workflowDataService: WorkflowDataService) {
        super();
    }

    public save(instance: WorkflowInstanceDto) {
        return this.workflowDataService.save(instance);
    }
}
