import { Injectable } from '@nestjs/common';
import { WorkflowAbstractService } from '../../workflow-abstract/workflow-abstract.service';
import { InterpretorSo } from '@algotech/interpretor';
import { SoUtilsService } from '../../@utils/so-utils.service';

@Injectable()
export class WorkflowSoService extends InterpretorSo {
    constructor(
        protected soUtilsService: SoUtilsService,
        protected workflowAbstract: WorkflowAbstractService) {
        super(soUtilsService, workflowAbstract);
    }
}
