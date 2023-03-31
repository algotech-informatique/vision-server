import { Controller, Body, UseGuards, Query, UseInterceptors, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProcessMonitoringDto, ProcessMonitoringSearchDto, ProcessMonitoringType } from '@algotech-ce/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { AuthorizationInterceptor } from '../auth/interceptors/authorization.interceptor';
import * as _ from 'lodash';
import { ActionCode, Identity } from '../common/@decorators';
import { IdentityRequest } from '../interfaces';
import { NatsService, ProcessMonitoringHead } from '../providers';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';

@Controller('monitoring')
@ApiTags('monitoring')
export class ProcessMonitoringController {

    constructor(
        private readonly nats: NatsService,
        private monitoringHead: ProcessMonitoringHead) { }

    @Post()
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['sadmin'])
    getStatusAllProcess(
        @Identity() identity: IdentityRequest,
        @Body() processSearch: ProcessMonitoringSearchDto,
        @Query('skip') skip?,
        @Query('limit') limit?): Observable<ProcessMonitoringDto[]> {

        return this.nats.httpResult(this.monitoringHead.list(identity.customerKey, processSearch, skip, limit), ProcessMonitoringDto);
    }

    @Post('import/so')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['sadmin'])
    getStatusImportSo(
        @Identity() identity: IdentityRequest,
        @Query('skip') skip,
        @Query('limit') limit,
        @Body() processSearch: ProcessMonitoringSearchDto): Observable<ProcessMonitoringDto[]> {
        const processType: ProcessMonitoringType = 'importSos';
        return this.nats.httpResult(this.monitoringHead.list(identity.customerKey, processSearch, skip, limit, processType), ProcessMonitoringDto);
    }


    @Post('import/doc')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['sadmin'])
    getStatusImportDoc(
        @Identity() identity: IdentityRequest,
        @Query('skip') skip,
        @Query('limit') limit,
        @Body() processSearch: ProcessMonitoringSearchDto): Observable<ProcessMonitoringDto[]> {
        const processType: ProcessMonitoringType = 'importDoc';
        return this.nats.httpResult(this.monitoringHead.list(identity.customerKey, processSearch, skip, limit, processType), ProcessMonitoringDto);
    }

    @Post('import/i18n')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['sadmin'])
    getStatusImporti18n(
        @Identity() identity: IdentityRequest,
        @Query('skip') skip,
        @Query('limit') limit,
        @Body() processSearch: ProcessMonitoringSearchDto): Observable<ProcessMonitoringDto[]> {
        const processType: ProcessMonitoringType = 'importI18n';
        return this.nats.httpResult(this.monitoringHead.list(identity.customerKey, processSearch, skip, limit, processType), ProcessMonitoringDto);
    }

    @Post('indexation/so')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['sadmin'])
    getStatusIndexationSo(
        @Identity() identity: IdentityRequest,
        @Query('skip') skip,
        @Query('limit') limit,
        @Body() processSearch: ProcessMonitoringSearchDto): Observable<ProcessMonitoringDto[]> {
        const processType: ProcessMonitoringType = 'indexationSos';
        return this.nats.httpResult(this.monitoringHead.list(identity.customerKey, processSearch, skip, limit, processType), ProcessMonitoringDto);
    }

    @Post('indexation/doc')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['sadmin'])
    getStatusIndexationDoc(
        @Identity() identity: IdentityRequest,
        @Query('skip') skip,
        @Query('limit') limit,
        @Body() processSearch: ProcessMonitoringSearchDto): Observable<ProcessMonitoringDto[]> {
        const processType: ProcessMonitoringType = 'indexationDoc';
        return this.nats.httpResult(this.monitoringHead.list(identity.customerKey, processSearch, skip, limit, processType), ProcessMonitoringDto);
    }

    @Post('delete/so')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['sadmin'])
    getStatusDeleteSo(
        @Identity() identity: IdentityRequest,
        @Query('skip') skip,
        @Query('limit') limit,
        @Body() processSearch: ProcessMonitoringSearchDto): Observable<ProcessMonitoringDto[]> {
        const processType: ProcessMonitoringType = 'deleteSos';
        return this.nats.httpResult(this.monitoringHead.list(identity.customerKey, processSearch, skip, limit, processType), ProcessMonitoringDto);
    }
}