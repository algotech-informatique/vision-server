import { Injectable, BadRequestException } from '@nestjs/common';
import moment = require('moment');
import { Observable, of, zip, from, identity } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { PatchPropertyDto, SysFile } from '@algotech/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SmartObjectsHead } from '../smart-objects/smart-objects.head';
import { BaseService } from '../@base/base.service';
import { FilesService } from '../files/files.service';
import { IndexationService } from '../indexation/indexation.service';
import { Document, IdentityRequest, SmartObject, UploadData, User, Version } from '../../interfaces';

import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import * as async from 'async';
import * as tmp from 'tmp';
import { execFile } from 'child_process';
import { UsersService } from '../users/users.service';

@Injectable()
export class DocumentsService extends BaseService<Document> {

    constructor(
        @InjectModel('document') private readonly documentModel: Model<Document>,
        private readonly fileService: FilesService,
        private readonly indexationService: IndexationService,
        private readonly smartObjectsHead: SmartObjectsHead,
        private readonly usersService: UsersService,
    ) {
        super(documentModel);
    }

    getDocumentsFromSo(identity: IdentityRequest, uuid: string, skip?: number, limit?: number): Observable<Document[]> {
        return this.smartObjectsHead.find({ identity, uuid })
            .pipe(
                mergeMap((so: SmartObject) => {
                    if (so === undefined) {
                        throw new BadRequestException('smart object not found');
                    }

                    if (!so.skills.atDocument) {
                        return of([]);
                    }
                    const aggregates: any = [
                        { $match: { customerKey: identity.customerKey, deleted: false, uuid: { $in: so.skills.atDocument.documents } } },
                        {
                            $project: {
                                _id: 0,
                                __v: 0,
                                deleted: 0,
                                customerKey: 0,
                            }
                        },
                    ];

                    if (skip !== undefined && limit !== undefined && limit > -1) {
                        aggregates.push(
                            { $skip: skip * limit },
                            { $limit: limit },
                        );
                    }
                    return from(this.documentModel.aggregate(aggregates));
                }),
            );
    }

    getDocument(customerKey: string, uuid: string): Observable<Document> {
        const findDoc = super.findOne(customerKey, uuid);
        return findDoc.pipe(
            catchError((d) => {
                return of(null);
            }),
            mergeMap(document => {
                if (document) {
                    return of(document);
                } else {
                    throw new BadRequestException('document unknown');
                }
            }),
        );
    }

    getDocuments(customerKey: string, uuids: string[]): Observable<Document[]> {
        if (uuids.length === 0) {
            return of([]);
        }

        const aggregates: any = [{
            $match: {customerKey, deleted: false, uuid: { $in: uuids }},
        }, {
            $project: { _id: 0, __v: 0, customerKey: 0, deleted: 0, }
        }];

        return from(this.documentModel.aggregate(
            aggregates
        ));
    }

    getDocumentByName(customerKey: string, name: string): Observable<Document> {
        return from(
            this.documentModel.findOne(
                { name, customerKey, deleted: false },
                { _id: 0, __v: 0, deleted: 0 },
            )).pipe(
                catchError((d) => {
                    return of(null);
                }),
                mergeMap(document => {
                    if (document) {
                        return of(document);
                    } else {
                        throw new BadRequestException('document unknown');
                    }
                }),
            );
    }

    getDocumentByFileId(customerKey: string, fileId: string): Observable<Document> {
        return from(
            this.documentModel.findOne(
                { 'versions.fileID': fileId, customerKey, 'deleted': false },
                { _id: 0, __v: 0, deleted: 0 },
            ));
    }

    getRecentDocuments(customerKey: string): Observable<Document[]> {
        const aggregates: any = [
            {
                $match: {
                    customerKey,
                    deleted: false,
                    versions: { $gt: [] },
                },
            },
            { $addFields: { lastDoc: { $arrayElemAt: ['$versions', 0] } } },
            { $sort: { lastDoc: 1 } },
            { $limit: 20 },
        ];
        return from(this.documentModel.aggregate(aggregates));
    }

    upload(data: UploadData): Observable<{ fileID: string, stored: boolean; indexed: boolean; }> {
        const versionID = data.details.versionID ? data.details.versionID : UUID.UUID();
        return this.findNameAndUpdate(data.identity, data.uuid, data.details.documentID, data.file.originalname, { replaceExt: true }).pipe(
            mergeMap((filename: string) => {

                const _data = _.cloneDeep(data);
                _data.file.originalname = filename;

                return this.fileService.writeMongoFile(_data.identity, _data.file, data.uuid, versionID).pipe(
                    catchError((err: any) => {
                        return of(false);
                    }),
                    mergeMap((res) => {
                        if (res === false) {
                            return of({ fileID: null, stored: false, indexed: false });
                        }

                        const fileID = res.fileInfo.fileId.toString();

                        if (data.uuid === 'cache') {
                            return of({ fileID, stored: true, indexed: false });
                        }

                        return this.addDocument(_data, fileID, versionID).pipe(
                            mergeMap(() => this.getDocument(data.identity.customerKey, data.details.documentID)),
                            catchError(() => of(null)),
                            mergeMap((doc) => {
                                if (doc !== null) {
                                    return this.indexationService.indexByFileId(_data.identity, fileID, doc).pipe(
                                        catchError((err: any) => of(false)),
                                        map((resES) => {
                                            if (resES === false) {
                                                return { fileID, stored: true, indexed: false };
                                            } else {
                                                return { fileID, stored: true, indexed: true };
                                            }
                                        }),
                                    );
                                } else {
                                    return of({ fileID, stored: true, indexed: false });
                                }
                            }),
                        );
                    }),
                );
            }),
        );
    }

