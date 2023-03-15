import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Observable } from 'rxjs';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { NatsService, SmartTasksHead } from '../providers';
import { ActionCode, Identity } from '../common/@decorators';
import { IdentityRequest } from '../interfaces';
import { SmartTaskDto, SmartTaskLogDto } from '@algotech/core';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { tap } from 'rxjs/operators';
import { ApiTags } from '@nestjs/swagger';
import { KcAdmin } from '../common/@decorators/kcadmin/kcadmin.decorator';
import { Roles } from '../common/@decorators/roles/roles.decorator';

@Controller('smart-tasks')
@ApiTags('Smart Tasks')
export class SmartTasksController {

    constructor(
        private smartTasksHead: SmartTasksHead,
        private readonly nats: NatsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(@Identity() identity: IdentityRequest, @Body() smartTaskDto: SmartTaskDto): Observable<SmartTaskDto> {
        return this.nats.httpResult(this.smartTasksHead.create({ identity, smartTaskDto }), SmartTaskDto);
    }

    @Get()
    @UseInterceptors(DataCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findAll(
        @Identity() identity: IdentityRequest, @Query('skip') skip, @Query('limit') limit,
        @Query('sort') sort?: string, @Query('order') order?: string, @Query('status') status?: string): Observable<SmartTaskDto[]> {

        const numskip = skip ? +skip : 0;
        const numlimit = limit ? + limit : 100;
        return this.nats.httpResult(this.smartTasksHead.findAll(
            { identity, skip: numskip, limit: numlimit, order, sort, status }), SmartTaskDto);
    }

    @Get(':uuid')
    @UseInterceptors(DataCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findByUuid(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string): Observable<SmartTaskDto> {
        return this.nats.httpResult(this.smartTasksHead.findByUuid({ identity, uuid }), SmartTaskDto);
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    update(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
        @Body() updateSmartTask: SmartTaskDto) {
        return this.nats.httpResult(this.smartTasksHead.update({ identity, uuid, updateSmartTask }), SmartTaskDto);
    }

    @Patch('setState/:uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    setState(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
        @Query('enable') enable?,
        @Query('disable') disable?) {

        return this.nats.httpResult(this.smartTasksHead.setState(
            { identity, uuid, isEnabled: disable === undefined || enable !== undefined }));
    }

    @Delete(':uuid')
    @UseInterceptors(DataCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    delete(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string): Observable<{ acknowledged: boolean }> {
        return this.nats.httpResult(this.smartTasksHead.delete({ identity, uuid }));
    }

    @Delete('/deleteByFlowKey/:flowkey')
    @UseInterceptors(DataCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    deleteByFlowKey(@Identity() identity: IdentityRequest, @Param('flowkey') flowKey: string): Observable<SmartTaskDto[]> {
        return this.nats.httpResult(this.smartTasksHead.deleteByFlowKey({ identity, flowKey }));
    }

    @Get('/logs/:uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findLogsForSmartTask(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string): Observable<SmartTaskLogDto[]> {
        return this.nats.httpResult(this.smartTasksHead.findLogsForSmartTask(
            { identity, uuid }), SmartTaskLogDto);
    }

    @Patch('bindJobs/:customerKey')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    bindJobs(
        @Identity() identity: IdentityRequest,
        @Param('customerKey') customerKey: string) {
        return this.nats.httpResult(this.smartTasksHead.unlockAndBindJobs(customerKey).pipe(
            tap((started) => {
                if (started) {
                    process.stdout.write('jobs unlocked and binded, Agenda started');
                } else {
                    process.stdout.write('Agenda failed to start');
                }
            })));
    }
}
