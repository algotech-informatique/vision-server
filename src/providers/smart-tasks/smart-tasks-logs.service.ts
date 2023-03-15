import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SmartTaskLog } from '../../interfaces';
import { BaseService } from '../@base/base.service';

@Injectable()
export class SmartTasksLogsService extends BaseService<SmartTaskLog> {
 
    constructor(@InjectModel('agendaJobsLogs') private readonly AgendaJobsLog: Model<SmartTaskLog>) {
        super(AgendaJobsLog);
    }

    UpdateByJob(customerKey: string, taskLog: SmartTaskLog): Observable<any> {
        const filter: FilterQuery<any> = { customerKey, runAt: taskLog.runAt, smartTaskUuid: taskLog.smartTaskUuid, deleted: false };
        return from(this.AgendaJobsLog.find<SmartTaskLog[]>(filter, { _id: 0, __v: 0, deleted: 0 })).pipe(
            mergeMap((data: SmartTaskLog[]) => {
                return (data.length !== 0) ? this._updateJob(customerKey, taskLog, data) : super.create(customerKey, taskLog);
            }),
        );
    }

    _updateJob(customerKey: string, taskLog: SmartTaskLog, data: SmartTaskLog[]): Observable<SmartTaskLog> {
        data[0].finishAt = taskLog.finishAt;
        data[0].status = taskLog.status;
        data[0].failureMsg = taskLog.failureMsg;

        return super.update(customerKey, data[0]);
    }
    
}
