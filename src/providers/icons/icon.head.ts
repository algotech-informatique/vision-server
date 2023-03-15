import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { IconService } from './icon.service';
import { FilesService } from '../files/files.service';
import { FileIcon, UploadFile } from '../../interfaces';
import { MongoGridFS } from 'mongo-gridfs';

@Injectable()
export class IconsHead {

    _iconFS: MongoGridFS;
    get iconFS() {
        if (!this._iconFS && this.connection.db) {
            this._iconFS = new MongoGridFS(this.connection.db, 'icons');
        }
        return this._iconFS;
    }

    constructor(
        private readonly fileService: FilesService,
        private readonly iconService: IconService,
        @InjectConnection() private readonly connection,
    )  { }

    public readIconStream(id: string, res) {
        const findItem = from(this.iconFS.findById(id).catch((err) => {
            return res.status(400).end();
        }));
        const readFile = from(this.iconFS.readFileStream(id));
        const result = findItem.pipe(
            mergeMap((data) => {
                return readFile;
            }),
        );
        return result.subscribe((item) => {
            item
                .once('error', () => {
                    return res.status(400).end();
                }).pipe(res);
        }, (err) => res.status(500));
    }

    public readIconStreamByName(name: string, res) {

        const findItem = from(this.iconFS.findOne({ filename: `${name}.svg` }).catch((err) => {
            return res.status(400).end();
        }));
        return findItem.pipe(
            mergeMap((data) => {
                const readFile = from(this.iconFS.readFileStream(data._id));
                return readFile;
            }),
        ).subscribe((item) => {
            item
                .once('error', () => {
                    return res.status(400).end();
                }).pipe(res);
        }, (err) => res.status(500));
    }

    private _uploadIconToDb(data): Observable<any> {
        return this.iconService.writeMongoIcon(data.tags, data.icon).pipe(
            mergeMap(() => {
                return of({ icon: data.icon.originalname, tags: data.tags });
            }),
        );
    }

    uploadIcon(data: {
        icon: UploadFile,
        tags: string[],
    }): Observable<any> {
        if (!data && !data.icon && !data.icon.mimetype) {
            return throwError(() => new BadRequestException('No mimetype provided'));
        }
        return this._uploadIconToDb(data);
    }

    findById(data: { id: string }): Observable<any> {
        return this.iconService.readIconById(data.id);
    }

    findByName(data: { name: string }): Observable<any> {
        return this.iconService.readIconByName(data.name).pipe(
            catchError((err: any) => {
                return throwError(() => new BadRequestException('icon not found'));
            }),
        );
    }

    find(data: {
        page: number,
        pageSize: number,
    }): Observable<any[]> {
        let nbPage: number;
        let nbPageSize: number;

        nbPage = data.page ? +data.page : 1;
        nbPageSize = data.pageSize ? +data.pageSize : 20;

        return this.iconService.readAllIcons(nbPage, nbPageSize);
    }

    update(data: {
        id: string,
        tags: string[],
    }): Observable<FileIcon> {
        return this.iconService.updateIcon(data.id, data.tags);
    }

    search(data: {
        term: string,
        page: number,
        pageSize: number,
    }): Observable<any[]> {
        let nbPage: number;
        let nbPageSize: number;

        nbPage = data.page ? data.page : 1;
        nbPageSize = data.pageSize ? data.pageSize : 20;

        return this.iconService.searchIcon(data.term, nbPage, nbPageSize);
    }

}