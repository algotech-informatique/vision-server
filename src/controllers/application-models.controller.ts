import { Controller, Post, Body, Get, Param, UseGuards, Delete, Patch, Query, UseInterceptors, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PatchPropertyDto, DeleteDto, ApplicationModelDto, CacheDto } from '@algotech-ce/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { ApplicationModelsHead, NatsService } from '../providers';
import { ActionCode, Identity } from '../common/@decorators';
import { ApplicationModel, IdentityRequest } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { SettingsDataInterceptor } from '../common/@interceptors/settings-data.interceptor';

@Controller('application-models')
@ApiTags('Application Models')
@UseInterceptors(SettingsDataInterceptor)
export class ApplicationModelsController {

    constructor(private applicationModelsHead: ApplicationModelsHead, private readonly nats: NatsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(
        @Identity() identity: IdentityRequest,
        @Body() applicationModel: ApplicationModelDto,
    ): Observable<ApplicationModelDto> {

        return this.nats.httpResult(
            this.applicationModelsHead.create({ identity, data: { customerKey: identity.customerKey, deleted: false, ...applicationModel } as ApplicationModel }));
    }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.applicationModelsHead.cache({ identity, date }), CacheDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findAll(@Identity() identity: IdentityRequest, @Query('filter') filter: string): Observable<ApplicationModelDto[]> {

        return this.nats.httpResult(
            this.applicationModelsHead.find({ identity }), ApplicationModelDto, filter);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    find(
        @Identity() identity: IdentityRequest,
        @Param('uuid') uuid: string,
        @Query('filter') filter: string,
    ): Observable<ApplicationModelDto> {

        return this.nats.httpResult(
            this.applicationModelsHead.find({ identity, uuid }), ApplicationModelDto, filter);
    }

    @Get('/key/:key')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findByKey(
        @Identity() identity: IdentityRequest,
        @Param('key') key: string,
        @Query('filter') filter: string,
    ): Observable<ApplicationModelDto> {

        return this.nats.httpResult(this.applicationModelsHead.find({ identity, key }), ApplicationModelDto, filter);
    }

    @Get('/smartnodes/:snModelUuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findByView(@Identity() identity: IdentityRequest, @Param('snModelUuid') snModelUuid): Observable<ApplicationModelDto> {

        return this.nats.httpResult(this.applicationModelsHead.find({ identity, snModelUuid }), ApplicationModelDto);
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    delete(@Identity() identity: IdentityRequest, @Body() data: DeleteDto) {

        return this.nats.httpResult(this.applicationModelsHead.delete({ identity, data: data.uuid }));
    }

    @Delete('/deletebysnmodel')
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    deleteBySnModel(@Identity() identity: IdentityRequest, @Body() snMmodel) {

        return this.nats.httpResult(this.applicationModelsHead.delete(
            { identity, data: null, snModelUuid: snMmodel.snModelUuid }));
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {

        return this.nats.httpResult(this.applicationModelsHead.patch({ identity, data: { uuid, patches } }));
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    publish(@Identity() identity: IdentityRequest, @Body() applicationModel: any) {

        return this.nats.httpResult(this.applicationModelsHead.publish(
            { identity, applicationModel: { customerKey: identity.customerKey, deleted: false, ...applicationModel } as ApplicationModel }));
    }
}
