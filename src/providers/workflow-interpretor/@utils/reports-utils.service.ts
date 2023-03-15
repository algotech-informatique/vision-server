import { Injectable, BadRequestException } from '@nestjs/common';
import {
    ReportGenerateDto, SmartObjectDto, ReportPreviewDto, WorkflowInstanceContextDto,
    PairDto, WorkflowVariableModelDto,
} from '@algotech/core';
import * as _ from 'lodash';
import { ReportsUtils } from '@algotech/interpretor';
import { of, Observable, zip } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { SoUtilsService } from './so-utils.service';
import { WorkflowMessageService } from '../workflow-message/workflow-message.service';
import { FilesService } from '../../files/files.service';
import { DocumentsHead } from '../../documents/documents.head';
import { FileUtils } from '@algotech/core';

@Injectable()
export class ReportsUtilsService extends ReportsUtils {

    constructor(
        private documentsHead: DocumentsHead,
        private workflowMessage: WorkflowMessageService,
        private filesService: FilesService,
        private soUtilsService: SoUtilsService,
    ) {
        super();
    }

    createTextFile(fileName: string, content: string, ext: string): Buffer {
        if (this.isImage(ext)) {
            if (content.startsWith('data:image')) {
                content = content.split('base64,')?.[1];
            }
            return new Buffer(content, 'base64');
        }
        return this.createFile(content, fileName, FileUtils.extToMimeType(ext));
    }

    previewReport(reportPreview: ReportPreviewDto, smartobjects: SmartObjectDto[], context: WorkflowInstanceContextDto) {
        return of({}); // deprectated
    }

    generateReport(reportGenerate: ReportGenerateDto, smartobjects: SmartObjectDto[], context: WorkflowInstanceContextDto) {
        return of({}); // deprectated
    }

    getFile(fileUuid: string, context: WorkflowInstanceContextDto): Observable<any> {

        return this.documentsHead.getFileByUUID(this.workflowMessage.payload(context, { uuid: fileUuid })).pipe(
            mergeMap((file: any) => {
                if (file?._id) {
                    return this.filesService.readFileStream(file._id);
                }
                return of(null);
            }),
            mergeMap((f) => {
                const data = [];
                return new Observable<any>(observer => {
                    f.on('data', (d) => {
                        data.push(d);
                    });
                    f.on('end', () => {
                        observer.next(Buffer.concat(data));
                        observer.complete();
                    });
                });
            }),
        );
    }

    getFileB64(fileUuid: string, context: WorkflowInstanceContextDto): Observable<string> {
        return this.getFile(fileUuid, context).pipe(
            map((data) => data.toString('base64')),
        );
    }

    generateXReport(templateUuid: string, inputs: any[], fileName: string, ext: string, download: boolean,
        // tslint:disable-next-line: align
        smartobjects: SmartObjectDto[], context: WorkflowInstanceContextDto): Observable<File> {
        return this.getFile(templateUuid, context).pipe(
            mergeMap(file => this.templaterParseData(file, inputs, ext, smartobjects, context)));
    }

    openFileDocument(fileName: string, file: File) {
    }

    createFile(content: any, fileName: string, type: string) {
        const buffer = Buffer.from(content);
        return buffer;
    }

    createZipFile(versionId: string, fileName: string, context: WorkflowInstanceContextDto): Observable<any> {
        return super.createZipFile(versionId, fileName, context);
    }

    templaterParseData(file, inputs: any[], ext: string, smartobjects: SmartObjectDto[], context: WorkflowInstanceContextDto): Observable<any> {
        const expressions = require('angular-expressions');
        expressions.filters.size = (input, width, height) => {
            return {
                data: input,
                size: [width, height],
            };
        };

        expressions.filters.maxSize = (input, width, height) => {
            return {
                data: input,
                maxSize: [width, height],
            };
        };

        const angularParser = (tag) => {
            if (tag === '.') {
                return {
                    get: (s) => {
                        return s;
                    },
                };
            }
            const expr = expressions.compile(
                tag.replace(/(’|‘)/g, '\'').replace(/(“|”)/g, '"'),
            );
            return {
                get: (scope, parseContext) => {
                    let obj = {};
                    const scopeList = parseContext.scopeList;
                    const num = parseContext.num;
                    for (let i = 0, len = num + 1; i < len; i++) {
                        obj = Object.assign(obj, scopeList[i]);
                    }
                    return expr(scope, obj);
                },
            };
        };
        const Templater = require('docxtemplater');
        const PizZip = require('pizzip');
       
        return new Observable<Blob>(observer => {
            const z = new PizZip(file);
            let template;
            try {
                template = new Templater(z, {
                    linebreaks: true, parser: angularParser, modules: [], nullGetter() { return ''; },
                });
            } catch (error) {
                throw new BadRequestException(`docxTemplater error : ${error}`);
            }
            try {
                const data = this.soUtilsService.nestedSmartObjectsProps(inputs, smartobjects, context);
                template.setData(data);
                try {
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    template.render();
                } catch (error) {
                    // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
                    throw new BadRequestException(`docxTemplater render error : ${error}`);
                }
                observer.next(template.getZip().generate({
                    type: 'nodebuffer',
                }));
            } catch (error) {
                throw new BadRequestException(error);

            }
        });
    }

    getSysFileInputs(
        wfUuid: string, inputs: PairDto[], keysTypes: WorkflowVariableModelDto[],
        context: WorkflowInstanceContextDto): Observable<PairDto[]> {
        const inputs$: Observable<PairDto>[] = _.map(inputs, (input: PairDto) => {
            const keyType: WorkflowVariableModelDto = _.find(keysTypes,
                (key: WorkflowVariableModelDto) => (key.key === input.key));
            if (input.value && keyType && keyType.type === 'sys:file') {
                return this.getFileB64(input.value.versionID, context).pipe(
                    mergeMap((data) => {
                        return of({
                            key: input.key,
                            value: `data:${FileUtils.extToMimeType(input.value.ext)};base64,${data}`,
                        });
                    }),
                );
            } else {
                return of(input);
            }

        });

        return inputs$.length === 0 ? of([]) : zip(...inputs$);
    }

    convertFile(versionID, filename, open, context: WorkflowInstanceContextDto): Observable<any> {
        return this.documentsHead.convertToPdf(versionID);
    }
}
