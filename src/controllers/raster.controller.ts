import {
    Controller,
    Param,
    Get,
    UseGuards,
    Res,
    Post,
    UseInterceptors,
    BadRequestException,
    UploadedFile,
    Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { from, map, Observable, of } from 'rxjs';
import { Metadata } from '@algotech-ce/core';
import { NatsService, RasterHead } from '../providers';
import { IdentityRequest, NatsResponse } from '../interfaces';
import { Identity } from '../common/@decorators';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('rasters')
@ApiTags('Rasters')
export class RasterController {
    constructor(
        private readonly rasterHead: RasterHead,
        private readonly nats: NatsService,
        @InjectQueue(process.env.CUSTOMER_KEY + '-rasters') private readonly rastersQueue: Queue,
    ) {}

    @Post('/metadata/')
    @UseGuards(JwtAuthGuard)
    getMetadata(@Identity() identity: IdentityRequest, @Body() body: Array<string>): Observable<Metadata> {
        return this.nats.httpResult(
            this.rasterHead.getRasterMetadata({
                identity,
                uuids: body,
            }),
        );
    }

    @Get(':rasterUuid/:z/:x/:y.png')
    // @UseGuards(JwtAuthGuard) // TODO verifier compatibilité guards
    readFile(
        @Res() res: any,
        @Param('rasterUuid') rasterUuid: string,
        @Param('z') z: number,
        @Param('x') x: number,
        @Param('y') y: number,
    ) {
        this.rasterHead.readTile(rasterUuid, z, x, y, res).subscribe(
            (item) => {
                if (!item) {
                    return res.status(404).end();
                }
                item.once('error', () => {
                    return res.status(404).end();
                }).pipe(res);
            },
            (err) => this.nats.errorResponse(500, err),
        );
    }

    @Post(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    uploadRaster(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
        @UploadedFile() file: any,
    ): Observable<{ rasterUuid: string }> {
        if (!file) {
            throw new BadRequestException('no file in body');
        }
        return this.nats.httpResult(
            this.rasterHead.uploadRaster({
                identity,
                file: { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
                uuid,
            }),
        );
    }

    @Post('launch/:uuid')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    launchRaster(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string): Observable<NatsResponse> {
        if (!uuid) return of(this.nats.errorResponse(400, 'No raster uuid provided'));

        return this.nats.httpResult(
            from(
                this.rastersQueue.add('raster-launch', {
                    identity,
                    uuid,
                }),
            ).pipe(map((d) => ({ rasterUuid: uuid }))),
        );
    }

    @Post('deleteFile/:uuid')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    deleteRaster(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string): Observable<NatsResponse> {
        if (!uuid) return of(this.nats.errorResponse(400, 'No raster uuid provided'));

        return this.nats.httpResult(
            from(
                this.rastersQueue.add('raster-delete-file', {
                    identity,
                    uuid,
                }),
            ).pipe(map((d) => ({ rasterUuid: uuid }))),
        );
    }
}
