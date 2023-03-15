import { Controller, Get, Param, UseGuards, Res, UseInterceptors, UploadedFile, Post, BadRequestException } from '@nestjs/common';
import { DocumentsHead } from '../providers';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('convert')
@ApiTags('Convert')
export class ConvertController {

    constructor(
        private readonly documentsHead: DocumentsHead,
    ) { }

    @Get('docxtopdf/:versionId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async libreofficeConvert(
        @Res() res,
        @Param('versionId') versionId,
    ) {
        this.documentsHead.convertToPdf(versionId).subscribe((convertedFile: { filename: string, buffer: Buffer }) => {
            res.setHeader('Content-Disposition', `filename="${encodeURIComponent('converted.pdf')}"`);
            res.setHeader('Content-Type', 'application/pdf; charset=utf-8');
            res.end(Buffer.from(convertedFile.buffer));
        },
            (err) => {
                res.status(400).end(err);
                return ;
            });

    }

    @Post('docxtopdf')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async libreofficeConvertWithFile(
        @Res() res,
        @UploadedFile() file,
    ) {
        if (!file?.buffer) {
            throw new BadRequestException('no file in body');
        }
        this.documentsHead.convertToPdfWithFile(file.buffer).subscribe((convertedFile: { filename: string, buffer: Buffer }) => {
            res.setHeader('Content-Disposition', `filename="${encodeURIComponent('converted.pdf')}"`);
            res.setHeader('Content-Type', 'application/pdf; charset=utf-8');
            res.end(Buffer.from(convertedFile.buffer));
        },
            (err) => {
                res.status(400).end(err);
                return ;
            });

    }
}
