/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param, UseGuards, Put, Delete, Patch, UseInterceptors, Query, Res, HttpStatus } from '@nestjs/common';
import { defer, from, Observable } from 'rxjs';
import { PatchPropertyDto, WorkflowModelDto, WorkflowLaunchOptionsDto, CacheDto } from '@algotech/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import * as _ from 'lodash';
import { NatsService, OpenAPIGeneratorService, SmartFlowsHead } from '../providers';
import { Identity } from '../common/@decorators';
import { IdentityRequest, WorkflowModel } from '../interfaces';
import { WorkflowServiceService } from '../providers/workflow-interpretor';
import { ApiTags, OpenAPIObject } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { Response } from 'express';

@Controller('smartflows')
@ApiTags('Smart Flows')
export class SmartFlowsController {

    constructor(
        private smartFlowsHead: SmartFlowsHead,
        private readonly workflowService: WorkflowServiceService,
        private readonly nats: NatsService,
        private readonly openAPIGenerator: OpenAPIGeneratorService
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findAll(@Identity() identity: IdentityRequest): Observable<WorkflowModelDto[]> {
        return this.nats.httpResult(this.smartFlowsHead.find({ identity }), WorkflowModelDto);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findOne(@Identity() identity: IdentityRequest, @Param('uuid') uuid): Observable<WorkflowModelDto> {
        return this.nats.httpResult(this.smartFlowsHead.find({ identity, uuid }), WorkflowModelDto);
    }

    @Get('/key/:key')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findByKey(@Identity() identity: IdentityRequest, @Param('key') key): Observable<WorkflowModelDto> {
        return this.nats.httpResult(this.smartFlowsHead.find({ identity, key }), WorkflowModelDto);
    }

    @Get('/smartnodes/:snModelUuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    findByView(@Identity() identity: IdentityRequest, @Param('snModelUuid') snModelUuid): Observable<WorkflowModelDto> {
        return this.nats.httpResult(this.smartFlowsHead.find({ identity, snModelUuid }), WorkflowModelDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(@Identity() identity: IdentityRequest, @Body() smartflow: WorkflowModelDto): Observable<WorkflowModelDto> {
        return this.nats.httpResult(this.smartFlowsHead.create({ identity, smartflow: smartflow as WorkflowModel }), WorkflowModelDto);
    }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.smartFlowsHead.cache({ identity, date }), CacheDto);
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.smartFlowsHead.patch({ identity, data: { uuid, patches } }));
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    delete(@Identity() identity: IdentityRequest, @Body() data: { uuid: string }): Observable<boolean> {
        return this.nats.httpResult(this.smartFlowsHead.delete({ identity, uuid: data.uuid }));
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    publish(@Identity() identity: IdentityRequest, @Body() smartflow: WorkflowModelDto) {
        return this.nats.httpResult(this.smartFlowsHead.publish({ identity, smartflow: smartflow as WorkflowModel }), WorkflowModelDto);
    }

    @Get('/documentation/openapi.json')
    @UseGuards(JwtAuthGuard)
    @Roles(['sadmin', 'doc'])
    openapi(@Identity() identity: IdentityRequest): Observable<OpenAPIObject> {
        return this.nats.httpResult(this.openAPIGenerator.generateSmartflowsDocumentation(identity));
    }

    @Post('/startsmartflows')
    @UseGuards(JwtAuthGuard)
    startSmartFlow(
        @Identity() identity: IdentityRequest,
        @Body() launchOptions: WorkflowLaunchOptionsDto,
        @Res() response: Response,
    ) {
        this.nats.sendResponse(defer(() => {
            if (!launchOptions.inputs) {
                launchOptions.inputs = [];
            }
    
            _.mixin({
                mergeKey: function mergeKey(arr, elt, key) {
                    if (elt !== null && elt !== undefined) {
                        _.remove(arr, key);
                        arr.push({ key, value: elt });
                    }
                    return arr;
                },
            });
    
            if (launchOptions.searchParameters) {
                _.mergeKey(launchOptions.inputs, launchOptions.searchParameters, 'search-parameters');
                _.mergeKey(launchOptions.inputs, launchOptions.searchParameters.skip, 'page');
                _.mergeKey(launchOptions.inputs, launchOptions.searchParameters.limit, 'limit');
                _.mergeKey(launchOptions.inputs, launchOptions.searchParameters.search, 'filter');
            }

            return this.smartFlowsHead.startSmartFlow({ identity, launchOptions, httpResponse: true })
        }), response);
    }

    @Post('/callAPI')
    @UseGuards(JwtAuthGuard)
    call(@Identity() identity: IdentityRequest, @Body() data: any) {
        return this.workflowService.call(data.url, data.headers, data.body, data.type, data.responseType, false);
    }

}
