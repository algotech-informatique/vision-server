import { from, Observable, of, throwError } from 'rxjs';
import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { IndexStatus, Metadata, SmartObjectDto } from '@algotech-ce/core';
import moment = require('moment');
import { Document, IdentityRequest, IndexationError, SmartModel, SmartObject } from '../../interfaces';
import { FilesService } from '../files/files.service';
import { SmartModelsHead } from '../smart-models/smart-models.head';
import { SmartObjectsHead } from '../smart-objects/smart-objects.head';
import { ModuleRef } from '@nestjs/core';
import { UUID } from 'angular2-uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProcessMonitoring } from '../../interfaces/process-monitoring/process-monitoring.interface';
import { ProcessMonitoringHead } from '../../providers/process-monitoring/process-monitoring.head';
import { RxExtendService } from '../../providers/rx-extend/rx-extend.service';
import { DocumentsHead } from '../documents/documents.head';

const es_url = process.env.ES_URL ? process.env.ES_URL : 'http://ms-search:9200';

interface IndexationResult {
    name: string;
    fileID: string;
    indexed: boolean;
    error: boolean;
    errorMsg?: string;
}
@Injectable()
export class IndexationService {

    constructor(
        private readonly smartObjectsHead: SmartObjectsHead,
        private readonly smartModelsHead: SmartModelsHead,
        private readonly moduleRef: ModuleRef,
        private readonly processMonitoringHead: ProcessMonitoringHead,
        @Inject(forwardRef(() => DocumentsHead))
        private readonly documentsHead: DocumentsHead,
        protected http: HttpService,
        protected fileService: FilesService,
        protected rxExt: RxExtendService,
        @InjectModel('IndexationError') private readonly indexationErrorModel: Model<IndexationError>,
        @InjectModel('document') private readonly documentModel: Model<Document>,) {
    }

    public requireIndexingByMime(mime: string): boolean {
        return mime === 'image/vnd.dwg'
            || mime.match(/^application/) !== null
            || mime.match(/^text/) !== null;
    }

    public contentFileToBase64(contentFile): string {
        console.log('Converting file to Base 64');
        let ret;
        try {
            ret = Buffer.from(contentFile).toString('base64');
        }
        catch (error) {
            console.log('error', error);

            ret = null;
        }
        return ret;
    }

    public indexWithES(customerKey: string, base64: string, fileId: string, document: Document, modelKeys: string[]): Observable<boolean> {
        console.log('Request ES', fileId);
        console.log('doc-uuid : ', document.uuid);
        const headers = { 'Content-Type': 'application/json' };
        const url: string = `${es_url}/${customerKey}_doc_index/_doc/${document.uuid}?pipeline=docs-pipeline`;
        console.log(url);
        console.log('document.name', document.name);

        return this.http.put(url, {
            uuid: document.uuid,
            title: document.name,
            ext: document.ext,
            tags: document.tags,
            annotations: document.versions &&
                document.versions.length > 0 ? _.map(document.versions[0].annotations, (annot) => annot.annotation).join(' ') : '',
            content: base64,
            modelKeys,
            metadatas: document.metadatas,
        }, { headers }).pipe(
            catchError(err => {
                const msg = `${err.response.statusText} (${err.response.status}) : ${err.response.data.error.reason}`;
                console.log(`${msg}`);
                //throw new InternalServerErrorException(`ElasticSearch : ${msg}`);
                return of({ data: null });
            }),
            catchError((err) => {
                return of({
                    data: [{
                        index: {
                            error: {
                                msg: err
                            },

                        }
                    }]
                })
            }),
            mergeMap((response) => of(this._handleResult(customerKey, response, fileId))),
            map((results) => this._handleResults(customerKey, results))
        );
    }

    indexByUuid(identity: IdentityRequest, docUuid: string, document: Document): Observable<boolean> {
        return this.fileService
            .getFileByUuid(document.versions[0].uuid).pipe(
                mergeMap((file: any) => this.indexByFileId(identity, file._id, document)),
            );
    }

    indexByFileId(identity: IdentityRequest, fileId: string, document?: Document): Observable<boolean> {
        return this.fileService.readDBFile(fileId).pipe(
            mergeMap((contentFile: any) => {
                return this._process(identity, contentFile, fileId, document);
            }),
            catchError((err) => of(false)),
            map((indexed: boolean) => (indexed)),
            tap(() => console.log(`--done--`)),
        );
    }

