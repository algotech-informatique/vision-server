import { Controller, Post, Body, Get, Param, Put, UseGuards, Patch, Query, BadRequestException, Delete, UseInterceptors, UploadedFile, UnauthorizedException } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import {
    SmartObjectDto, SmartObjectGeoBoxDto, SmartObjectSearchDto, PatchPropertyDto, DeleteDto, GeoSettingsDto,
    GeoPOIDto, SmartObjectTreeQuery, QuerySearchDto, CacheDto, SearchSODto, IndexationOptionsDto, CustomerInitDto, ImportSoDto, ImportSoResultDto,
} from '@algotech/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { AuthorizationInterceptor } from '../auth/interceptors/authorization.interceptor';
import { tap, mergeMap, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { ActionCode, Identity } from '../common/@decorators';
import { AuditLog, IdentityRequest, SmartObject } from '../interfaces';
import { AdminHead, AuditTrailHead, DocumentsHead, NatsService, SearchHead, SearchQueryBuilderHead, SmartModelsHead, SmartObjectsHead, UtilsService } from '../providers';
import { BroadcastingMode } from '../common/@websockets/web-sockets.service';
import { ApiTags } from '@nestjs/swagger';
import { PreRequestAuthorizationInterceptor } from '../auth/interceptors/pre-request-authorization.interceptor';
import { Roles } from '../common/@decorators/roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UUID } from 'angular2-uuid';

@Controller('smart-objects')
@ApiTags('Smart Objects')
@UseInterceptors(PreRequestAuthorizationInterceptor)
export class SmartObjectsController {
    constructor(
        private searchHead: SearchHead,
        private searchQueryBuilderHead: SearchQueryBuilderHead,
        private smartModelsHead: SmartModelsHead,
        private smartObjectsHead: SmartObjectsHead,
        private utils: UtilsService,
        private readonly nats: NatsService,
        private readonly documentsHead: DocumentsHead,
        private readonly adminHead: AdminHead,
        private readonly auditTrailHead: AuditTrailHead) { }

    @Post()
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    create(@Identity() identity: IdentityRequest, @Body() smartObject: SmartObjectDto): Observable<SmartObjectDto> {
        return this.nats.httpResult(this.smartObjectsHead.create({ identity, smartObject: smartObject as SmartObject }), SmartObjectDto);
    }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.smartObjectsHead.cache({ identity, date }), CacheDto);
    }

    @Post('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cacheWithId(
        @Identity() identity: IdentityRequest,
        @Body() data: { uuid?: string[] },
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.smartObjectsHead.cache({ identity, date, uuid: data?.uuid }), CacheDto);
    }

    @Get()
    @UseInterceptors(AuthorizationInterceptor)
    @UseInterceptors(DataCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    findAll(@Identity() identity: IdentityRequest): Observable<SmartObjectDto[]> {
        return this.nats.httpResult(this.smartObjectsHead.find({ identity }), SmartObjectDto);
    }

    @Get('/model/:modelKey')
    @UseInterceptors(AuthorizationInterceptor)
    @UseInterceptors(DataCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findByModel(
        @Identity() identity: IdentityRequest,
        @Param('modelKey') modelKey,
        @Query('skip') skip,
        @Query('limit') limit,
        @Query('sort') sort: string,
        @Query('order') order: string): Observable<SmartObjectDto[] | {}> {
        if ((skip && isNaN(skip)) || (limit && isNaN(limit))) {
            throw new BadRequestException('skip or limit is not a number!');
        }
        return this.nats.httpResult(this.smartObjectsHead.find({ identity, modelKey, skip, limit, order, sort }), SmartObjectDto);
    }

    @Get('/search/:modelKey')
    @UseInterceptors(AuthorizationInterceptor)
    @UseInterceptors(DataCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    searchByModel(
        @Identity() identity: IdentityRequest,
        @Param('modelKey') modelKey,
        @Query('property') property,
        @Query('value') value,
        @Query('skip') skip: number,
        @Query('limit') limit: number,
        @Query('order') order: string,
        @Query('defaultOrder') defaultOrder: string): Observable<SmartObjectDto[]> {
        return this.nats.httpResult(this.smartObjectsHead.searchByModel({
            identity, modelKey, property, value, skip, limit, order, defaultOrder
        }), SmartObjectDto);
    }

    @Get(':uuid')
    @UseInterceptors(AuthorizationInterceptor)
    @UseInterceptors(DataCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    find(@Identity() identity: IdentityRequest, @Param('uuid') uuid): Observable<SmartObjectDto | {}> {
        return this.nats.httpResult(this.smartObjectsHead.find({ identity, uuid }), SmartObjectDto);
    }

    @Get('/subdoc/:subDocUuid')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findWithSubdoc(
        @Identity() identity: IdentityRequest,
        @Param('subDocUuid') uuid,
        @Query('deep') deep: string,
        @Query('excludeRoot') excludeRoot: string):
        Observable<SmartObjectDto[]> {
        return this.nats.httpResult(this.smartObjectsHead.find(
            { identity, uuid, subdoc: true, deep: this.utils.strToBool(deep), excludeRoot: this.utils.strToBool(excludeRoot) },
        ));
    }

    @Post('/subdoc')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findManyWithSubdoc(
        @Identity() identity: IdentityRequest,
        @Body() uuids: string[],
        @Query('deep') deep: string,
        @Query('excludeRoot') excludeRoot: string):
        Observable<SmartObjectDto[]> {
        return this.nats.httpResult(this.smartObjectsHead.find(
            { identity, uuids, subdoc: true, deep: this.utils.strToBool(deep), excludeRoot: this.utils.strToBool(excludeRoot) },
        ));
    }

    @Get('/doc/:docUuid')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findByDoc(
        @Identity() identity: IdentityRequest,
        @Param('docUuid') docUuid):
        Observable<SmartObjectDto[]> {
        return this.nats.httpResult(this.smartObjectsHead.find(
            { identity, docUuid },
        ), SmartObjectDto);
    }

    @Post('/tree-search')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    treeSearch(@Identity() identity: IdentityRequest, @Body() query: SmartObjectTreeQuery): Observable<SmartObjectDto[]> {
        return this.nats.httpResult(this.smartObjectsHead.treeSearch({ identity, query }), SmartObjectDto);
    }

    @Post('/geo')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    geo(@Identity() identity: IdentityRequest, @Body() body: { geobox: SmartObjectGeoBoxDto, propKeys?: string[] }): Observable<GeoPOIDto[]> {
        return this.nats.httpResult(this.smartObjectsHead.geo({
            identity, geobox: body.geobox,
            propKeys: body.propKeys
        }), GeoPOIDto);
    }

    @Post('/geo-settings/:layerKey')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    geoSettings(
        @Identity() identity: IdentityRequest,
        @Param('layerKey') layerKey: string,
        @Body() poiSetting: GeoSettingsDto,
    ): Observable<SmartObjectDto> {
        return this.nats.httpResult(this.smartObjectsHead.geoSettings(
            { identity, layerKey, poiSetting }), SmartObjectDto);
    }

    @Post('/magnets')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    magnets(@Identity() identity: IdentityRequest, @Body() body:
        { appKey: string, boardInstance: string, zoneKey: string }): Observable<SmartObjectDto[]> {
        if (!body.zoneKey) {
            body.zoneKey = null;
        }
        if (!body.boardInstance) {
            body.boardInstance = null;
        }
        return this.nats.httpResult(this.smartObjectsHead.magnets({
            identity, appKey: body.appKey,
            boardInstance: body.boardInstance, zoneKey: body.zoneKey
        }), SmartObjectDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    update(@Identity() identity: IdentityRequest, @Body() changes: SmartObjectDto): Observable<SmartObjectDto[]> {
        return this.nats.httpResult(this.smartObjectsHead.update({ identity, changes: changes as SmartObject }), SmartObjectDto);
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    deleteSM(@Identity() identity: IdentityRequest, @Body() data: DeleteDto) {
        if (data.real) {
            if (identity.groups.indexOf('sadmin') === -1) {
                throw new UnauthorizedException('delete not Authorised')
            }
        }
        this.forceAuditRealDeleteAttemps(identity, {
            real: data.real,
            uuid: data.uuid
        });
        return this.nats.httpResult(this.smartObjectsHead.delete({ identity, uuid: data.uuid })).pipe(
            tap(() => {
                this.notifyObject(identity, identity.sessionId, 'rm', data.uuid);
            }),
        );
    }

    @Delete('sos')
    @UseGuards(JwtAuthGuard)
    @Roles(['sadmin'])
    @ActionCode('D')
    deleteSos(
        @Identity() identity: IdentityRequest,
        @Query('modelKey') modelKey: string,
        @Query('deleted') deleted: string,
        @Body() data: DeleteDto) {
        this.forceAuditRealDeleteAttemps(identity, {
            real: data.real,
            uuids: data.uuids,
            modelKey,
            deleted: (deleted === 'true'),
            empty: data.empty
        });
        return this.nats.httpResult(this.smartObjectsHead.deleteSmartObjects({
            identity,
            uuids: data.uuids,
            modelKey,
            real: data.real,
            empty: data.empty,
            deleted: (deleted === 'true'),
        })).pipe(
            tap(() => {
                if (data.uuids && data.uuids.length > 0) {
                    data.uuids.forEach((uuid: string) =>
                        this.notifyObject(identity, identity.sessionId, 'rm', uuid));
                }
            }),
        );
    }

    @Post('so/restore')
    @UseGuards(JwtAuthGuard)
    @Roles(['sadmin'])
    @ActionCode('U')
    retoreObjects(@Identity() identity: IdentityRequest, @Query('modelKey') modelKey, @Body() uuids: string[]) {
        return this.nats.httpResult(this.smartObjectsHead.restore(identity, modelKey, uuids));
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.smartObjectsHead.patch(
            { identity, data: { uuid, patches } }).pipe(
                tap(() => {
                    this.smartObjectsHead.find({ identity, uuid }).subscribe(
                        (res) => {
                            const payload = JSON.parse(JSON.stringify(res));
                            delete payload.customerKey;
                            this.notifyObject(identity, identity.sessionId, 'chg', payload);
                        });
                }),
            ),
        );
    }

    @Get('/values/:modelKey')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findvalues(
        @Identity() identity: IdentityRequest,
        @Param('modelKey') modelKey: string,
        @Query('property') property: string,
        @Query('skip') skip: number,
        @Query('limit') limit: number,
        @Query('order') order: string,
        @Query('startwith') startwith: string): Observable<string[]> {
        let numlimit;
        let numskip;
        const sortOrder = ((!order) || order === 'desc' || order === '-1') ? -1 : 1;

        if ((skip && isNaN(skip)) || (limit && isNaN(limit))) {
            throw new BadRequestException('skip or limit is not a number!');
        } else {
            numlimit = limit ? + limit : 100;
            numskip = skip ? + skip : 0;
        }

        return this.nats.httpResult(this.searchHead.getUniqueValues(this.searchQueryBuilderHead.getUniqueValuesAggregation(identity.customerKey,
            numskip, numlimit, sortOrder, modelKey, property, startwith)));
    }

    @Get('/skill/:skill/model/:modelKey')
    @UseGuards(JwtAuthGuard)
    findByGeolocation(
        @Identity() identity: IdentityRequest,
        @Param('skill') skill,
        @Param('modelKey') modelKey,
        @Query('layers') layersKey,
        @Query('property') property,
        @Query('value') value: string,
        @Query('set') set: number,
        @Query('skip') skip,
        @Query('limit') limit,
        @Query('sort') sort: string,
        @Query('order') order: string): Observable<SmartObjectDto[] | {}> {
        if ((skip && isNaN(skip)) || (limit && isNaN(limit))) {
            throw new BadRequestException('skip or limit is not a number!');
        }
        return this.nats.httpResult(this.smartObjectsHead.find(
            { identity, skill, layersKey, set, skip, limit, order, sort, modelKey, property, value }),
            SmartObjectDto);
    }

    @Get('/filterskill/:skill/model/:modelKey')
    @UseGuards(JwtAuthGuard)
    filterByGeolocation(
        @Identity() identity: IdentityRequest,
        @Param('skill') skill,
        @Param('modelKey') modelKey,
        @Query('layers') layersKey,
        @Query('property') property,
        @Query('value') value: string,
        @Query('set') set: number,
        @Query('skip') skip,
        @Query('limit') limit,
        @Query('sort') sort: string,
        @Query('filter') filter: string,
        @Query('fields') fields: string,
        @Query('order') order: string,
    ): Observable<SmartObjectDto[] | {}> {
        if ((skip && isNaN(skip)) || (limit && isNaN(limit))) {
            throw new BadRequestException('skip or limit is not a number!');
        }
        return this.nats.httpResult(this.smartObjectsHead.find(
            { identity, skill, layersKey, set, skip, limit, order, sort, modelKey, property, value, filter, fields }),
            SmartObjectDto);
    }

    @Post('/import')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    import(
        @Identity() identity: IdentityRequest,
        @UploadedFile() file,
        @Body() content: ImportSoDto): Observable<{ success: boolean }> {
        if (!file) {
            throw new BadRequestException('no file in body');
        }
        // todo check running import
        return this.nats.httpResult(this.smartObjectsHead.import({ identity, file: file.buffer, content }));
    }

    @Post('/uuids')
    @UseInterceptors(AuthorizationInterceptor)
    @UseGuards(JwtAuthGuard)
    findByUuids(
        @Identity() identity: IdentityRequest,
        @Query('skip') skip: number,
        @Query('limit') limit: number,
        @Body() body: { uuids: string[], type: 'exclude' | 'include' }): Observable<SmartObjectDto[]> {
        return this.nats.httpResult(this.smartObjectsHead.find(
            { identity, uuids: body.uuids, type: body.type, skip, limit }), SmartObjectDto);
    }

    @Post('/unique')
    @UseGuards(JwtAuthGuard)
    unique(@Identity() identity: IdentityRequest, @Body() smartObject: SmartObjectDto): Observable<boolean> {
        return this.nats.httpResult(this.smartObjectsHead.isUnique({ identity, smartObject: smartObject as SmartObject }));
    }

    @Get('/layer-remove/:layerKey')
    @UseGuards(JwtAuthGuard)
    removeFromLayer(@Identity() identity: IdentityRequest, @Param('layerKey') layerKey) {
        return this.nats.httpResult(this.smartObjectsHead.removeFromLayer({ identity, layerKey }));
    }

    @Post('/count')
    @UseGuards(JwtAuthGuard)
    @Roles(['sadmin'])
    countSos(
        @Identity() identity: IdentityRequest,
        @Query('search') search = '',
        @Body() query: SearchSODto): Observable<number> {
        return this.nats.httpResult(this.searchHead.searchSo(identity, 0, 1, search, query, true) as Observable<number>);
    }

    @Post('doc/indexation')
    @UseGuards(JwtAuthGuard)
    @Roles(['sadmin'])
    indexation(
        @Identity() identity: IdentityRequest,
        @Query('soUuid') soUuid?: string,
        @Query('fileId') fileId?: string,
        @Query('docUuid') docUuid?: string,
        @Query('start') start?: string,
        @Query('end') end?: string,
        @Query('max') max?: string): Observable<any> {

        let data = { identity };
        data = soUuid ? Object.assign(data, { soUuid }) : data;
        data = fileId ? Object.assign(data, { fileId }) : data;
        data = docUuid ? Object.assign(data, { docUuid }) : data;
        data = start ? Object.assign(data, { start }) : data;
        data = end ? Object.assign(data, { end }) : data;
        data = max ? Object.assign(data, { max: parseInt(max, 10) }) : data;

        const customer: CustomerInitDto = {
            customerKey: identity.customerKey, name: '', email: '', languages: [], licenceKey: '', login: '', password: '',
        };
        if (soUuid || fileId || docUuid) {
            return this.documentsHead.indexation(data).pipe(
                tap(() => console.log('----End of Indexation----')),
            );
        }

        return this.nats.httpResult(
            this.adminHead.resetdocIndex(customer).pipe(
                mergeMap((res) => this.documentsHead.indexation(data).pipe(
                    tap(() => console.log('----End of Indexation----')),
                )),
            ),
        );
    }

    private notifyObject(identity: IdentityRequest, sessionId: string, pattern: string, payload: any) {
        process.emit('message', {
            cmd: 'socket.broadcast',
            data: {
                cmd: `event.smart-object.${pattern}`,
                payload,
                client: { customerKey: identity.customerKey, sessionId },
                mode: [BroadcastingMode.IncludeMe, BroadcastingMode.MultiRoom],
            }
        }, null);
    }

    private forceAuditRealDeleteAttemps(identity: IdentityRequest,
        data: {
            real: boolean;
            uuid?: string;
            empty?: boolean;
            uuids?: string[];
            modelKey?: string;
            deleted?: boolean;
            notIndexed?: boolean;
        }) {
        if (data.real) {
            const log: AuditLog = {
                eventId: UUID.UUID(),
                eventActionCode: 'D',
                eventDate: new Date().toISOString(),
                httpStatusCode: 200,
                userId: identity.login,
                customerKey: identity.customerKey,
                networkAccessPoint: '',
                objectUuid: data.empty ? 'empty' : data.uuid ? data.uuid : '',
                objectTypeCode: 'smart-object',
                objectUuids: data.uuids && data.uuids.length > 0 ? data.uuids : [],
                objectModelKey: data.modelKey ? data.modelKey : '',
                isRealDelete: true,
                deletedObjects: data.deleted,
                notIndexedObjects: data.notIndexed,

            };

            this.auditTrailHead.createLog(log).subscribe();
        }
    }
}
