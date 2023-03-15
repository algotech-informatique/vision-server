import { Injectable } from '@nestjs/common';
import { InterpretorDataApi, SaveOperationMode } from '@algotech/interpretor';
import {
    WorkflowTaskActionDto, SmartObjectDto, PatchPropertyDto, WorkflowInstanceDto,
    WorkflowInstanceContextDto, ReportGenerateDto, ReportPreviewDto, WorkflowOperationDto, CrudDto, Metadata, WorkflowLaunchOptionsDto,
} from '@algotech/core';
import { Observable, concat, of, Subject } from 'rxjs';
import { catchError, map, mergeMap, reduce, timeout } from 'rxjs/operators';
import { WorkflowInstancesService } from '../../workflow-instances/workflow-instances.service';
import * as _ from 'lodash';
import { ReportsUtilsService } from '../@utils/reports-utils.service';
import { WorkflowMessageService } from '../workflow-message/workflow-message.service';
import { SmartObjectsHead } from '../../smart-objects/smart-objects.head';
import { EmailHead } from '../../email/email.head';
import { SchedulesHead } from '../../schedules/schedules.head';
import { NotificationsHead } from '../../notifications/notifications.head';
import { FilesService } from '../../files/files.service';
import { DocumentsHead } from '../../documents/documents.head';
import moment from 'moment';
import { SmartFlowUtilsService } from '../@utils/smartflow-utils.service';
import { WorkflowUtilsService } from '../workflow-utils/workflow-utils.service';

@Injectable()
export class WorkflowDataApiService extends InterpretorDataApi {
    constructor(
        private documentsHead: DocumentsHead,
        private schedulesHead: SchedulesHead,
        private notificationsHead: NotificationsHead,
        private reportsUtilsService: ReportsUtilsService,
        private workflowInstanceService: WorkflowInstancesService,
        private workflowMessage: WorkflowMessageService,
        private smartObjectsHead: SmartObjectsHead,
        private emailHead: EmailHead,
        private filesService: FilesService,
        private smartFlowUtils: SmartFlowUtilsService,
        protected workflowUtilsService: WorkflowUtilsService) {
        super(workflowUtilsService);
    }

    public zipOperations(operations: WorkflowOperationDto[], context: WorkflowInstanceContextDto) {
        const operations$ = _.map(operations, (operation: WorkflowOperationDto) => {
            switch (operation.type) {
                case 'crud':
                    return this._saveOperationCrud(operation.value as CrudDto, context);
                case 'action':
                    return this._saveOperationAction(operation.value as WorkflowTaskActionDto, SaveOperationMode.End, context, []);
            }
        });

        return concat(...operations$).pipe(
            reduce((acc, value) => acc, []),
            catchError(() => {
                return of({
                    success: 0,
                });
            }),
            map(() => {
                return {
                    success: 1,
                };
            }),
        );
    }

    public postInstance(instance: WorkflowInstanceDto, context: WorkflowInstanceContextDto): Observable<any> {
        const _instance: any = instance;
        return this.workflowInstanceService.create(context.customerKey, _instance, true);
    }

    public putInstance(instance: WorkflowInstanceDto, context: WorkflowInstanceContextDto): Observable<any> {
        const _instance: any = instance;
        return this.workflowInstanceService.update(context.customerKey, _instance);
    }

    public deleteInstance(instance: WorkflowInstanceDto, context: WorkflowInstanceContextDto): Observable<any> {
        return this.workflowInstanceService.delete(context.customerKey, instance.uuid);
    }

    public postSo(so: SmartObjectDto, context: WorkflowInstanceContextDto): Observable<any> {
        return this.smartObjectsHead.create(this.workflowMessage.payload(context, { smartObject: so }));
    }

    public patchSo(uuid: string, patches: PatchPropertyDto[], context: WorkflowInstanceContextDto): Observable<any> {
        return this.smartObjectsHead.patch(this.workflowMessage.payload(context, { data: { uuid, patches } }));
    }

