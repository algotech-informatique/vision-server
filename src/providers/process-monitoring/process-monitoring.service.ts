import { Injectable } from '@nestjs/common';
import { BaseService } from '../@base/base.service';
import { ProcessMonitoring } from 'interfaces/process-monitoring/process-monitoring.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { Filter } from 'mongodb';

@Injectable()
export class ProcessMonitoringService extends BaseService<ProcessMonitoring> {

    constructor(@InjectModel('ProcessMonitoring') private readonly ProcessMonitoringModel: Model<ProcessMonitoring>) {
        super(ProcessMonitoringModel);
    }

    cancelAllRunningProcess(): Observable<any> {
        const filter: Filter<ProcessMonitoring> = { processState: 'inProgress' };
        return from(this.ProcessMonitoringModel.bulkWrite([
            {
                updateMany: {
                    filter,
                    update: { $set: { processState: 'canceled', result: {}, updateDate: new Date().toISOString() } }
                }
            }
        ]))
    }

}