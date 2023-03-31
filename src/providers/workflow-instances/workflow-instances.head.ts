import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { WorkflowInstancesService } from './workflow-instances.service';
import { PatchPropertyDto, PairDto, WorkflowOperationDto, WorkflowInstanceContextDto, WorkflowInstanceAbstractDto } from '@algotech-ce/core';
import { WorkflowDataApiService } from '../workflow-interpretor/workflow-data/workflow-data-api.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { IdentityRequest, WorkflowInstance } from '../../interfaces';
import { WorkflowMessageService } from '../workflow-interpretor';

@Injectable()
export class WorkflowInstancesHead {
    constructor(
        private readonly workflowMessage: WorkflowMessageService,
        private readonly workflowInstancesService: WorkflowInstancesService,
        private readonly workflowDataApiService: WorkflowDataApiService,
    ) { }

    create(ws: { identity: IdentityRequest, data }): Observable<boolean> {
        return this.workflowInstancesService.create(ws.identity.customerKey, ws.data, true).pipe(
            map(() => true)
        );
    }

    find(data: {
        identity: IdentityRequest;
        uuid?: string;
        data?: { uuid: string[], data: PairDto[] };
    }): Observable<WorkflowInstance | WorkflowInstance[] | WorkflowInstanceAbstractDto[]> {
        if (data.uuid) {
            return this.workflowInstancesService.findOne(data.identity.customerKey, data.uuid);
        } else if (data.data) {
            return this.workflowInstancesService.findAllbyModel(data.identity.customerKey, data.data);
        } else {
            return this.workflowInstancesService.findAll(data.identity.customerKey);
        }
    }

    delete(ws: { identity: IdentityRequest, data }): Observable<boolean> {
        return this.workflowInstancesService.delete(ws.identity.customerKey, ws.data);
    }

    update(data: {
        identity: IdentityRequest;
        updateWorkflowInstance: WorkflowInstance;
    }): Observable<boolean> {
        return this.workflowInstancesService.update(data.identity.customerKey, data.updateWorkflowInstance, true).pipe(
            map(() => true)
        );
    }

    patch(data: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {
        return this.workflowInstancesService.patchProperty(data.identity.customerKey, data.data.uuid,
            data.data.patches);
    }

    save(data: { identity: IdentityRequest, operations: WorkflowOperationDto[] }) {
        return this.workflowMessage.initializeContext(data.identity, 'workflow').pipe(
            mergeMap((context: WorkflowInstanceContextDto) => this.workflowDataApiService.zipOperations(data.operations, context)),
        );
    }
}