    getExt(name: string, defaultValue = '') {
        const re = /(?:\.([^.]+))?$/;
        const ex = re.exec(name)[1];
        return ex ? ex : defaultValue;
    }

    toSysFile(data: { identity?: IdentityRequest, documentID?: string, versionID: string, filename: string, size: number }): Observable<SysFile> {
        if (data.identity) {
            return this.usersService.findOneByLogin(data.identity.customerKey, data.identity.login).pipe(
                map((user: User) => {
                    return {
                        documentID: data.documentID,
                        versionID: data.versionID,
                        name: data.filename,
                        reason: '',
                        ext: this.getExt(data.filename),
                        size: data.size,
                        dateUpdated: moment().format(),
                        user: user.uuid,
                        tags: [],
                        metadatas: [],
                        annotations: []
                    };
                })
            )
        }
        return of({
            documentID: data.documentID,
            versionID: data.versionID,
            name: data.filename,
            reason: '',
            ext: this.getExt(data.filename),
            size: data.size,
            dateUpdated: moment().format(),
            user: undefined,
            tags: [],
            metadatas: [],
            annotations: []
        });
    }

    // tslint:disable-next-line: max-line-length
    findNameAndUpdate(identity: IdentityRequest, uuid: string, documentID: string, originalFilename: string, options: { update?: boolean, replaceExt?: boolean } = {}): Observable<string> {
        return this.smartObjectsHead.find({ identity, uuid })
            .pipe(
                catchError(() => of(null)),
                mergeMap((so: SmartObject) => {
                    if (!so) {
                        // cache - no so attached
                        return of(originalFilename);
                    }

                    if (!so.skills || !so.skills.atDocument) {
                        throw new Error(`skills document not initialized for so ${uuid}`);
                    }

                    return this.getDocumentsFromSo(identity, so.uuid).pipe(
                        mergeMap((documents: Document[]) => {
                            const findDocIndex = _.findIndex(documents, (d) => d.uuid === documentID);
                            const findDoc = findDocIndex > -1 ? documents[findDocIndex] : null;
                            const ext = this.getExt(originalFilename);

                            let filename = originalFilename;
                            if (findDoc) {
                                // versionning
                                if (options.replaceExt) {
                                    // rm ext
                                    filename = ext ? findDoc.name.substr(0, findDoc.name.lastIndexOf('.')) : findDoc.name;

                                    // add ext
                                    if (ext) {
                                        filename = `${filename}.${ext}`;
                                    }
                                }
                                documents.splice(findDocIndex, 1);
                            }

                            // name exists, create copy doc (1).txt, doc (2).txt, doc (n).txt
                            if (documents.find((d) => d.name === filename)) {
                                const _noExtName = ext ? filename.substr(0, filename.lastIndexOf('.')) : filename;
                                let i = 1;
                                while (documents.find((d) => d.name === filename)) {
                                    filename = `${_noExtName} (${i++})${ext ? '.' + ext : ''}`;
                                }
                            }

                            // update name on documents.files collection
                            if (findDoc && options.update) {
                                return this.fileService.patchName(findDoc.versions[0].uuid, filename).pipe(
                                    map(() => filename),
                                );
                            }

                            return of(filename);
                        }),
                    );
                }),
            );
    }

    addDocument(data, fileID: string, versionID: string): Observable<Document> {
        return this._documentExists(data.identity, data.details.documentID).pipe(
            mergeMap((exists: boolean) => {
                const document$ = exists ? this._addNewDocumentVersion(data, fileID, versionID) :
                    this._addNewDocument(data, fileID, versionID);
                return document$;
            }),
        );
    }

    linkDocument(identity: IdentityRequest, soUUID: string, documentUUID: string) {
        const patch: PatchPropertyDto = {
            op: 'add',
            path: '/skills/atDocument/documents/[0]',
            value: documentUUID,
        };

        return this.smartObjectsHead.patch({ identity, data: { uuid: soUUID, patches: [patch] } });
    }