    indexBySmartObject(identity: IdentityRequest, so: SmartObject, minIndexationDate: string):
        Observable<IndexationResult[]> {
        if (!so ||
            !so.skills ||
            !so.skills.atDocument ||
            !so.skills.atDocument.documents ||
            so.skills.atDocument.documents.length === 0) {
            console.log('No document found - skipping this SO');
            return of([]);
        }

        const documents$: Observable<Document[]> = this.documentsHead.getDocumentsFromSo({ identity, uuid: so.uuid });

        return documents$.pipe(
            mergeMap((documents: Document[]) => {
                console.log(`${documents.length} doc to (try) to index`);
                const metadata$: Observable<IndexationResult>[] = _.map(documents, (document: Document, i) => {
                    console.log(`Documents Indexing ${i} / ${documents.length}`);
                    const results$ = this.fileService.getFileDetails(document.versions[0].fileID).pipe(
                        catchError((err) => throwError(() => ({
                            name: document.name,
                            fileID: document.versions[0].fileID,
                            indexed: false,
                            error: true,
                            errorMsg: err,
                        }))),
                        mergeMap((file) => {
                            if (!file) {
                                return of({
                                    name: document.name,
                                    fileID: document.versions[0].fileID,
                                    indexed: false,
                                    error: false,
                                });
                            }
                            return this.indexByFileId(identity, file._id.toString(), document).pipe(
                                catchError((err) => throwError(() => ({
                                    name: document.name,
                                    fileID: document.versions[0].fileID,
                                    indexed: false,
                                    error: true,
                                    errorMsg: err,
                                }))),
                                map((result: boolean) => ({
                                    name: document.name,
                                    fileID: document.versions[0].fileID,
                                    indexed: result,
                                    error: false,
                                })),
                            );
                        }),
                    );
                    return this._requireIndexationFromDate(document.versions[0].fileID, minIndexationDate).pipe(
                        mergeMap((require: boolean) => {
                            if (require) {
                                return results$;
                            } else {
                                return of({
                                    name: document.name,
                                    fileID: document.versions[0].fileID,
                                    indexed: false,
                                    error: false,
                                });
                            }
                        }),
                    );
                });
                return this.rxExt.sequence(metadata$);
            }),
        );
    }

