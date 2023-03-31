import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { from, Observable, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { IdentityRequest, UploadFile } from '../../interfaces';
import { FilesService } from '../files/files.service';
import * as _ from 'lodash';
import { Metadata } from '@algotech-ce/core';
import { MongoGridFS } from 'mongo-gridfs';

@Injectable()
export class RasterHead {

    _tilesFS: MongoGridFS;
    get tilesFS() {
        if (!this._tilesFS && this.connection.db) {
            this._tilesFS = new MongoGridFS(this.connection.db, 'tiles');
        }
        return this._tilesFS;
    }

    constructor
        (@InjectConnection() private readonly connection,
        private readonly fileService: FilesService,
    ) { }

    readTile(rasterUuid: string, z: number, x: number, y: number, res) {
        const filter = {
            'metadata.rasterUuid': rasterUuid,
            'metadata.z': Number(z),
            'metadata.x': Number(x),
            'metadata.y': Number(y),
        };

        const findTile = from(this.tilesFS.find(filter));

        return findTile.pipe(
            mergeMap((tilesFiles: any) => {
                if (tilesFiles && tilesFiles.length > 0 && tilesFiles[0]._id)
                    return from(this.tilesFS.readFileStream(tilesFiles[0]._id));
                else
                    return of(null);
            }),
        );
    }

    uploadRaster(data: {
        identity: IdentityRequest,
        file: UploadFile,
        uuid: string,
    }): Observable<{ rasterUuid: string }> {
        if (!data && !data.file && !data.file.mimetype) {
            return throwError(() => new BadRequestException('No mimetype provided'));
        }

        return this.fileService.writeMongoFile(data.identity, data.file, null, data.uuid, 'waiting', false).pipe(
            mergeMap((result) => this.fileService.getMetada(result.fileInfo.fileId)),
            map((meta: { metadata: Metadata; name: string; }) => {
                return { rasterUuid: meta.metadata.uuid };
            }),
        );
    }

    getRasterMetadata(data: { identity: IdentityRequest; uuids: string[] }): Observable<any> {
        const metadatas$ = _.map(data.uuids, (uuid) => this.fileService.getMetadaByUuid(uuid));
        return metadatas$.length === 0 ? of([]) : zip(...metadatas$);
    }
}