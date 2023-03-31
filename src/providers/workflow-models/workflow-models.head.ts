import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkflowModelsService } from './workflow-models.service';
import { Observable, of, throwError } from 'rxjs';
import { PatchPropertyDto } from '@algotech-ce/core';
import { mergeMap } from 'rxjs/operators';
import { IdentityRequest, WorkflowModel } from '../../interfaces';

@Injectable()
export class WorkflowModelsHead {
    constructor(
        private readonly workflowModelsService: WorkflowModelsService,
    ) { }

    create(ws: { identity: IdentityRequest, data }): Observable<WorkflowModel> {
        return this.workflowModelsService.create(ws.identity.customerKey, ws.data);
    }

    cache(data: { identity: IdentityRequest, date: string }) {
        return this.workflowModelsService.cache(data.identity.customerKey, data.date);
    }

    find(data: {
        identity: IdentityRequest;
        uuid?: string;
        key?: string;
        snModelUuid?: string;
    }): Observable<WorkflowModel | WorkflowModel[]> {
        if (data.uuid) {
            return this.workflowModelsService.findOne(data.identity.customerKey, data.uuid);
        } else if (data.key) {
            return this.workflowModelsService.findOneByKey(data.identity.customerKey, data.key);
        } else if (data.snModelUuid) {
            return this.workflowModelsService.findOneBySnModel(data.identity.customerKey, data.snModelUuid).pipe(
                mergeMap((smartflow) => {
                    if (!smartflow) {
                        throw new BadRequestException('No workflow linked to this Model');
                    }
                    return of(smartflow);
                }),
            );
        }
        else {
            return this.workflowModelsService.findAll(data.identity.customerKey);
        }
    }

    delete(ws: { identity: IdentityRequest, data?, snModelUuid?: string }): Observable<boolean> {
        const obsDelete = (ws.data) ? this.workflowModelsService.delete(ws.identity.customerKey, ws.data) :
            this.workflowModelsService.deleteBySnModel(ws.identity.customerKey, ws.snModelUuid);
        return obsDelete.pipe(
            mergeMap((result: boolean) => {
                if (result === true) {
                    return of(result);
                } else {
                    return throwError(() => new BadRequestException('Delete WorkFlow faile'));
                }
            },
            ));
    }

    patch(ws: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {
        return this.workflowModelsService.patchProperty(ws.identity.customerKey, ws.data.uuid, ws.data.patches);
    }

    publish(data: { identity: IdentityRequest, workflow: WorkflowModel }): Observable<WorkflowModel> {
        return this.workflowModelsService.publish(data.identity.customerKey, data.workflow);
    }
}
