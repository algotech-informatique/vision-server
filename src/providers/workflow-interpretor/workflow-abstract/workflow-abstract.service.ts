import { Injectable } from '@nestjs/common';
import { SmartObjectDto, LangDto, WorkflowInstanceContextDto, DocumentDto } from '@algotech-ce/core';
import { InterpretorAbstract, InterpretorMetricsKeys } from '@algotech-ce/interpretor';
import { WorkflowMessageService } from '../workflow-message/workflow-message.service';
import { SmartObjectsHead } from '../../smart-objects/smart-objects.head';
import { defer, Observable, of } from 'rxjs';
import { FilesService } from '../../files/files.service';
import { DocumentsHead } from '../../documents/documents.head';
import { IdentityRequest } from '../../../interfaces';
import { map, tap } from 'rxjs/operators';
import { WorkflowMetricsService } from '../workflow-metrics/workflow-metrics.service';
import { FileUtils } from '@algotech-ce/core';

@Injectable()
export class WorkflowAbstractService extends InterpretorAbstract {
    private _fallBackTranslation = '[no translation available]';
    constructor(
        private workflowMessage: WorkflowMessageService,
        private documentsHead: DocumentsHead,
        private smartObjectsHead: SmartObjectsHead,
        private filesService: FilesService,
        private workflowMetrics: WorkflowMetricsService) {
        super();
    }

    setAsset(asset: any): Observable<any> {
        const identity: IdentityRequest = {
            customerKey: '',
            groups: [],
            login: '',
            sessionId: '',
        };

        const fileName = asset.infoFile.name.split('.')[0];
        const ext = (asset.infoFile.name.split('.')[1]) ? `.${asset.infoFile.name.split('.')[1]}` : '';
        const mimetype = FileUtils.extToMimeType(ext);

        if (asset.file) {
            return this.filesService.writeMongoFile(identity, {
                buffer: asset.file,
                mimetype,
                originalname: fileName + ext,
            }, null, asset.infoFile.versionID);
        }
        return of(null);
    }

    getSubDoc(context: WorkflowInstanceContextDto, data: { uuid?: string | string[], smartObjects?: SmartObjectDto[] },
        deeped: boolean, excludeRoot: boolean): Observable<SmartObjectDto[]> {
        return defer(() => {
            this.workflowMetrics.start(context.metrics, InterpretorMetricsKeys.InterpretorDBRequest);

            const payload = data.smartObjects ?
                { smartObjects: data.smartObjects } :
                (
                    Array.isArray(data.uuid) ?
                        { uuids: data.uuid } :
                        { uuid: data.uuid }
                );

            Object.assign(payload, { subdoc: true, deep: deeped, excludeRoot });

            return (this.smartObjectsHead.find(this.workflowMessage.payload(context, payload)) as Observable<any>)
                .pipe(
                    tap(() => this.workflowMetrics.stop(context.metrics, InterpretorMetricsKeys.InterpretorDBRequest))
                );
        });
    }

    getSmartObject(context: WorkflowInstanceContextDto, uuid: string): Observable<SmartObjectDto> {
        return defer(() => {
            this.workflowMetrics.start(context.metrics, InterpretorMetricsKeys.InterpretorDBRequest);
            return (this.smartObjectsHead.find(this.workflowMessage.payload(context, { uuid })) as Observable<any>)
                .pipe(
                    tap(() => this.workflowMetrics.stop(context.metrics, InterpretorMetricsKeys.InterpretorDBRequest))
                );
        });
    }

    getDocuments(context: WorkflowInstanceContextDto, uuids: string[]) {
        return defer(() => {
            this.workflowMetrics.start(context.metrics, InterpretorMetricsKeys.InterpretorDBRequest);
            return (this.documentsHead.getDocuments(this.workflowMessage.payload(context, { uuid: uuids })) as Observable<any>).pipe(
                tap(() => this.workflowMetrics.stop(context.metrics, InterpretorMetricsKeys.InterpretorDBRequest))
            );
        });
    }

    transform(values: LangDto[], lang?: string): string {
        let translation;

        if (values.length === 0) {
            return this._fallBackTranslation;
        }

        if (lang) {
            translation = values.find(l => l.lang === lang);
        } else {
            throw new Error('lang must to must be completed');
        }

        return translation && translation.value ? translation.value : this._fallBackTranslation;
    }
}
