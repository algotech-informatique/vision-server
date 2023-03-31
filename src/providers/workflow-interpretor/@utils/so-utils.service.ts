import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SmartObjectsHead } from './../../smart-objects/smart-objects.head';
import { WorkflowMessageService } from './../workflow-message/workflow-message.service';
import { WorkflowInstanceContextDto, SmartObjectDto, SysFile, DocumentDto, SmartModelDto, PairDto, ImportOptionsDto } from '@algotech-ce/core';
import { Injectable } from '@nestjs/common';
import { SoUtils } from '@algotech-ce/interpretor';
import { WorkflowAbstractService } from '../workflow-abstract/workflow-abstract.service';
import { SearchHead } from './../../search/search.head';
import { Readable } from 'stream';

@Injectable()
export class SoUtilsService extends SoUtils {

    constructor(
        protected smartObjectsHead: SmartObjectsHead,
        protected workflowMessage: WorkflowMessageService,
        protected workflowAbstract: WorkflowAbstractService,
        private searchHead: SearchHead,
    ) {
        super(workflowAbstract);
    }

    public csvToSo(file: Buffer, smartModel: SmartModelDto, options: ImportOptionsDto): Observable<SmartObjectDto[]> {

        const papa = require('papaparse');
        const stream = Readable.from(file.toString());

        return new Observable((observer) => {
            papa.parse(stream, {
                delimiter: options.delimiter ?? '',
                newline: options.newline ?? '',
                worker: true,
                skipEmptyLines: true,
                complete: (res) => {
                    observer.next(this._csvDataToSo(res.data, smartModel, options));
                    observer.complete();
                },
                error: (err) => {
                    observer.error(err);
                    observer.complete();
                }
            });
        })
    }

    transformListObject(objects: Array<SmartObjectDto | SysFile>, documents: DocumentDto[]): SysFile[] { 
        return super.transformListObject(objects, documents);
    }

    getAllByProperties(querySearch: any, context?: WorkflowInstanceContextDto): Observable<SmartObjectDto[]> {
        // return this.smartObjectsHead.findByModelProperties(this.workflowMessage.payload(context, {query: querySearch} ));
        return this.searchHead.searchSo(this.workflowMessage.getIdentity(context), 0, 1000, '', querySearch, false) as Observable<SmartObjectDto[]>;
    }
    
    getAllByModel(model: string, context?: WorkflowInstanceContextDto): Observable<SmartObjectDto[]> {
        return this.smartObjectsHead.find(this.workflowMessage.payload(context, { modelKey: model, limit: -1 })).pipe(
            map((smartObjects: SmartObjectDto[]) =>
                smartObjects.map((so: SmartObjectDto) => {
                    const soCopy = JSON.parse(JSON.stringify(so));
                    delete soCopy._id;
                    delete soCopy.__v;
                    delete soCopy.deleted;
                    delete soCopy.customerKey;
                    return soCopy;
                })
            )
        );
    }
}
