import { Controller, Post, UseGuards, UseInterceptors, Param, UploadedFile, BadRequestException, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { Identity } from '../common/@decorators';
import { IdentityRequest } from '../interfaces';
import { NatsService, TemplateHead } from '../providers';
import { Roles } from '../common/@decorators/roles/roles.decorator';

@Controller('templates')
@ApiTags('Templates')
export class TemplatesController {

    constructor(private readonly nats: NatsService, private readonly templateHead: TemplateHead) { }

    @Post(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    uploadRaster(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
        @UploadedFile() file: any,
    ): Observable<{ uuid: string }> {
        if (!file) {
            throw new BadRequestException('no file in body');
        }
        return this.nats.httpResult(
            this.templateHead.uploadTemplate({
                    identity,
                    file: { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
                    uuid,
                },
            ),
        );
    }

    @Delete('deleteFile/:uuid')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    deleteRaster(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
    ): Observable<boolean> {
        return this.nats.httpResult(
            this.templateHead.deleteTemplate(
                {
                    identity,
                    uuid,
                },
            ),
        );
    }
}
