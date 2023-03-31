import { Controller, Param, Get, UseGuards, Post, Body, Delete, Patch, Put, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Observable } from 'rxjs';
import { CacheDto, GenericListDto, GenericListValueDto, PatchPropertyDto } from '@algotech-ce/core';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { GenericListsHead, NatsService } from '../providers';
import { GenericList, IdentityRequest } from '../interfaces';
import { ActionCode, Identity } from '../common/@decorators';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { SettingsDataInterceptor } from '../common/@interceptors/settings-data.interceptor';

@Controller('glists')
@ApiTags('GLists')
@UseInterceptors(SettingsDataInterceptor)
export class GenericListsController {
    constructor(private genericListsHead: GenericListsHead, private readonly nats: NatsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findAll(@Identity() identity: IdentityRequest): Observable<GenericListDto[]> {
        return this.nats.httpResult(this.genericListsHead.getAll({ identity }), GenericListDto);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findOne(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string): Observable<GenericListDto> {
        return this.nats.httpResult(this.genericListsHead.get({ identity, uuid }), GenericListDto);
    }

    @Get('/key/:key')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findByKey(@Identity() identity: IdentityRequest, @Param('key') keyList: string): Observable<GenericListDto> {
        return this.nats.httpResult(this.genericListsHead.getByKey({ identity, keyList }), GenericListDto);
    }

    @Get('/key/:keyList/:keyValue')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findByKeyValue(
        @Identity() identity: IdentityRequest,
        @Param('keyList') keyList: string,
        @Param('keyValue') keyValue: string,
    ): Observable<GenericListValueDto> {
        return this.nats.httpResult(this.genericListsHead.getByKey({ identity, keyList, keyValue }), GenericListValueDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(@Identity() identity: IdentityRequest, @Body() gList: GenericListDto): Observable<GenericListDto> {
        return this.nats.httpResult(this.genericListsHead.create({ identity, gList: gList as GenericList }), GenericListDto);
    }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.genericListsHead.cache({ identity, date }), CacheDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    update(@Identity() identity: IdentityRequest, @Body() updateGenericList: GenericListDto) {
        return this.nats.httpResult(this.genericListsHead.update({ identity, updateGenericList: updateGenericList as GenericList }), GenericListDto);
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.genericListsHead.patch({ identity, data: { uuid, patches } }));
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    delete(@Identity() identity: IdentityRequest, @Body() data: { uuid: string }): Observable<boolean> {
        return this.nats.httpResult(this.genericListsHead.delete({ identity, uuid: data.uuid }));
    }
}