    private _documentExists(identity: IdentityRequest, documentID: string): Observable<boolean> {
        if ((!documentID) || documentID === '') {
            return of(false);
        }
        return this.getDocument(identity.customerKey, documentID).pipe(
            catchError(() => of(null)),
            map((doc: Document) => {
                return (doc) ? true : false;
            }),
        );
    }

    private _addNewDocument(data, fileID, versionID): Observable<any> {
        const size = data.file.size;
        const ext = this.getExt(data.file.originalname, data.file.mimetype);
        const name = data.file.originalname;

        const newVersion = this._createNewVersion(fileID, size, 'creation', data.details.userID, versionID);
        const documentDto: Document = {
            uuid: data.details.documentID && data.details.documentID !== '' ? data.details.documentID : UUID.UUID(),
            customerKey: data.identity.customerKey,
            createdDate: null,
            updateDate: null,
            name,
            ext,
            tags: (data?.details?.tags?.length > 0) ? data.details.tags.split(',') : [],
            versions: [newVersion],
            extendedProperties: [],
            metadatas: (data?.details?.metadatas?.length > 0) ? JSON.parse(data.details.metadatas) : [],
            deleted: false,
        };

        return zip(
            this.create(data.identity.customerKey, documentDto, true),
            this.linkDocument(data.identity, data.uuid, documentDto.uuid));
    }

    private _addNewDocumentVersion(data, fileID, versionID): Observable<any> {
        const size = data.file.size;
        const ext = this.getExt(data.file.originalname, data.file.mimetype);
        const name = data.file.originalname;
        const tags = data.details.tags ? data.details.tags.split(',') : [];

        const patches: PatchPropertyDto[] = [{
            op: 'replace',
            path: `/name`,
            value: name,
        }, {
            op: 'replace',
            path: `/ext`,
            value: ext,
        }, {
            op: 'add',
            path: `/versions/[0]`,
            value: this._createNewVersion(fileID, size, data.details.reason, data.details.userID, versionID),
        }, {
            op: 'replace',
            path: `/tags`,
            value: tags,
        }];

        return this.patchProperty(data.identity.customerKey, data.details.documentID, patches);
    }

    private _createNewVersion(fileID, size, reason, userID, versionID): Version {
        return {
            uuid: versionID,
            fileID,
            linkedFilesID: [],
            dateUpdated: moment().format(),
            reason,
            size,
            userID,
            annotations: [],
            extendedProperties: [],
        };
    }

    convert(document, format, filter, options, callback) {
        const tmpOptions = (options || {}).tmpOptions || {};
        const asyncOptions = (options || {}).asyncOptions || {};
        const tempDir = tmp.dirSync({ prefix: 'libreofficeConvert_', unsafeCleanup: true, ...tmpOptions });
        const installDir = tmp.dirSync({ prefix: 'soffice', unsafeCleanup: true, ...tmpOptions });
        return async.auto({
            soffice: (callback) => {
                let paths = [];
                switch (process.platform) {
                    case 'darwin': paths = ['/Applications/LibreOffice.app/Contents/MacOS/soffice'];
                        break;
                    case 'linux': paths = ['/usr/bin/libreoffice', '/usr/bin/soffice'];
                        break;
                    case 'win32': paths = [
                        path.join(process.env['PROGRAMFILES(X86)'], 'LIBREO~1/program/soffice.exe'),
                        path.join(process.env['PROGRAMFILES(X86)'], 'LibreOffice/program/soffice.exe'),
                        path.join(process.env.PROGRAMFILES, 'LibreOffice/program/soffice.exe'),
                    ];
                        break;
                    default:
                        return callback(new Error(`Operating system not yet supported: ${process.platform}`));
                }

                return async.filter(
                    paths,
                    (filePath, callback) => fs.access(filePath, err => callback(null, !err)),
                    (err, res) => {
                        if (res.length === 0) {
                            return callback(new Error('Could not find soffice binary'));
                        }

                        return callback(null, res[0]);
                    }
                );
            },
            saveSource: callback => fs.writeFile(path.join(tempDir.name, 'source'), document/* Buffer.from(document.slice(0, document.length)) */, callback),
            convert: ['soffice', 'saveSource', (results, callback) => {
                let command = `-env:UserInstallation=file://${installDir.name} --headless --convert-to ${format}`;
                if (filter !== undefined) {
                    command += `:"${filter}"`;
                }
                command += ` --outdir ${tempDir.name} ${path.join(tempDir.name, 'source')}`;
                const args = command.split(' ');
                return execFile(results.soffice, args, callback);
            }],
            loadDestination: ['convert', (results, callback) =>
                async.retry({
                    times: asyncOptions.times || 3,
                    interval: asyncOptions.interval || 200
                }, (callback) => fs.readFile(path.join(tempDir.name, `source.${format}`), callback), callback)
            ]
        }, (err, res) => {
            tempDir.removeCallback();
            installDir.removeCallback();

            if (err) {
                return callback(err);
            }

            return callback(null, res.loadDestination);
        });
    };

}

