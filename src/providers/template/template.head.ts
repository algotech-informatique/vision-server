import { BadRequestException, Injectable } from '@nestjs/common';
import { mergeMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Metadata } from '@algotech/core';
import { FilesService } from '../files/files.service';
import { IdentityRequest, UploadFile } from '../../interfaces';

@Injectable()
export class TemplateHead {
    constructor(
        private readonly fileService: FilesService,
    ) { }

    uploadTemplate(data: {
        identity: IdentityRequest,
        file: UploadFile,
        uuid: string,
    }): Observable<{uuid: string}> {
        if (!data && !data.file && !data.file.mimetype) {
            return throwError(() => new BadRequestException('No mimetype provided'));
        }

        return this.fileService.writeMongoFile(data.identity, data.file, null, data.uuid, 'waiting').pipe(
            mergeMap((result) => {
                return this.fileService.getMetada(result.fileInfo.fileId).pipe(
                    mergeMap((meta: { metadata: Metadata; name: string; }) => {
                        return of({ uuid: meta.metadata.uuid });
                    }),
                );
            }),
        );
    }

    deleteTemplate(data: {
        identity: IdentityRequest,
        uuid,
    }): Observable<boolean> {
        if (!data && !data.uuid) {
            return throwError(() => new BadRequestException('No template uuid provided'));
        }
        return this.fileService.deleteTemplateFileByUuid(data.uuid);
    }

}
