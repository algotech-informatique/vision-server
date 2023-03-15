import { Controller, Param, Get, UseGuards, Query, UseInterceptors, Body, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Observable } from 'rxjs';
import { CacheDto, DocumentDto } from '@algotech/core';
import { DataCacheInterceptor } from '../auth/interceptors/data-cache.interceptor';
import { ActionCode, Identity } from '../common/@decorators';
import { DocumentsHead, NatsService } from '../providers';
import { IdentityRequest } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';
import { tap } from 'rxjs/operators';

@Controller('documents')
@ApiTags('Documents')
export class DocumentsController {
    constructor(
        private readonly nats: NatsService,
        private readonly documentsHead: DocumentsHead,
    ) { }

    @Get('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cache(
        @Identity() identity: IdentityRequest,
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.documentsHead.cache({ identity, date }), CacheDto);
    }

    @Post('cache/:date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    cacheWithId(
        @Identity() identity: IdentityRequest,
        @Body() data: { uuid?: string[] },
        @Param('date') date: string,
    ): Observable<CacheDto> {
        return this.nats.httpResult(this.documentsHead.cache({ identity, date, uuid: data?.uuid }), CacheDto);
    }

    @Get('/recent')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findRecentDocs(@Identity() identity: IdentityRequest): Observable<Document[]> {
        return this.nats.httpResult(this.documentsHead.getRecentDocuments({ identity }), DocumentDto);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findOne(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string): Observable<Document> {
        return this.nats.httpResult(this.documentsHead.getDocuments({ identity, uuid }), DocumentDto);
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findOneByName(@Identity() identity: IdentityRequest, @Body() body): Observable<Document> {
        return this.nats.httpResult(this.documentsHead.getDocumentByName({ identity, name: body.name }), DocumentDto);
    }

    @Get('/name/:name')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findByName(
        @Identity() identity: IdentityRequest,
        @Param('name') name: string,
    ): Observable<Document> {
        return this.nats.httpResult(this.documentsHead.getDocumentByName({ identity, name }), DocumentDto);
    }

    @Post('uuids')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(DataCacheInterceptor)
    @ActionCode('R')
    findMany(
        @Identity() identity: IdentityRequest,
        @Body() uuids: string[],
    ): Observable<Document[]> {
        return this.nats.httpResult(this.documentsHead.getDocuments({ identity, uuid: uuids }));
    }

    @Get('/so/:soUuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findDocsBySoUuid(@Identity() identity: IdentityRequest, @Param('soUuid') uuid: string,
        @Query('skip') skip: number,
        @Query('limit') limit: number): Observable<Document> {
        const numskip = skip ? +skip : 0;
        const numlimit = limit ? + limit : 100;
        return this.nats.httpResult(this.documentsHead.getDocumentsFromSo({ identity, uuid, skip: numskip, limit: numlimit }), DocumentDto);
    }
}
