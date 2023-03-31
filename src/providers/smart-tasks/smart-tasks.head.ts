import { SmartTaskDto } from '@algotech-ce/core';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentityRequest, SmartTask, SmartTaskLog } from '../../interfaces';
import { SmartTasksService } from './smart-tasks.service';

@Injectable()
export class SmartTasksHead {
    constructor(
        private readonly smartTaskService: SmartTasksService,
    ) { }

    unlockAndBindJobs(customerKey?: string): Observable<boolean> {
        return this.smartTaskService.unlockAndBindJobs(customerKey);
    }

    stop(data: { identity: IdentityRequest, smartTask: SmartTaskDto }): Observable<boolean> {
        return this.smartTaskService.stop();
    }

    start(data: { identity: IdentityRequest, smartTask: SmartTaskDto }): Observable<boolean> {
        return this.smartTaskService.start();
    }

    create(data: { identity: IdentityRequest, smartTaskDto: SmartTaskDto }): Observable<SmartTask> {
        return this.smartTaskService.create(data.identity.customerKey, data.smartTaskDto);
    }

    findAll(data: { identity: IdentityRequest, skip: number, limit: number, sort?: string,
        order?: string, status?: string }): Observable<SmartTask[]> {

        return  this.smartTaskService.findAll(data.identity.customerKey, data.skip, data.limit, data.sort, data.order, data.status);
    }

    deleteByFlowKey(data: { identity: IdentityRequest, flowKey: string }): Observable<{ acknowledged: boolean }[]> {
        return this.smartTaskService.deleteByFlowKey(data.identity.customerKey, data.flowKey);
    }

    delete(data: { identity: IdentityRequest, uuid: string }): Observable<{ acknowledged: boolean }> {
        return this.smartTaskService.delete(data.identity.customerKey, data.uuid);
    }

    update(data: { identity: IdentityRequest, uuid: string, updateSmartTask: SmartTaskDto }): Observable<SmartTask> {
        return this.smartTaskService.update(data.identity.customerKey, data.uuid, data.updateSmartTask);
    }

    setState(data: { identity: IdentityRequest, uuid: string, isEnabled: boolean }): Observable<{ acknowledged: boolean }> {
        return this.smartTaskService.setState(data.identity.customerKey, data.uuid, data.isEnabled).pipe(
                map((saved) => ({ acknowledged: saved })));
    }

    findLogsForSmartTask(data: { identity: IdentityRequest, uuid: string }): Observable<SmartTaskLog[]> {
        return this.smartTaskService.findLogsForSmartTask(data.identity.customerKey, data.uuid);
    }

    findByUuid(data: { identity: IdentityRequest, uuid: string }): Observable<SmartTask> {
        return this.smartTaskService.findByUuid(data.identity.customerKey, data.uuid);
    }
}
