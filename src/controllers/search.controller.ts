import { Controller, Post, Query, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { QuerySearchDto, SearchSODto, SmartObjectDto } from '@algotech/core';
import * as _ from 'lodash';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { SearchHead, NatsService } from '../providers';
import { Identity } from '../common/@decorators';
import { IdentityRequest } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';

@Controller('search')
@ApiTags('Search')
export class SearchController {
    constructor(
        private readonly searchHead: SearchHead,
        private readonly nats: NatsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    querySearch(
        @Identity() identity: IdentityRequest,
        @Query('skip') skip,
        @Query('limit') limit,
        @Query('target') target = '',
        @Body() query: QuerySearchDto): Observable<{}> {

        let numskip;
        let numlimit;
        if ((skip && isNaN(skip)) || (limit && isNaN(limit))) {
            throw new BadRequestException('skip or limit is not a number!');
        } else {
            numskip = skip ? + skip : 0;
            numlimit = limit ? + limit : 10;
        }

        return this.nats.httpResult(this.searchHead.search(identity, numskip, numlimit, target, query));
    }

    @Post('/smart-objects')
    @UseGuards(JwtAuthGuard)
    searchSO(@Identity() identity: IdentityRequest,
        @Query('skip') skip,
        @Query('limit') limit,
        @Query('search') search = '',
        @Body() query: SearchSODto): Observable<SmartObjectDto[]> {
        return this.nats.httpResult(this.searchHead.searchSo(identity, skip, limit, search, query, false), SmartObjectDto);
    }
}
