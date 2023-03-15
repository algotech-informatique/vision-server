import { Controller, Post, Body, Get, Param, UseGuards, Delete, Patch, Query, UseInterceptors, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WorkflowModelDto, PatchPropertyDto, DeleteDto, CacheDto } from '@algotech/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { NatsService, WorkflowModelsHead } from '../providers';
import { IdentityRequest, WorkflowModel } from '../interfaces';
import { ActionCode, Identity } from '../common/@decorators';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';

@Controller('workflow-models')
@ApiTags('Workflow Models')
export class WorkflowModelsController {
    constructor(
        private readonly workflowModelsHead: WorkflowModelsHead,
        private readonly nats: NatsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(
        @Identity() identity: IdentityRequest,
        @Body() workflowModel: WorkflowModelDto,
    ): Observable<WorkflowModelDto> {
        return this.nats.httpResult(this.workflowModelsHead.create({ identity, data: workflowModel }), WorkflowModelDto);
    }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.workflowModelsHead.cache({ identity, date }), CacheDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findAll(@Identity() identity: IdentityRequest, @Query('filter') filter: string): Observable<WorkflowModelDto[]> {
        return this.nats.httpResult(this.workflowModelsHead.find({ identity }), WorkflowModelDto, filter);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    find(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
        @Query('filter') filter: string,
    ): Observable<WorkflowModelDto> {
        return this.nats.httpResult(this.workflowModelsHead.find({ identity, uuid }), WorkflowModelDto, filter);
    }

    @Get('/key/:key')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findByKey(
        @Identity() identity: IdentityRequest,
        @Param('key') key: string,
        @Query('filter') filter: string,
    ): Observable<WorkflowModelDto> {
        return this.nats.httpResult(this.workflowModelsHead.find({ identity, key }), WorkflowModelDto, filter);
    }

    @Get('/smartnodes/:snModelUuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findByView(@Identity() identity: IdentityRequest, @Param('snModelUuid') snModelUuid): Observable<WorkflowModelDto> {
        return this.nats.httpResult(this.workflowModelsHead.find({ identity, snModelUuid }), WorkflowModelDto);
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    delete(@Identity() identity: IdentityRequest, @Body() data: DeleteDto) {
        return this.nats.httpResult(this.workflowModelsHead.delete({ identity, data: data.uuid }));
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.workflowModelsHead.patch({ identity, data: { uuid, patches } }));
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    publish(@Identity() identity: IdentityRequest, @Body() workflow: WorkflowModelDto) {
        return this.nats.httpResult(this.workflowModelsHead.publish({ identity, workflow: workflow as WorkflowModel }), WorkflowModelDto);
    }
}
