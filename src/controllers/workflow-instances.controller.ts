import { Controller, Post, Body, Get, Param, UseGuards, Delete, Patch, Put, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
    DeleteDto, WorkflowInstanceDto, PatchPropertyDto, PairDto, WorkflowInstanceUpdateDto, WorkflowOperationDto,
    WorkflowInstanceAbstractDto,
    WorkflowLaunchOptionsDto,
} from '@algotech/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { NatsService, WorkflowInstancesHead } from '../providers';
import { ActionCode, Identity } from '../common/@decorators';
import { IdentityRequest, WorkflowInstance } from '../interfaces';
import { WorkflowInterpretorHead } from '../providers/workflow-interpretor';
import { ApiTags } from '@nestjs/swagger';

@Controller('workflow-instances')
@ApiTags('Workflow Instances')
export class WorkflowInstancesController {
    constructor(
        private readonly workflowInterpretorHead: WorkflowInterpretorHead,
        private readonly workflowInstancesHead: WorkflowInstancesHead,
        private readonly nats: NatsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    create(
        @Identity() identity: IdentityRequest,
        @Body() workflowInstance: WorkflowInstance,
    ): Observable<boolean> {
        return this.nats.httpResult(this.workflowInstancesHead.create({ identity, data: workflowInstance }), WorkflowInstanceDto);
    }

    @Post('zip')
    @UseGuards(JwtAuthGuard)
    zip(
        @Identity() identity: IdentityRequest,
        @Body() operations: WorkflowOperationDto[],
    ): Observable<WorkflowInstanceDto> {
        return this.nats.httpResult(this.workflowInstancesHead.save({ identity, operations }));
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findAll(@Identity() identity: IdentityRequest): Observable<WorkflowInstanceDto[]> {
        return this.nats.httpResult(this.workflowInstancesHead.find({ identity }));
    }

    @Get(':uuid')
    @UseInterceptors(DataCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    find(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
    ): Observable<WorkflowInstanceDto> {
        return this.nats.httpResult(this.workflowInstancesHead.find({ identity, uuid }), WorkflowInstanceDto);
    }

    @Post('/byModel')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findByModel(
        @Identity() identity: IdentityRequest,
        @Body() data: { uuid: string[], data: PairDto[] },
    ): Observable<WorkflowInstanceAbstractDto> {
        return this.nats.httpResult(this.workflowInstancesHead.find({ identity, data }), WorkflowInstanceAbstractDto);
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    delete(@Identity() identity: IdentityRequest, @Body() data: DeleteDto) {
        return this.nats.httpResult(this.workflowInstancesHead.delete({ identity, data: data.uuid }));
    }

    @Put('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    update(@Identity() identity: IdentityRequest, @Body() updateWorkflowInstance: WorkflowInstance) {
        return this.nats.httpResult(this.workflowInstancesHead.update({
            identity,
            updateWorkflowInstance: updateWorkflowInstance as any
        },
        ));
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.workflowInstancesHead.patch({ identity, data: { uuid, patches } }));
    }

    @Post('/startWorkflow')
    @UseGuards(JwtAuthGuard)
    @ActionCode('E')
    startWorkflow(
        @Identity() identity: IdentityRequest,
        @Body() launchOptions: WorkflowLaunchOptionsDto,
    ): Observable<any> {
        return this.nats.httpResult(this.workflowInterpretorHead.startWorkflow({ identity, launchOptions }));
    }

    @Post('/runInstance')
    @UseGuards(JwtAuthGuard)
    @ActionCode('E')
    runInstance(
        @Identity() identity: IdentityRequest,
        @Body() data: { uuid: string },
    ): Observable<any> {
        return this.nats.httpResult(this.workflowInterpretorHead.runInstance({ identity, uuid: data.uuid }));
    }
}
