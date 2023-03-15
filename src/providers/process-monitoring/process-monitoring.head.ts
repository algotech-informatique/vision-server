import { ProcessMonitoringSearchDto, ProcessMonitoringType } from '@algotech/core';
import { Injectable } from '@nestjs/common';
import { ProcessMonitoring } from 'interfaces/process-monitoring/process-monitoring.interface';
import { ProcessMonitoringService } from './process-monitoring.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class ProcessMonitoringHead {
    constructor(
        private readonly processMonitoringService: ProcessMonitoringService,
    ) { }

    create(customerKey: string, process: ProcessMonitoring): Observable<ProcessMonitoring> {
        return this.processMonitoringService.create(customerKey, process, process.uuid != null);
    }

    update(customerKey: string, process: ProcessMonitoring): Observable<ProcessMonitoring> {
        return this.processMonitoringService.update(customerKey, process);
    }

    list(customerKey: string, processSearch: ProcessMonitoringSearchDto, skip, limit,
        processType?: ProcessMonitoringType): Observable<ProcessMonitoring[]> {
        const numskip = skip ? +skip : 0;
        const numlimit = limit ? +limit : 10;
        let filters = { deleted: false };
        const sort = {
            createdDate: -1
        };
        _.assign(filters,
            processSearch.byUuids && processSearch.byUuids.length > 0 ? { uuid: { $in: processSearch.byUuids } } : {},
            processSearch.byProcessState && processSearch.byProcessState.length > 0 ? { processState: processSearch.byProcessState } : {},
            processType ? { processType } : {});

        return this.processMonitoringService.list(customerKey, filters, sort, numskip, numlimit);
    }

    cancelAllRunningProcess(): Observable<any> {
        return this.processMonitoringService.cancelAllRunningProcess();
    }
}