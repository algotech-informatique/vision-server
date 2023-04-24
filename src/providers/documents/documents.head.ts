import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, mergeMap, map, toArray } from 'rxjs/operators';
import { Observable, of, zip, concat, throwError, ReplaySubject } from 'rxjs';
import { PatchPropertyDto, SmartObjectDto, ATSignatureDto, FileEditDto, SysFile } from '@algotech-ce/core';
import * as _ from 'lodash';
import moment = require('moment');
import { FilesService } from '../files/files.service';
import { DocumentsService } from './documents.service';
import { IndexationService } from '../indexation/indexation.service';
import { SmartObjectsHead } from '../smart-objects/smart-objects.head';
import { Document, IdentityRequest, SmartObject, UploadData, UploadFile } from '../../interfaces';
import { UUID } from 'angular2-uuid';

@Injectable()
export class DocumentsHead {
    constructor(
        private readonly fileService: FilesService,
        private readonly documentsService: DocumentsService,
        private readonly indexationService: IndexationService,
        private readonly smartObjectsHead: SmartObjectsHead,
    ) { }

    cache(data: { identity: IdentityRequest, date: string, uuid?: string[] }) {
        return this.documentsService.cache(data.identity.customerKey, data.date, data.uuid, false);
    }

    getFileByUUID(data: { identity: IdentityRequest, uuid: string }) {
        return this.fileService.getFileByUuid(data.uuid);
    }

    uploadSignature(data: {
        identity: IdentityRequest,
        signature: UploadFile,
        uuid: string,
        details: ATSignatureDto,
    }): Observable<SmartObject | SmartObject[] | SmartObjectDto[]> {
        const obsRes = this.smartObjectsHead.find({ identity: data.identity, uuid: data.uuid }).pipe(
            catchError((err) => throwError(() => new InternalServerErrorException(err.message))),
            mergeMap((res) => {
                const so: SmartObjectDto = _.isArray(res) ? res[0] as SmartObjectDto : res as SmartObjectDto;

                const patches: PatchPropertyDto[] = [{
                    op: so.skills.atSignature ? 'replace' : 'add',
                    path: '/skills/atSignature',
                    value: data.details,
                }];

                return concat(
                    this.smartObjectsHead.patch({ identity: data.identity, data: { uuid: data.uuid, patches } }),
                    this.fileService.writeMongoFile(data.identity, data.signature, data.uuid, data.details.signatureID),
                ).pipe(
                    toArray(),
                    mergeMap(() => {
                        return this.smartObjectsHead.find({ identity: data.identity, uuid: data.uuid });
                    }),
                    catchError((err) => throwError(() => new InternalServerErrorException(err.message))));
            }),
        );
        return obsRes;
    }

    getDocuments(data: {
        identity: IdentityRequest;
        uuid: string | string[];
    }): Observable<Document | Document[]> {
        if (Array.isArray(data.uuid)) {
            return this.documentsService.getDocuments(data.identity.customerKey, data.uuid);
        } else {
            return this.documentsService.getDocument(data.identity.customerKey, data.uuid);
        }
    }

    getDocumentByName(data: {
        identity: IdentityRequest;
        name: string;
    }): Observable<Document> {
        return this.documentsService.getDocumentByName(data.identity.customerKey, data.name);
    }

    getDocumentsFromSo(data: {
        identity: IdentityRequest;
        uuid: string;
        skip?: number;
        limit?: number;
    }): Observable<Document[]> {
        return this.documentsService.getDocumentsFromSo(data.identity, data.uuid,
            data.skip, data.limit);
    }

    getRecentDocuments(data: {
        identity: IdentityRequest;
    }): Observable<Document[]> {
        return this.documentsService.getRecentDocuments(data.identity.customerKey);
    }

    uploadDocument(data: {
        identity: IdentityRequest,
        file: UploadFile,
        uuid?: string,
        cache?: boolean,
        sysfile?: boolean
    }): Observable<any> {
        const versionID = data.uuid ? data.uuid : UUID.UUID();

        return this.fileService.writeMongoFile(data.identity, data.file, data.cache ? 'cache' : null, versionID).pipe(
            mergeMap((res) => {
                if (!data.sysfile) {
                    return of(res);
                }
                return this.documentsService.toSysFile({
                    versionID, filename: data.file.originalname, size: data.file.size
                });
            })
        );
    }

    uploadIconPlayer(data: {
        identity: IdentityRequest,
        file: UploadFile,
        uuid?: string
    }): Observable<any> {
        let filesExist: string[] = [];
        return this.fileService.getFileIdsByUuid(/^player/).pipe(
            mergeMap((ids: string[]) => {
                filesExist = ids;
                return this.fileService.writeMongoFile(data.identity, data.file, null, 'player', null, false);
            }),
            mergeMap((res) => {
                // remove files already exists
                if (filesExist && filesExist.length) {
                    const removeFiles$ = filesExist.map(id => this.fileService._deleteBucket(id));
                    return zip(...removeFiles$).pipe(
                        mergeMap(() => of(res))
                    );
                }
                return of(res);
            })
        );
    }

