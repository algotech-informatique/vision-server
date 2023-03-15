import { IdentityRequest, CustomerInit, SnModel, CustomerInitResult } from '../../interfaces';
import { Injectable, BadRequestException } from '@nestjs/common';
import { SmartNodesService } from './smart-nodes.service';
import { Observable, of, zip } from 'rxjs';
import { catchError, delayWhen, mergeMap } from 'rxjs/operators';
import { PatchPropertyDto } from '@algotech/core';
import { WorkflowModelsHead } from '../workflow-models/workflow-models.head';
import { SmartFlowsHead } from '../smart-flows/smart-flows.head';
import { ApplicationModelsHead } from '../application-models/application-models.head';

@Injectable()
export class SmartNodesHead {

    constructor(
        private readonly workflowModelsHead: WorkflowModelsHead,
        private readonly smartFlowsHead: SmartFlowsHead,
        private readonly applicationModelsHead: ApplicationModelsHead,
        private readonly smartNodesService: SmartNodesService,
    ) { }

    find(
        data: { identity: IdentityRequest; skip?: number; limit?: number; uuid?: string; key?: string },
    ): Observable<SnModel | SnModel[] > {
        if (data.uuid) {
            return this.smartNodesService.findOne(data.identity.customerKey, data.uuid);
        } else if (data.key) {
            return this.smartNodesService.findOneByKey(data.identity.customerKey, data.key);
        } else {
            return this.smartNodesService.getAll(data.identity.customerKey);
        }
    }

    init(data: { customer: CustomerInit }): Observable<CustomerInitResult> {
        return this.smartNodesService.init(data.customer);
    }

    create(data: { identity: IdentityRequest; data: SnModel }): Observable<SnModel> {
        return this.smartNodesService.create(data.identity.customerKey, data.data);
    }

    cache(data: { identity: IdentityRequest, date: string }) {
        return this.smartNodesService.cache(data.identity.customerKey, data.date);
    }

    update(data: { identity: IdentityRequest; data: SnModel }): Observable<SnModel> {
        return this.smartNodesService.update(data.identity.customerKey, data.data);
    }

    patch(data: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {
        const obsPatches = this.smartNodesService.patchByUuid(data.identity.customerKey, data.data.uuid, data.data.patches);
        return obsPatches;
    }

    delete(data: { identity: IdentityRequest; data: string }): Observable<boolean> {

        const obsDelete$ = this.smartNodesService.findOne(data.identity.customerKey, data.data).pipe(
            catchError((err) => {
                return of(false);
            }),
            mergeMap((model: SnModel) => {
                if (model) {
                    return this.smartNodesService.delete(data.identity.customerKey, data.data).pipe(
                        delayWhen((deleted: boolean) => {
                            return this.deleteLinkedObjects(data.identity, data.data);
                        }),
                    );
                } else {
                    return of(false);
                }
            }),
        );
        return obsDelete$.pipe(
            mergeMap((result: boolean) => {
                if (result === true) {
                    return of(result);
                } else {
                    throw new BadRequestException('Delete snModel failed');
                }
            },
        ));
    }

    private deleteLinkedObjects(identity: IdentityRequest, snModelUuid: string): Observable<any> {
        return zip(
            this.smartFlowsHead.delete({ identity, snModelUuid }).pipe(catchError(() => of({}))),
            this.workflowModelsHead.delete({ identity, snModelUuid }).pipe(catchError(() => of({}))),
            this.applicationModelsHead.delete({ identity, snModelUuid }).pipe(catchError(() => of({}))),
        );
    }

}
