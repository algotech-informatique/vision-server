import { Injectable } from '@nestjs/common';
import { SkillsUtils } from '@algotech/interpretor';
import { SoUtilsService } from './so-utils.service';
import { SmartObjectsHead } from '../../smart-objects/smart-objects.head';
import { SmartObjectDto, WorkflowInstanceContextDto } from '@algotech/core';
import { WorkflowMessageService } from '../workflow-message/workflow-message.service';
import { Observable } from 'rxjs';

@Injectable()
export class SkillsUtilsService extends SkillsUtils {
    constructor(
        private soUtilsService: SoUtilsService,
        private smartObjectsHead: SmartObjectsHead,
        private workflowMessageService: WorkflowMessageService) {
        super(soUtilsService);
    }

    getMagnets(appKey: string, boardInstance: string, zoneKey: string, context: WorkflowInstanceContextDto): Observable<SmartObjectDto[]> {
        return this.smartObjectsHead.magnets(this.workflowMessageService.payload(context, { appKey, boardInstance, zoneKey }));
    }
}
