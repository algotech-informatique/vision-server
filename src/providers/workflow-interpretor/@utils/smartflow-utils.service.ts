import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WorkflowInstanceContextDto, WorkflowLaunchOptionsDto } from '@algotech-ce/core';
import { Observable, throwError } from 'rxjs';
import { ATHttpException, SmartFlowUtils } from '@algotech-ce/interpretor';
import { catchError, map } from 'rxjs/operators';
import { DatabaseService } from '../../database/database.service';
import { WorkflowMessageService } from '../workflow-message/workflow-message.service';
import { SmartFlowsHead } from '../../smart-flows/smart-flows.head';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class SmartFlowUtilsService extends SmartFlowUtils {

    constructor(
        private workflowMessageService: WorkflowMessageService,
        private databaseService: DatabaseService,
        private moduleRef: ModuleRef) {
        super();
    }

    start(
        launchOptions: WorkflowLaunchOptionsDto,
        context: WorkflowInstanceContextDto): Observable<any> {

        return this.moduleRef.get(SmartFlowsHead).startSmartFlow(
            this.workflowMessageService.payload(context, { launchOptions })).pipe(
                catchError((e: Error) => {
                    if (e instanceof HttpException) {
                        return throwError(() => new ATHttpException(launchOptions.key, e.getStatus(), e.getResponse(), ''));
                    }
                    return throwError(() => new ATHttpException(launchOptions.key, HttpStatus.INTERNAL_SERVER_ERROR, e.message, ''));
                })
            );
    }

    dbRequest(connection: any, request: string): Observable<any> {
        return this.databaseService.dbRequest(connection, request);
    }
}
