import {
    Controller, Param, Get, Post, UseGuards, UseInterceptors, UploadedFile,
    Res, BadRequestException, Body, Patch, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { IconDto } from '@algotech/core';
import { IconsHead, NatsService } from '../providers';
import { ApiTags } from '@nestjs/swagger';

@Controller('icons')
@ApiTags('Icons')
export class IconsController {
    constructor(private readonly nats: NatsService, private readonly iconsHead: IconsHead) { }

    @Get('/display/:iconId')
    @UseGuards(JwtAuthGuard)
    readIconStream(@Res() res, @Param('iconId') iconId: string) {
        res.set('Content-Type', 'image/svg+xml');
        this.iconsHead.readIconStream(iconId, res);
    }

    @Get('/read/:iconName')
    @UseGuards(JwtAuthGuard)
    readIconStreamByName(@Res() res, @Param('iconName') iconName: string) {
        res.set('Content-Type', 'image/svg+xml');
        this.iconsHead.readIconStreamByName(iconName, res);
    }

    @Get(':iconId')
    @UseGuards(JwtAuthGuard)
    readIcon(@Param('iconId') iconId: string): Observable<IconDto> {
        return this.nats.httpResult(this.iconsHead.findById({ id: iconId }));
    }

    @Get('/name/:name')
    @UseGuards(JwtAuthGuard)
    searchIconByName(@Param('name') name: string): Observable<any> {
        return this.nats.httpResult(this.iconsHead.findByName({ name }));
    }

    @Get('/search/:term')
    @UseGuards(JwtAuthGuard)
    searchIcon(
        @Param('term') term: string,
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
    ): Observable<IconDto[]> {
        return this.nats.httpResult(this.iconsHead.search({ term, page, pageSize }));
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    readAllIcons(
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
    ): Observable<IconDto[]> {
        return this.nats.httpResult(this.iconsHead.find({ page, pageSize }));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('icon'))
    uploadIcon(
        @UploadedFile() icon): Observable<any> {
        if (!icon) {
            throw new BadRequestException('no icon in body');
        }
        const tags: string[] = [];
        return this.nats.httpResult(
            this.iconsHead.uploadIcon({
                icon: { buffer: icon.buffer, originalname: icon.originalname, mimetype: icon.mimetype },
                tags,
            }));
    }

    @Patch(':iconId')
    @UseGuards(JwtAuthGuard)
    update(@Param('iconId') id: string, @Body() data: { tags: string }) {
        let tags: string[] = [];
        if (data.tags !== undefined) {
            if (data.tags.length !== 0) {
                tags = data.tags.split(',');
            }
        }
        return this.nats.httpResult(this.iconsHead.update({
            id,
            tags,
        }));
    }
}