    public _actionSign(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'sign') {
            const _action = action.value;
            return this.documentsHead.uploadSignature(this.workflowMessage.payload(context, {
                signature: {
                    base64: _action.signature,
                    originalname: _action.signatureName,
                    size: 0,
                    mimetype: _action.signatureType,
                },
                uuid: _action.smartObject,
                details: _action.info,
            }));
        }
        return null;
    }

    public _actionLinkCache(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        const _action = action.value;

        if (!_action.smartObject) {
            return null;
        }

        if (action.actionKey === 'upload' || action.actionKey === 'linkCachedSysFile') {
            return this.documentsHead.uploadSODocumentSkill(this.workflowMessage.payload(context, {
                uuid: _action.smartObject,
                details: _action.info,
            }));
        }

        if (action.actionKey === 'reportGenerate') {
            return this.documentsHead.uploadSODocumentSkill(this.workflowMessage.payload(context, {
                uuid: _action.smartObject,
                details: _action.details,
            }));
        }
        return null;
    }

    public _actionEditDocument(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'edit-document') {
            const _action = action.value;
            return this.documentsHead.editSODocumentSkill(this.workflowMessage.payload(context, {
                uuid: _action.smartObject,
                update: _action.edit,
            }));
        }
        return null;
    }

    public _actionDeleteDocuments(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'delete-documents') {
            const _action = action.value;
            return this.documentsHead.removeSODocumentSkill(this.workflowMessage.payload(context, {
                uuid: _action.smartObject,
                documentsID: _action.documentsID,
            }));
        }
        return null;
    }

    public _actionDeleteObject(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'delete') {
            return this.smartObjectsHead.delete(this.workflowMessage.payload(context, { uuid: action.value }));
        }
        return null;
    }

    public _actionCreateSchedule(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'create-schedule') {
            return this.schedulesHead.create(this.workflowMessage.payload(context, { schedule: action.value }));
        }
        return null;
    }

    public _actionDeleteSchedule(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'delete-schedule') {
            return this.schedulesHead.delete(this.workflowMessage.payload(context, { uuid: action.value }));
        }
        return null;
    }

    public _actionLockDocument(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'lock-document') {
            const _action = action.value;
            return this.documentsHead.editSODocumentSkill(this.workflowMessage.payload(context, {
                uuid: _action.smartObject,
                update: _action.edit,
            }));
        }
        return null;
    }

    public _actionNotify(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'notify') {
            return this.notificationsHead.create(this.workflowMessage.payload(context, {
                notification: action.value,
            }));
        }
        return null;
    }

    public _actionSendMail(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'mail') {
            return this.emailHead.sendEmailWithDto(this.workflowMessage.payload(context, {
                email: action.value,
            }));
        }
        return null;
    }

    // tslint:disable-next-line: max-line-length
    public _actionGenerateReport(smartObjects: SmartObjectDto[], action: WorkflowTaskActionDto, options: { cache?: boolean }, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'reportGenerate') {

            const _reportGenerate: ReportGenerateDto = _.cloneDeep(action.value);
            if (options.cache) {
                _reportGenerate.soUuid = 'cache';
            }
            return this.reportsUtilsService.generateReport(_reportGenerate, smartObjects, context);
        }
        if (action.actionKey === 'reportPreview') {
            const _reportPreview: ReportPreviewDto = _.cloneDeep(action.value);
            return this.reportsUtilsService.previewReport(_reportPreview, smartObjects, context);
        }

        return null;
    }

    public _actionSmartflow(action: WorkflowTaskActionDto, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'smartflow') {
            const _action: WorkflowLaunchOptionsDto = action.value;
            return this.smartFlowUtils.start(_action, context);
        }
        return null;
    }

    public _actionUpload(action: WorkflowTaskActionDto, options: { cache?: boolean }, context: WorkflowInstanceContextDto) {
        if (action.actionKey === 'upload') {
            return this.filesService.getMetadaByUuid(action.value.file).pipe(
                mergeMap((metadata: Metadata) => {
                    if (metadata) {
                        metadata.customerKey = context.customerKey;
                        metadata.createdBy = context.user.username;
                        metadata.createdDate = moment().format();
                        return this.filesService.setMetadaByUuid(action.value.file, metadata);
                    }
                    return of(null);
                }),
                catchError((err) => {
                    return of(err);
                })
            );
        }
        return null;
    }
}