    uploadSODocumentSkill(data: UploadData): Observable<any> {

        const result = (indexation?) => {
            if (data.uuid === 'cache') {
                return of({ fileID: indexation.fileID, stored: true, indexed: false });
            }
            const obsRes: Observable<any>[] = [
                this.smartObjectsHead.find({ identity: data.identity, uuid: data.uuid }),
            ];
            if (data.details.documentID) {
                obsRes.push(this.documentsService.getDocument(data.identity.customerKey, data.details.documentID));
            }
            return zip(...obsRes)
                .pipe(
                    catchError((err) => {
                        return of(err);
                    }),
                    map((response: any[]) => {
                        const res = { obj: response[0] };

                        if (indexation) {
                            Object.assign(res, {
                                fileID: indexation.fileID,
                                stored: indexation.stored,
                                indexed: indexation.indexed,
                            });
                        }

                        if (response.length > 1) {
                            Object.assign(res, {
                                document: response[1],
                            });
                        }

                        return res;
                    }));
        };

        if (data.file && !data.file.mimetype)
            return throwError(() => new BadRequestException('No mimetype provided'));

        // link file to so
        if (!data.file) {
            let newData;
            let file_id;
            return this.fileService.getFileByUuid(data.details.versionID).pipe(
                mergeMap((file) => {
                    file_id = file._id
                    newData = Object.assign(_.cloneDeep(data), {
                        file: {
                            path: '',
                            originalname: '',
                            size: file.length,
                            mimetype: file.contentType,
                        },
                    });
                    // rebuild file
                    return this.documentsService.findNameAndUpdate(data.identity, data.uuid, data.details.documentID, file.filename, { replaceExt: true })
                }),
                mergeMap((filename: string) => {
                    newData.file.path = filename;
                    newData.file.originalname = filename;
                    newData.details.documentID = newData.details.documentID && newData.details.documentID !== '' ? newData.details.documentID : UUID.UUID()
                    return this.documentsService.addDocument(newData, file_id, newData.details.versionID)
                }),
                mergeMap(() => this.fileService.patchName(newData.details.versionID, newData.data.file.path)),
                catchError((err) => {
                    return of(null)
                }),
                mergeMap(() => {
                    return this.documentsService.getDocument(newData.identity.customerKey, newData.details.documentID);
                }),
                mergeMap(
                    (doc) => {
                        this.indexationService.indexByFileId(newData.identity, file_id, doc).subscribe();
                        return result({ fileID: file_id });
                    }));
        };

        return this.documentsService.upload(data).pipe(
            mergeMap(
                (indexation: { fileID: string, stored: boolean; indexed: boolean; }) => {
                    return result(indexation);
                }));
    }

    editSODocumentSkill(data: {
        identity: IdentityRequest,
        uuid: string,
        update: FileEditDto,
    }): Observable<Document> {

        const obsPatches: Observable<PatchPropertyDto>[] = [];
        const indexProps: any = {};

        if (data.update.name) {
            obsPatches.push(
                this.documentsService.findNameAndUpdate(data.identity, data.uuid, data.update.uuid, data.update.name, { update: true }).pipe(
                    map((filename: string) => {
                        const patch: PatchPropertyDto = {
                            op: 'replace',
                            path: `/name`,
                            value: filename,
                        };
                        return patch;
                    })));
            indexProps.title = data.update.name;
        }
        if (data.update.tags) {
            obsPatches.push(of({
                op: 'replace',
                path: `/tags`,
                value: data.update.tags,
            } as PatchPropertyDto));
            indexProps.tags = data.update.tags;
        }
        if (data.update.annotations) {
            obsPatches.push(of({
                op: 'replace',
                path: `/versions/[0]/annotations`,
                value: data.update.annotations,
            } as PatchPropertyDto));
            indexProps.annotations = data.update.annotations;
        }
        if (data.update.metadatas) {
            obsPatches.push(of({
                op: 'replace',
                path: `/metadatas`,
                value: data.update.metadatas,
            } as PatchPropertyDto));
            indexProps.metadatas = data.update.metadatas;
        }
        if (data.update.lockState !== undefined) { // can be assigned or null
            const op = data.update.lockState ? 'add' : 'remove';
            obsPatches.push(of({
                op,
                path: `/lockState`,
                value: data.update.lockState,
            } as PatchPropertyDto));
        }

        const obsRes = zip(...obsPatches).pipe(
            mergeMap((patches: PatchPropertyDto[]) => {
                return this.documentsService.patchProperty(data.identity.customerKey, data.update.uuid, patches).pipe(
                    mergeMap(() => {
                        if (process.env.ES_URL) {
                            let raw = JSON.stringify(
                                { update: { _index: `${data.identity.customerKey}_doc_index`, _id: data.update.uuid } },
                            ) + '\n';
                            raw += JSON.stringify({ doc: indexProps }) + '\n';
                            this.indexationService.esRequest(data.identity.customerKey, raw).subscribe();
                        }
                        return this.documentsService.getDocument(data.identity.customerKey, data.update.uuid);
                    },
                    ));
            }),
        );

        return obsRes;
    }

