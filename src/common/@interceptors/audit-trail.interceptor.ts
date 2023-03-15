import {
    NestInterceptor, ExecutionContext, CallHandler, Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { Reflector } from '@nestjs/core';
import { SmartObjectDto } from '@algotech/core';
import { AuditTrailHead, LokiLogger } from '../../providers';
import { AuditLog, IdentityRequest } from '../../interfaces';
import { identityDecode } from '../@decorators';

@Injectable()
export class AuditTrailInterceptor implements NestInterceptor {

    private mapping = {
        AuthController: 'auth',
        UsersController: 'user',
        GroupsController: 'group',
        CustomersController: 'customer',
        SettingsController: 'settings',
        DocumentsController: 'document',
        SmartObjectsController: 'smart-object',
        SmartModelsController: 'smart-model',
        WorkflowModelsController: 'workflow-model',
        WorkflowInstancesController: 'workflow-instance',
        GenericListsController: 'generic-list',
        TagsController: 'tags',
        NotificationsController: 'notifications',
        SchedulerController: 'schedules',
        EmailController: 'email',
        FilesController: 'files',
        SmartTasksController: 'smart-task',
        StoreController: 'store',
    };

    constructor(
        private reflector: Reflector,
        private auditTrailService: AuditTrailHead,
        private readonly LOG: LokiLogger,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = Date.now();
        return next.handle()
            .pipe(
                tap((handlerData) => {
                    return this.handleLog({ context, handlerData, start });
                },
                    (err) => {
                        return this.handleLog({ context, err, start });
                    }),
            );

    }

    private handleLog(data: { context, handlerData?, err?, start }) {
        const actionCode: 'C' | 'R' | 'U' | 'D' | 'E' = this.reflector.get('actionCode', data.context.getHandler());

        let identity: IdentityRequest = identityDecode(data.context.switchToHttp().getRequest());

        this.LOG.trace('api_activity', {
            customer_key: identity ? identity.customerKey : '',
            login: identity ? identity.login : '',
            method: data.context.getArgByIndex(0).method,
            path: data.context.getArgByIndex(0)._parsedUrl.pathname,
            duration: Date.now() - data.start,
        });
        if (actionCode && identity) {
            return this.auditTrailService.getSettings().pipe(
                mergeMap((settings) => {
                    if (settings && settings.audit && settings.audit.activated) {
                        const id = data.context.getArgByIndex(0).params.uuid ?
                            data.context.getArgByIndex(0).params.uuid :
                            data.context.getArgByIndex(0).params.key ?
                                data.context.getArgByIndex(0).params.key : '';

                        const log: AuditLog = {
                            eventId: UUID.UUID(),
                            eventActionCode: actionCode,
                            eventDate: new Date().toISOString(),
                            httpStatusCode: data.err ? data.err.status : data.context.getArgByIndex(0).res.statusCode,
                            userId: identity.login,
                            customerKey: identity.customerKey,
                            networkAccessPoint: '',
                            objectUuid: id,
                            objectTypeCode: this.mapping[data.context.getClass().name] ? this.mapping[data.context.getClass().name] : '',
                            objectModelKey: data.handlerData instanceof SmartObjectDto ? data.handlerData.modelKey : '',
                        };
                        return this.auditTrailService.createLog(log);
                    }
                }),
            );
        }

    }

}
