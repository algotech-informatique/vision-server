import { IdentityRequest, Group } from '../interfaces';
import { ActionCode, Identity } from '../common/@decorators';
import { GroupHead, NatsService } from '../providers';
import { Controller, Param, Body, Get, Post, Delete, Put, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CacheDto, GroupDto } from '@algotech-ce/core';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { SettingsDataInterceptor } from '../common/@interceptors/settings-data.interceptor';

@Controller('groups')
@ApiTags('Groups')
@UseInterceptors(SettingsDataInterceptor)
export class GroupsController {

    constructor(private groupHead: GroupHead, private readonly nats: NatsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findAll(@Identity() identity: IdentityRequest): Observable<GroupDto[]> {
        return this.nats.httpResult(this.groupHead.findAll({ identity }), GroupDto);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findOne(@Identity() identity: IdentityRequest, @Param('uuid') uuid): Observable<GroupDto> {
        return this.nats.httpResult(this.groupHead.findOne({ identity, uuid }), GroupDto);
    }

    @Get('/key/:key')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findByKey(@Identity() identity: IdentityRequest, @Param('key') key): Observable<GroupDto> {
        return this.nats.httpResult(this.groupHead.findOne({ identity, key }), GroupDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(@Identity() identity: IdentityRequest, @Body() group: GroupDto): Observable<GroupDto> {
        return this.nats.httpResult(this.groupHead.create({ identity, group: group as Group }), GroupDto);
    }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        throw new BadRequestException('Route not implemented');
        // return this.nats.httpResult(this.groupHead.cache({ identity, date }), CacheDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    update(@Identity() identity: IdentityRequest, @Body() group: GroupDto) {
        return this.nats.httpResult(this.groupHead.update({ identity, group: group as Group }), GroupDto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    delete(@Identity() identity: IdentityRequest, @Body() data: { uuid: string }): Observable<boolean> {
        return this.nats.httpResult(this.groupHead.delete({ identity, uuid: data.uuid }));
    }

}
