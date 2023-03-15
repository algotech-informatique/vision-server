import { IdentityRequest, SnModel } from '../interfaces';
import { Identity } from '../common/@decorators';
import { NatsService, SmartNodesHead } from '../providers';
import { Controller, Post, Body, Get, Param, UseGuards, Put, Delete, Patch, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SnModelDto, PatchPropertyDto, CacheDto } from '@algotech/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';

@Controller('smartnodes')
@ApiTags('Smart Nodes')
export class SmartNodesController {

    constructor(private smartNodesHead: SmartNodesHead, private readonly nats: NatsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findAll(@Identity() identity: IdentityRequest): Observable<SnModelDto[]> {
        return this.nats.httpResult(this.smartNodesHead.find({ identity }));
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findOne(@Identity() identity: IdentityRequest, @Param('uuid') uuid): Observable<SnModelDto> {
        return this.nats.httpResult(this.smartNodesHead.find({ identity, uuid }), SnModelDto);
    }

    @Get('/key/:key')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findByKey(@Identity() identity: IdentityRequest, @Param('key') key): Observable<SnModelDto> {
        return this.nats.httpResult(this.smartNodesHead.find({ identity, key }), SnModelDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(@Identity() identity: IdentityRequest, @Body() data: SnModelDto): Observable<SnModelDto> {
        return this.nats.httpResult(this.smartNodesHead.create({ identity, data: { customerKey: identity.customerKey, deleted: false, ...data } as SnModel }), SnModelDto);
    }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.smartNodesHead.cache({ identity, date }), CacheDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    update(@Identity() identity: IdentityRequest, @Body() data: SnModelDto) {
        return this.nats.httpResult(this.smartNodesHead.update({ identity, data: { customerKey: identity.customerKey, deleted: false, ...data } as SnModel }), SnModelDto);
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.smartNodesHead.patch({ identity, data: { uuid, patches } }));
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    delete(@Identity() identity: IdentityRequest, @Body() data: { uuid: string }): Observable<boolean> {
        return this.nats.httpResult(this.smartNodesHead.delete({ identity, data: data.uuid }));
    }

}
