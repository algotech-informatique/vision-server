import {
    Controller, Param, Get, Post, UseGuards, UseInterceptors, UploadedFile,
    UploadedFiles, Res, BadRequestException, Body, Delete, Query, Put, NotFoundException
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Observable, of, throwError } from 'rxjs';
import { FileUploadDto } from '@algotech-ce/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ATSignatureDto, FileEditDto } from '@algotech-ce/core';
import { ActionCode, Identity } from '../common/@decorators';
import { FilesHead, NatsService, UtilsService } from '../providers';
import { Document, IdentityRequest, SmartObject } from '../interfaces';
import { BroadcastingMode } from '../common/@websockets/web-sockets.service';
import { DocumentsHead } from '../providers/documents/documents.head';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger';

const pathDefaultIcons = '/usr/src/app/dist/assets/player/icons/';

@Controller('files')
@ApiTags('Files')
export class FilesController {
    constructor(
        private readonly nats: NatsService,
        private readonly filesHead: FilesHead,
        private readonly documentsHead: DocumentsHead,
        private readonly utils: UtilsService,
    ) { }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    async readFile(
        @Res() res,
        @Param('uuid') id: string,
        @Query('byUUID') byUUID,
        @Query('download') download,
        @Identity() identity: IdentityRequest) {

        if (!byUUID) {
            this.filesHead.readFile(id, download, res);
        } else {
            await this.documentsHead.getFileByUUID({ identity, uuid: id })
                .toPromise().then((response) => {
                    if (!response._id) {
                        return res.status(400).end();
                    }
                    this.filesHead.readFile(response._id, download, res);
                },
                    () => {
                        return res.status(400).end();
                    });
        }
    }

    @Get('player/:uuid')
    @ActionCode('R')
    async readIconPlayer(
        @Res() res,
        @Param('uuid') id: string) {
        this.documentsHead.getFileByUUID({ identity: null, uuid: id }).pipe(
            catchError(() => {
                res.sendFile(`${pathDefaultIcons}${id}.png`);
                return of(null);
            }),
            catchError(() => {
                res.status(400).end();
                return of(null);
            }),
            map((response) => {
                return response ? this.filesHead.readFile(response._id, undefined, res) : of(null);
            }),
        ).subscribe();
    }

    @Post('upload/:uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ActionCode('C')
    uploadFileElement(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
        @UploadedFile() file): Observable<any> {

        if (!file) {
            throw new BadRequestException('no file in body');
        }

        return this.nats.httpResult(
            this.documentsHead.uploadDocument({
                identity,
                file: { buffer: file.buffer, originalname: this.utils.getFileNameToUTF8(file), size: file.size, mimetype: file.mimetype },
                uuid,
            }));
    }

    @Post('upload/player/icon')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ActionCode('C')
    uploadIconPlayer(
        @Identity() identity: IdentityRequest,
        @UploadedFile() file): Observable<any> {

        if (!file) {
            throw new BadRequestException('no file in body');
        }

        return this.nats.httpResult(
            this.documentsHead.uploadIconPlayer({
                identity,
                file: { buffer: file.buffer, originalname: this.utils.getFileNameToUTF8(file), size: file.size, mimetype: file.mimetype }
            }));
    }


    @Post('smart-object/:uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ActionCode('C')
    uploadDocument(
        @Identity() identity: IdentityRequest,
        @UploadedFile() file,
        @Param('uuid') uuid: string,
        @Body() details: FileUploadDto): Observable<string> {

        if (!file && !details.versionID) {
            throw new BadRequestException('no file in body');
        }

        return this.nats.httpResult(this.documentsHead.uploadSODocumentSkill({
            identity,
            file: file ? {
                buffer: file.buffer,
                originalname: this.utils.getFileNameToUTF8(file),
                size: file.size,
                mimetype: file.mimetype,
            } : null,
            uuid,
            details,
        }).pipe(
            tap((res: any) => {
                // websocket
                if (res?.document) {
                    this.notifyDocument(identity, identity.sessionId, 'add', { uuid, document: res?.document });
                }
            }),
        ));
    }

    @Put('smart-object/:uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    update(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid, @Body() update: FileEditDto) {
        return this.nats.httpResult(
            this.documentsHead.editSODocumentSkill(
                {
                    identity, uuid, update,
                },
            ).pipe(
                tap((document: Document) => {
                    // websocket
                    this.notifyDocument(identity, identity.sessionId, 'chg', document);
                }),
            ),
        );
    }

    @Post('signature/:signUuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ActionCode('C')
    uploadSignature(
        @Identity() identity: IdentityRequest,
        @UploadedFile() signature,
        @Param('signUuid') uuid: string,
        @Body() details: ATSignatureDto): Observable<string> {

        if (!signature) {
            throw new BadRequestException('no signature in body');
        }

        return this.nats.httpResult(
            this.documentsHead.uploadSignature(
                {
                    identity,
                    signature: {
                        buffer: signature.buffer,
                        originalname: this.utils.getFileNameToUTF8(signature),
                        size: signature.size,
                        mimetype: signature.mimetype,
                    },
                    uuid,
                    details,
                }));
    }

    @Delete('smart-object')
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    deleteDocument(
        @Identity() identity: IdentityRequest,
        @Body() details: {
            uuid: string,
            documentsID?: string[],
            versionsID?: string[],
        }): Observable<string> {

        if (!details.uuid || (!details.documentsID && !details.versionsID)) {
            throw new BadRequestException('no uuid in body');
        }

        return this.nats.httpResult(
            this.documentsHead.removeSODocumentSkill(
                {
                    identity,
                    uuid: details.uuid,
                    documentsID: details.documentsID,
                    versionsID: details.versionsID,
                }).pipe(
                    tap((smartObject: SmartObject) => {
                        this.notifyDocument(identity, identity.sessionId, 'rm', { uuid: details.uuid, documentsID: details.documentsID });
                    }),
                ),
        );
    }

    @Post('multi')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    @ActionCode('C')
    uploadFiles(@UploadedFiles() files) {
        return of('upload done');
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    getFile(@Res() res, @Param('id') id: string) {
        return of(`must read ${id}`);
    }

    private notifyDocument(identity: IdentityRequest, sessionId: string, pattern: string, payload: any) {
        process.emit('message', {
            cmd: 'socket.broadcast',
            data: {
                cmd: `event.document.${pattern}`,
                payload,
                client: { customerKey: identity.customerKey, sessionId },
                mode: [BroadcastingMode.IncludeMe, BroadcastingMode.MultiRoom],
            }
        }, null);
    }

}
