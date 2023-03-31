import {
    Controller, Param, Get, UseGuards, Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { IconDto } from '@algotech-ce/core';
import { IconsHead, NatsService } from '../providers';
import { ApiTags } from '@nestjs/swagger';

@Controller('icons')
@ApiTags('Icons')
export class IconsController {
    constructor(private readonly nats: NatsService, private readonly iconsHead: IconsHead) { }

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
}