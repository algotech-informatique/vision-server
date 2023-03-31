import { IdentityRequest, TagList } from '../interfaces';
import { ActionCode, Identity } from '../common/@decorators';
import { NatsService, TagsHead } from '../providers';
import { Controller, Param, Body, Get, Post, Delete, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CacheDto, TagListDto } from '@algotech-ce/core';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {

    constructor(private tagsHead: TagsHead, private readonly nats: NatsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findAll(@Identity() identity: IdentityRequest): Observable<TagListDto[]> {
        return this.nats.httpResult(this.tagsHead.findAll({ identity }), TagListDto);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findOne(@Identity() identity: IdentityRequest, @Param('uuid') uuid): Observable<TagListDto> {
        return this.nats.httpResult(this.tagsHead.findOne({ identity, uuid }), TagListDto);
    }

    @Get('/key/:key')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findByKey(@Identity() identity: IdentityRequest, @Param('key') key): Observable<TagListDto> {
        return this.nats.httpResult(this.tagsHead.findOne({ identity, key }), TagListDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(@Identity() identity: IdentityRequest, @Body() tagList: TagListDto): Observable<TagListDto> {
        return this.nats.httpResult(this.tagsHead.create({ identity, tagList: tagList as TagList }), TagListDto);
    }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.tagsHead.cache({ identity, date }), CacheDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    update(@Identity() identity: IdentityRequest, @Body() tagList: TagListDto) {
        return this.nats.httpResult(this.tagsHead.update({ identity, tagList: tagList as TagList }), TagListDto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    delete(@Identity() identity: IdentityRequest, @Body() data: { uuid: string }): Observable<{ uuid: string }> {
        return this.nats.httpResult(this.tagsHead.delete({ identity, uuid: data.uuid }));
    }

}