    indexByCustomerKey(identity: IdentityRequest, minIndexationDate: string, step = 10): Observable<IndexationResult[]> {
        const proc: ProcessMonitoring = {
            uuid: UUID.UUID(),
            customerKey: identity.customerKey,
            current: 0,
            total: 0,
            deleted: false,
            processState: 'inProgress',
            processType: 'indexationDoc',
            result: {},

        }
        this.processMonitoringHead.create(identity.customerKey, proc).subscribe();
        // Find SmartModel with Document Skills
        const models$: Observable<SmartModel[]> = this._getModelsWithDocumentSkill(identity);
        // For each SmartModel get list of SmartObjects
        return models$.pipe(
            mergeMap((models: SmartModel[]) => {
                const results$: Observable<IndexationResult[]>[] =
                    _.map(models, (m) => this._indexByStep(identity, m, minIndexationDate, 0, step, [], proc));
                return this.rxExt.sequence(results$).pipe(
                    map((arr: IndexationResult[][]) => {
                        const res = _.reduce(arr, (r, a) => {
                            r = r.concat(a);
                            return r;
                        }, []);
                        proc.processState = res.find(r => r.error) ? 'error' : 'succeeded';
                        if (proc.processState === 'error') {
                            proc.result = res.filter(r => r.error);
                        }
                        proc.total = res.length;
                        this.processMonitoringHead.update(identity.customerKey, proc).subscribe();
                        return res
                    }),
                );
            }),
        );
    }
    _indexByStep(
        identity: IdentityRequest,
        model: SmartModel, minIndexationDate: string,
        skip = 0, limit = 10, results: IndexationResult[] = [],
        proc: ProcessMonitoring): Observable<IndexationResult[]> {

        const objects$: Observable<SmartObject[]> =
            this.smartObjectsHead.find({ identity, modelKey: model.key, skip, limit }) as Observable<SmartObject[]>;

        return objects$.pipe(
            mergeMap((objects: SmartObject[]) => {
                if (objects.length === 0) {
                    return of(results);
                } else if (objects.length < limit) {
                    const res$: Observable<IndexationResult[]> = this._indexDocumentsFromObject(identity, objects, minIndexationDate);
                    return res$.pipe(
                        map((r: IndexationResult[]) => {
                            proc.current += r.filter(indexDoc => indexDoc.indexed).length;
                            this.processMonitoringHead.update(identity.customerKey, proc).subscribe();
                            return results.concat(r);
                        }),
                    );
                } else {
                    const res$: Observable<IndexationResult[]> = this._indexDocumentsFromObject(identity, objects, minIndexationDate);
                    return res$.pipe(
                        mergeMap((r: IndexationResult[]) => {
                            proc.current += r.filter(indexDoc => indexDoc.indexed).length;
                            this.processMonitoringHead.update(identity.customerKey, proc).subscribe();
                            results.concat(r);
                            return this._indexByStep(identity, model, minIndexationDate, ++skip, limit, results, proc)}),
                    );
                }
            }),
        );

    }
    _getModelsWithDocumentSkill(identity: IdentityRequest): Observable<SmartModel[]> {
        return this.smartModelsHead.find({ identity }).pipe(
            map((models: SmartModel[]) => {
                return _.filter(models, (m: SmartModel) => m.skills.atDocument === true);
            }));
    }
    _getObjectsFromModel(identity: IdentityRequest, model: SmartModel, skip = 0, limit = 10, results: SmartObject[] = []): Observable<SmartObject[]> {
        const objects: Observable<SmartObject[]> =
            this.smartObjectsHead.find({ identity, modelKey: model.key, skip, limit }) as Observable<SmartObject[]>;
        return objects.pipe(
            mergeMap((r: SmartObject[]) => {
                results = results.concat(r);
                if (r.length < limit) {
                    console.log(`(${model.key}) : ${results.length} objects`);
                    return of(results);
                } else {
                    return this._getObjectsFromModel(identity, model, skip++, limit, results);
                }
            }),
        );
    }
    _indexDocumentsFromObject(identity: IdentityRequest, objects: SmartObject[], minIndexationDate: string):
        Observable<IndexationResult[]> {
        const indexObjects$: Observable<IndexationResult[]>[] =
            _.map(objects, (o: SmartObject) => this.indexBySmartObject(identity, o, minIndexationDate));
        return this.rxExt.sequence(indexObjects$).pipe(
            map((res: IndexationResult[][]) => _.flatten(res)),
        );
    }
    _process(identity: IdentityRequest, contentFile, fileId: string, document?: Document): Observable<boolean> {
        try {
            const base64File = this.contentFileToBase64(contentFile);
            return this.getSoContains(identity, document.uuid).pipe(
                mergeMap((smartobjects: SmartObjectDto[]) => {
                    let modelKeys = [];
                    if (smartobjects.length > 0) {
                        modelKeys = _.uniq(_.map(smartobjects, (so) => so.modelKey));
                    }
                    return this.indexWithES(identity.customerKey, base64File, fileId, document, modelKeys);
                }),
                mergeMap((result: boolean) => {
                    if (result) {
                        return this._updateIndexationDate(fileId).pipe(map(() => result));
                    } else {
                        return of(false);
                    }
                }),
            );
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
    _updateIndexationDate(fileId: string): Observable<Metadata> {
        return this.fileService.getMetada(fileId).pipe(
            mergeMap((res: { metadata: Metadata; name: string; }) => {
                const newMetaData = Object.assign(res.metadata, { indexationDate: moment().format() });
                return this.fileService.setMetada(fileId, newMetaData);
            }),
        );
    }
    _requireIndexationFromDate(fileId: string, minIndexationDate: string): Observable<boolean> {
        return this.fileService.getMetada(fileId).pipe(
            map((res: { metadata: Metadata; name: string; }) => {
                return res.metadata.indexationDate ? moment(res.metadata.indexationDate).isBefore(moment(minIndexationDate)) : true;
            }),
        );
    }

    _handleResult(customerKey: string, response: any, fileId: string) {
        const result = response.data;
        const ret = {
            index: {
                _index: `${customerKey}_doc_index`,
                _id: fileId,
                error: (!result?._shards?.successful || result?._shards?.successful === 0) ?
                    { msg: `Indexation failed` } : null,
                _shards: result?._shards,
            }
        }
        console.log((ret.index.error) ? ret.index.error.msg : 'Indexing done');
        return [ret];
    }

    _handleResults(customerKey: string, result: any): boolean {
        const indexStatus = _.reduce(Array.isArray(result) ? result : result.data.items, (res, item) => {
            let status: IndexStatus;
            if (item.index?.error || item.update?.error || item.delete?.error || item.create?.error) {
                const document: IndexationError = {
                    customerKey,
                    deleted: false,
                    error: item,
                    uuid: UUID.UUID(),
                    createdDate: new Date().toISOString(),
                    updateDate: new Date().toISOString(),
                }
                res.errors.push({
                    insertOne: {
                        document
                    }
                });
                status = 'error';
            } else {
                status = (item.index || item.create || item.update) ? 'indexed' : 'deleted';
            }

            res.indexed.push({
                updateOne: {
                    filter: {
                        uuid: (item.index) ? item.index._id :
                            (item.create) ? item.create._id :
                                (item.update) ? item.update._id : item.delete._id
                    },
                    update: { indexStatus: status, lastIndexDate: new Date().toISOString() }
                }
            });
            return res;
        }, { errors: [], indexed: [] });
        //detached error and index status udaptes
        if (indexStatus?.errors?.length > 0) {
            from(this.indexationErrorModel.bulkWrite(indexStatus.errors)).subscribe();
        }
        if (indexStatus?.indexed?.length > 0) {
            from(this.documentModel.bulkWrite(indexStatus.indexed)).subscribe();
        }
        return indexStatus.errors.length === 0;
    }

    esRequest(customerKey, raw) {
        const headers = { 'Content-Type': 'application/json' };
        const fullUrl = `${es_url}/_bulk?pretty&refresh`;

        return this.http.post(fullUrl, raw, { headers })
            .pipe(
                catchError((err) => {
                    return of({
                        data: [{
                            index: {
                                error: {
                                    msg: err
                                },

                            }
                        }]
                    })
                }),
                map((result) => this._handleResults(customerKey, result))
            );
    }

    getSoContains(identity: IdentityRequest, documentID: string): Observable<SmartObjectDto[]> {
        // return the list of so which contains document documentID
        return this.smartObjectsHead.find({ identity, docUuid: documentID }) as Observable<SmartObjectDto[]>;
    }
}
