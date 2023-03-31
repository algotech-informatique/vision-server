import { Controller, Post, Body, Get, Param, UseGuards, Put, Delete, Patch, UseInterceptors, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SmartModelDto, DeleteDto, PatchPropertyDto, CacheDto } from '@algotech-ce/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { ActionCode, Identity } from '../common/@decorators';
import { IdentityRequest, SmartModel } from '../interfaces';
import { NatsService, SmartModelsHead } from '../providers';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { SettingsDataInterceptor } from '../common/@interceptors/settings-data.interceptor';

@Controller('smart-models')
@ApiTags('Smart Models')
@UseInterceptors(SettingsDataInterceptor)
export class SmartModelsController {
    constructor(
        private readonly nats: NatsService,
        private readonly smartModelsHead: SmartModelsHead) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(
        @Identity() identity: IdentityRequest,
        @Body() smartModel: SmartModelDto,
    ): Observable<SmartModelDto> {
        return this.nats.httpResult(this.smartModelsHead.create({ identity, data: smartModel }), SmartModelDto);
    }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.smartModelsHead.cache({ identity, date }), CacheDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findAll(
        @Identity() identity: IdentityRequest,
        @Query('system') system: boolean,
        @Query('skills') skills: string): Observable<SmartModelDto[]> {
        return this.nats.httpResult(this.smartModelsHead.find({ identity, system, skills }), SmartModelDto);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    find(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
    ): Observable<SmartModelDto | {}> {
        return this.nats.httpResult(this.smartModelsHead.find({ identity, uuid }), SmartModelDto);
    }

    @Get('/key/:key')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findByKey(
        @Identity() identity: IdentityRequest,
        @Param('key') key: string,
        @Query('submodel') submodel?: boolean,
    ): Observable<SmartModelDto | {}> {
        return this.nats.httpResult(this.smartModelsHead.find({ identity, key, submodel }), SmartModelDto);
    }

    @Put('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    update(@Identity() identity: IdentityRequest, @Body() changes: SmartModelDto) {
        return this.nats.httpResult(this.smartModelsHead.update({ identity, changes: changes as SmartModel }), SmartModelDto);
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    deleteSM(@Identity() identity: IdentityRequest, @Body() data: DeleteDto) {
        return this.nats.httpResult(this.smartModelsHead.delete( { identity, data: data.uuid }));
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.smartModelsHead.patch( { identity, uuid, patches }));
    }
}
