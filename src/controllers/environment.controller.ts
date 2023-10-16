import { Controller, Param, Body, Get, Post, Put, UseGuards, Patch, UseInterceptors } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { PatchPropertyDto, EnvironmentDto, EnvironmentConnectorDto } from '@algotech-ce/core';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { NatsService, EnvironmentHead } from '../providers';
import { Environment, IdentityRequest } from '../interfaces';
import { Identity } from '../common/@decorators';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { SettingsDataInterceptor } from '../common/@interceptors/settings-data.interceptor';

@Controller('environment')
@ApiTags('Environment')
@UseInterceptors(SettingsDataInterceptor)
export class EnvironmentController {

    constructor(private environmentHead: EnvironmentHead, private readonly nats: NatsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findOne(@Identity() identity: IdentityRequest): Observable<EnvironmentDto> {
        return this.nats.httpResult(this.environmentHead.findOne({ identity }), EnvironmentDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(@Identity() identity: IdentityRequest, @Body() data: EnvironmentDto): Observable<EnvironmentDto> {
        return this.nats.httpResult(this.environmentHead.create({ identity, data: data as Environment }), EnvironmentDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    update(@Identity() identity: IdentityRequest, @Body() data: EnvironmentDto) {
        return this.nats.httpResult(this.environmentHead.update({ identity, data: data as Environment }), EnvironmentDto);
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.environmentHead.patch({ identity, data: { uuid, patches } }));
    }

    @Get('/parameters')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    getParameters(@Identity() identity: IdentityRequest) {
        return this.nats.httpResult(this.environmentHead.getParameters({ identity }), EnvironmentConnectorDto);
    }

    @Put('/parameters')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    setParameters(@Identity() identity: IdentityRequest, @Body() connectors: EnvironmentConnectorDto[]) {
        return this.nats.httpResult(this.environmentHead.setParameters({ identity, connectors }), EnvironmentConnectorDto);
    }

    @Get('/encrypt/:password')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    encrypt(@Param('password') password: string) {
        return this.nats.httpResult(of(this.environmentHead.encryptPassword(password)));
    }

    @Get('/decrypt/:encryptedString')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    decrypt(@Param('encryptedString') encryptedString: string) {
        return this.nats.httpResult(of(this.environmentHead.decryptPassword(encryptedString)));
    }
}
