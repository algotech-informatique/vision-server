import { Controller, Get, UseGuards, Post, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Observable } from 'rxjs';
import { I18nHead, NatsService } from '../providers';
import { IdentityRequest } from '../interfaces';
import { Identity } from '../common/@decorators';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller('i18n')
@ApiTags('i18n')
export class I18nController {
    constructor(private i18nHead: I18nHead, private readonly nats: NatsService) { }

    @Get('/export')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    @UseGuards(JwtAuthGuard)
    export(@Identity() identity: IdentityRequest, @Res() res: Response) {
        this.i18nHead.export(identity.customerKey).subscribe((buffer) => {
            try {
                const stream = new Readable();
        
                stream.push(buffer);
                stream.push(null);
        
                res.set({
                    'Content-Type': 'text/csv',
                });
        
                stream.pipe(res);
            } catch (e) {
                res.status(400).end();
            }
        }, (err) => {
            res.status(400).end();
        })
    }

    @Post('/import')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    import(
        @Identity() identity: IdentityRequest,
        @UploadedFile() file): Observable<boolean> {
        if (!file) {
            throw new BadRequestException('no file in body');
        }
        return this.nats.httpResult(this.i18nHead.import(identity.customerKey, file.buffer));
    }
}