import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Observable, of, zip, Subject, from } from 'rxjs';
import { map, mergeMap, tap, catchError } from 'rxjs/operators';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import { Connection, Model } from 'mongoose';
import { FileInfo, Metadata } from '@algotech-ce/core';
import { IdentityRequest, UploadFile } from '../../interfaces';
import { Readable } from 'stream';
import { IGridFSObject, MongoGridFS } from 'mongo-gridfs';
import { createBucket } from 'mongoose-gridfs';

@Injectable()
export class FilesService {
    UPLOAD_DIR = process.env.UPLOAD_DIR ? process.env.UPLOAD_DIR : '/usr/src/app/uploads';

    _documentFS: MongoGridFS;
    get documentFS() {
        if (!this._documentFS && this.connection.db) {
            this._documentFS = new MongoGridFS((this.connection as any).db, 'documents');
        }
        return this._documentFS;
    }

    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectModel('documents') private readonly documents: Model<Metadata>,
        @InjectModel('tiles') private readonly tiles: Model<any>,
    ) { }

    getFileDetails(fileId): Observable<IGridFSObject> {
        return from(this.documentFS.findById(fileId));
    }

    readFileStream(id: string) {
        return from(this.documentFS.readFileStream(id));
    }

    readFile(id: string, download: boolean, res) {
        const findItem = from(this.documentFS.findById(id));
        const readFile = from(this.documentFS.readFileStream(id));
        let filename = '';
        let contentType = '';
        let length = 0;
        const result = findItem.pipe(
            mergeMap((data) => {
                contentType = data.contentType;
                filename = data.filename;
                length = data.length;
                return readFile;
            }),
        );

        return result.subscribe((item) => {
            if (!contentType) {
                res.status(400).end();
                return;
            }
            if (download !== undefined) {
                try {
                    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
                } catch (e) {
                    console.log('Error in file : ', filename);
                    console.log('Error : ', e);
                }
            } else {
                try {
                    res.setHeader('Content-Disposition', `filename="${encodeURIComponent(filename)}"`);
                } catch (e) {
                    console.log('Error in file : ', filename);
                    console.log('Error : ', e);
                }
            }

            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Length', length);
            item.once('error', (err) => {
                res.status(400).end();
            }).pipe(res);
        }, () => res.status(500).end());
    }

    readDBFile(fileId) {
        const subject = new Subject();
        return from(this.documentFS.readFileStream(fileId)).pipe(
            catchError((err) => {
                console.log(`\tError: ${err}`);
                throw new InternalServerErrorException(err);
            }),
            tap(() => console.log(`\tdone`)),
            mergeMap((item: any) => {
                let bufferArray = []
                item.on('data', (chunk) => {
                    bufferArray.push(chunk);
                });
                item.on('end', (done) => {
                    subject.next(Buffer.concat(bufferArray));
                    subject.complete();
                })
                return subject.asObservable();
            })
        );
    }

    getMetada(fileId: string): Observable<{ metadata: Metadata; name: string; }> {
        const findItem = this.getFileDetails(fileId);
        return findItem.pipe(
            map((data: any) => ({ name: data.filename, metadata: data.metadata })),
        );
    }

    getFileIdsByUuid(uuid: RegExp): Observable<string[]> {
        return from(
            this.documents.find({ 'metadata.uuid': uuid }).lean()
        ).pipe(
            map((files: any[]) => {
                if (files && files.length) {
                    return files.map(f => f._id);
                } else {
                    return [];
                }
            }),
        )
    }

    getFilesByUuid(uuid: RegExp): Observable<any[]> {
        return from(
            this.documents.find({ 'metadata.uuid': uuid }).lean()
        ).pipe(
            map((files: any[]) => {
                if (files && files.length) {
                    return files;
                } else {
                    return [];
                }
            }),
        )
    }

    getFileByUuid(uuid: string): Observable<any> {
        return from(
            this.documents.findOne({ 'metadata.uuid': uuid }).lean(),
        ).pipe(
            map((file) => {
                if (file) {
                    return file;
                } else {
                    throw new BadRequestException(`file unknown ${uuid}`);
                }
            }),
        );
    }

    getMetadaByUuid(uuid: string): Observable<Metadata> {
        return this.getFileByUuid(uuid).pipe(
            catchError((err) => {
                return of(null);
            }),
            map((file: { metadata: Metadata }) => {
                return file ? file.metadata : null;
            }),
        );
    }

    setMetada(fileId: string, metadata: Metadata): Observable<Metadata> {
        const findItem = from(this.documents.findByIdAndUpdate(fileId, { $set: { metadata } }, { new: true/* , runValidators: true */ }));
        return findItem.pipe(
            map((data: any) => data.metadata),
        );
    }

    setMetadaByUuid(uuid: string, metadata: Metadata): Observable<Metadata> {
        const findItem = from(this.documents.findOneAndUpdate({ 'metadata.uuid': uuid }, { $set: { metadata } }, { new: true, runValidators: true }));
        return findItem.pipe(
            map((err) => {
                return err;
            }),
            map((data: any) => data.metadata),
        );
    }

    patchName(uuid: string, filename: string): Observable<any> {
        return from(this.documents.updateOne(
            { 'metadata.uuid': uuid },
            { $set: { filename } },
        ));
    }

    bufferToStream(binary) {
        return new Readable({
            read() {
                this.push(binary);
                this.push(null);
            },
        });
    }

    resizeImage(sharp, identity: IdentityRequest, buffer: Buffer, file: UploadFile, smartObjectUuid: string,
        uuid: string, status: string, width: number, height: number): Observable<any> {

        return from(sharp(buffer).resize(width, height).toBuffer()).pipe(
            mergeMap((sharpBuffer: Buffer) => {
                return this.writeMongoFile(
                    identity,
                    { buffer: sharpBuffer, originalname: file.originalname, mimetype: file.mimetype },
                    smartObjectUuid,
                    uuid,
                    status
                );
            })
        );
    }

    writeMongoFile(
        identity: IdentityRequest,
        file: UploadFile,
        smartObjectUuid: string = null,
        uuid: string = null,
        status?: string,
        thumbnail = true): Observable<any> {
        const metadata: Metadata = {
            uuid: uuid ? uuid : UUID.UUID(),
            customerKey: identity.customerKey,
            createdBy: identity.login,
            createdDate: moment().format(),
            indexationDate: null,
        };
        if (status)
            Object.assign(metadata, { status });
        if (smartObjectUuid)
            Object.assign(metadata, { smartObject: smartObjectUuid });

        if (!file.buffer && !file.base64) {
            throw new Error('write process must contains buffer or base64');
        }
        const buffer = file.buffer ? file.buffer : Buffer.from(file.base64, 'base64');
        const stream = this.bufferToStream(buffer);

        const imageRegex = /^image\/.*/i;
        const thumbnailRegex = /.*_thumbnail-.$/i;
        const iconPlayerRegex = /^player_icon-[0-9]{2,3}x[0-9]{2,3}$/i;

        const fileIsImage = imageRegex.test(file.mimetype);
        const fileIsThumbnail = thumbnailRegex.test(uuid);
        const fileIsIconPlayer = iconPlayerRegex.test(uuid);

        return from(this.documentFS.writeFileStream(
            stream,
            {
                filename: file.originalname,
                contentType: file.mimetype,
                metadata,
            },
        )).pipe(
            map(data => {
                const fileInfo: FileInfo = {
                    fileId: data._id.toString(),
                    uploadDate: moment(data.uploadDate).format(),
                    length: data.length,
                    chunkSize: data.length,
                    filename: data.filename,
                    md5: data.md5,
                    mimetype: data.contentType,
                    metadata,
                };
                return {
                    result: 'success',
                    fileInfo,
                };
            }),
            mergeMap((res) => {
                let sharp;
                try {
                    sharp = require('sharp');
                } catch (e) {
                    return of(res);
                }
                if (uuid === 'player' && !fileIsIconPlayer) {
                    const rzTo = [
                        { w: 36, h: 36, uuid: `${uuid}_icon-36x36` },
                        { w: 48, h: 48, uuid: `${uuid}_icon-48x48` },
                        { w: 72, h: 72, uuid: `${uuid}_icon-72x72` },
                        { w: 96, h: 96, uuid: `${uuid}_icon-96x96` },
                        { w: 144, h: 144, uuid: `${uuid}_icon-144x144` },
                        { w: 192, h: 192, uuid: `${uuid}_icon-192x192` },
                        { w: 256, h: 256, uuid: `${uuid}_icon-256x256` },
                        { w: 384, h: 384, uuid: `${uuid}_icon-384x384` },
                        { w: 512, h: 512, uuid: `${uuid}_icon-512x512` }
                    ];
                    const sharpImage$ = rzTo.map((r: { w: number, h: number, uuid: string }) =>
                        this.resizeImage(sharp, identity, buffer, file, smartObjectUuid, r.uuid, status, r.w, r.h)
                    );
                    return zip(...sharpImage$).pipe(
                        catchError((e) => of(res)),
                        map(() => res),
                    );
                } else {
                    if (thumbnail && fileIsImage && !fileIsThumbnail && !fileIsIconPlayer) {
                        const rzTo = [
                            { w: 350, h: 350, uuid: `${uuid}_thumbnail-m` },
                            { w: 170, h: 170, uuid: `${uuid}_thumbnail-s` },
                        ];
                        const sharpImage$ = rzTo.map((r: { w: number, h: number, uuid: string }) =>
                            this.resizeImage(sharp, identity, buffer, file, smartObjectUuid, r.uuid, status, r.w, r.h)
                        );

                        return zip(...sharpImage$).pipe(
                            catchError((e) => of(res)),
                            map(() => res),
                        );
                    }
                }
                return of(res);
            }),
        );
    }

    deleteTemplateFileByUuid(uuid): Observable<boolean> {
        return from(
            this.documents.find({ 'metadata.uuid': uuid }, { _id: 1 }),
        ).pipe(
            catchError((err) => {
                return of(false);
            }),
            mergeMap((file: any) => {
                if (file.length !== 1) {
                    return of(false);
                }
                return this._deleteBucket(file[0]._id);
            }),
            catchError((err) => {
                return of(false);
            }),
        );
    }

    _deleteBucket(id): Observable<boolean> {
        const attachment = createBucket(
            {
                bucketName: 'documents',
                connection: this.connection,
            }
        );

        return new Observable((obs) => {
            attachment.deleteFile(id, (error, results) => {
                if (error) {
                    obs.error(false);
                } else {
                    obs.next(true);
                    obs.complete();
                }
            });
        });
    }
}
