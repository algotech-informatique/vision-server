import { IdentityRequest, Settings } from '../interfaces';
import { ActionCode, Identity } from '../common/@decorators';
import { SettingsHead, NatsService } from '../providers';
import { Controller, Param, Body, Get, Post, Put, UseGuards, Patch, Query, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SettingsDto, PatchPropertyDto } from '@algotech-ce/core';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { SettingsDataInterceptor } from '../common/@interceptors/settings-data.interceptor';

@Controller('settings')
@ApiTags('Settings')
@UseInterceptors(SettingsDataInterceptor)
export class SettingsController {

    constructor(
        private settingsHead: SettingsHead,
        private readonly nats: NatsService,
        // private readonly auditTrailService: AuditTrailService,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findOne(@Identity() identity: IdentityRequest,
        @Query('show') show: string): Observable<SettingsDto> {
        return this.nats.httpResult(this.settingsHead.findOne({ identity }), SettingsDto, show);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(@Identity() identity: IdentityRequest, @Body() settings: SettingsDto): Observable<SettingsDto> {
        // this.auditTrailService.init().subscribe();
        return this.nats.httpResult(this.settingsHead.create({ identity, settings: settings as unknown as Settings }), SettingsDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    update(@Identity() identity: IdentityRequest, @Body() settings: SettingsDto) {
        // this.auditTrailService.init().subscribe();
        return this.nats.httpResult(this.settingsHead.update({ identity, settings: settings as unknown as Settings }), SettingsDto);
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {
        // this.auditTrailService.init().subscribe();
        return this.nats.httpResult(this.settingsHead.patch({ identity, uuid, patches }));
    }

}