    removeSODocumentSkill(data: {
        identity: IdentityRequest,
        uuid: string,
        documentsID?: string[],
        versionsID?: string[],
    }): Observable<SmartObject> {

        const obsRes = this.smartObjectsHead.find({ identity: data.identity, uuid: data.uuid }).pipe(
            mergeMap((so: SmartObject) => {
                if (!so.skills.atDocument) {
                    throw new BadRequestException(`no skills document on smart object ${data.uuid}`);
                }

                _.forEach(data.documentsID, (documentID: string) => {
                    if (_.findIndex(so.skills.atDocument.documents, (doc) => doc === documentID) === -1) {
                        throw new BadRequestException(`document ${documentID} not find on smart object ${data.uuid}`);
                    }
                });

                const patches: PatchPropertyDto[] = [{
                    op: 'replace',
                    path: `/skills/atDocument/documents`,
                    value: so.skills.atDocument.documents.filter((documentID) =>
                        data.documentsID.indexOf(documentID) === -1),
                }];

                return this.smartObjectsHead.patch({ identity: data.identity, data: { uuid: data.uuid, patches } },
                ).pipe(
                    mergeMap(() => {
                        return zip(..._.map(data.documentsID, (documentID: string) => {
                            // check no so attached for delete document
                            return this.indexationService.getSoContains(data.identity, documentID).pipe(
                                mergeMap((smartobjects: SmartObjectDto[]) => {
                                    if (smartobjects.length > 0) {
                                        if (process.env.ES_URL) {
                                            const modelKeys = _.uniq(_.map(smartobjects, (smartObject) => smartObject.modelKey));
                                            let raw = JSON.stringify(
                                                { update: { _index: `${data.identity.customerKey}_doc_index`, _id: documentID } },
                                            ) + '\n';
                                            raw += JSON.stringify({ doc: { modelKeys } }) + '\n';
                                            this.indexationService.esRequest(data.identity.customerKey, raw).subscribe();
                                        }
                                        return of({});
                                    } else {
                                        if (process.env.ES_URL) {
                                            // Delete indexation
                                            const raw = JSON.stringify(
                                                { delete: { _index: `${data.identity.customerKey}_doc_index`, _id: documentID } },
                                            ) + '\n';
                                            this.indexationService.esRequest(data.identity.customerKey, raw).subscribe();
                                        }
                                        return this.documentsService.delete(data.identity.customerKey, documentID);
                                    }
                                }),
                            );
                        }));
                    }),
                    mergeMap(() => {
                        return this.smartObjectsHead.find({ identity: data.identity, uuid: data.uuid }) as Observable<SmartObject>;
                    }),
                );
            }));

        return obsRes;
    }

    indexation(data: {
        identity: IdentityRequest,
        soUuid?: string;
        docUuid?: string;
        start?: string;
        end?: string;
        max?: number;
    }): Observable<any> {
        if (data.docUuid) {
            return this.documentsService.getDocument(data.identity.customerKey, data.docUuid).pipe(
                mergeMap((document) => {
                    if (document.versions.length > 0) {
                        return this.indexationService.indexByUuid(data.identity, data.docUuid, document);
                    } else {
                        throw new BadRequestException('no version found on this document');
                    }
                }),
            );
        } else if (data.soUuid) {
            const so$ = this.smartObjectsHead.find({ identity: data.identity, uuid: data.soUuid });

            const minDate = data.start ? data.start : moment().format();
            const indexResult = so$.pipe(
                mergeMap((so: SmartObject) => this.indexationService.indexBySmartObject(data.identity, so, minDate)),
            );
            return indexResult;
        } else {
            const minDate = data.start ? data.start : moment().format();
            const indexAll$ = this.indexationService.indexByCustomerKey(data.identity, minDate);
            return indexAll$;
        }
    }

    convertToPdf(versionId) {
        const subject = new ReplaySubject();

        if (!versionId) {
            throw new BadRequestException('no versionId provided in parameters');
        }
        this.fileService.getFileByUuid(versionId).pipe(
            mergeMap((response) => {
                return this.fileService.readDBFile(response._id);
            }),
            catchError((e: Error) => {
                subject.error(e.message);
                subject.complete();
                return of(null);
            }),
            map((file: any) => {
                if (!file) {
                    return;
                }
                this.documentsService.convert(file, '.pdf', undefined, {}, (err, convertedFile) => {
                    if (err) {
                        subject.error(err.message);
                        subject.complete();
                        return;
                    }

                    subject.next(Buffer.from(convertedFile));
                    subject.complete();
                });
            }),
        ).subscribe();
        return subject;
    }

    convertToPdfWithFile(file: Buffer) {
        const subject = new ReplaySubject();

        if (!file) {
            return;
        }
        this.documentsService.convert(file, '.pdf', undefined, {}, (err, convertedFile) => {
            if (err) {
                subject.error(err.message);
                subject.complete();
                return;
            }
            subject.next(Buffer.from(convertedFile));
            subject.complete();
        });
        return subject;
    }
}
