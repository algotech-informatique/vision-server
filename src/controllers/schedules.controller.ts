import { Controller, UseGuards, Post, Query, BadRequestException, Body, Patch, Delete, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Observable } from 'rxjs';
import { DeleteDto, ScheduleDto, PatchPropertyDto, ScheduleSearchDto, SmartObjectDto } from '@algotech-ce/core';
import { IdentityRequest, ScheduleSearch } from '../interfaces';
import { NatsService, SchedulesHead } from '../providers';
import { ActionCode, Identity } from '../common/@decorators';
import moment from 'moment';
import { ApiTags } from '@nestjs/swagger';

@Controller('scheduler')
@ApiTags('Scheduler')
export class SchedulesController {

    constructor(
        private scheduleHead: SchedulesHead,
        private readonly nats: NatsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    create(@Identity() identity: IdentityRequest, @Body() schedule: ScheduleDto): Observable<ScheduleDto> {
        return this.nats.httpResult(this.scheduleHead.create({ identity, schedule: schedule as any }), ScheduleDto);
    }

    @Post('/get-so-by-range-date')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    getSObyRangeData(
        @Identity() identity: IdentityRequest,
        @Body() body: {dateStart: string, dateEnd: string},
        @Query('skip') skip,
        @Query('limit') limit,
    ): Observable<SmartObjectDto[]> {

        const startDate = (body.dateStart) ? body.dateStart : moment().startOf('day').format();
        const endDate = (body.dateEnd) ? body.dateEnd : moment().add('day', 1).startOf('day').format();

        return this.nats.httpResult(this.scheduleHead.getSObyRangeData(
            { identity, dateStart: startDate, dateEnd: endDate, skip, limit }), SmartObjectDto);
    }

    @Post('search')
    @UseGuards(JwtAuthGuard)
    find(
        @Identity() identity: IdentityRequest,
        @Body() scheduleSearch: ScheduleSearchDto,
        @Query('skip') skip,
        @Query('limit') limit,
        @Query('sort') sort: string,
        @Query('order') order: string): Observable<ScheduleDto[] | {}> {

        let numskip;
        let numlimit;

        if ((skip && isNaN(skip)) || (limit && isNaN(limit))) {
            throw new BadRequestException('skip or limit is not a number!');
        } else {
            numskip = skip ? + skip : 0;
            numlimit = limit ? + limit : 10000;
        }
        return this.nats.httpResult(this.scheduleHead.find(
            { identity, scheduleSearch: scheduleSearch as ScheduleSearch, skip: numskip, limit: numlimit, order, sort }), ScheduleDto);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    update(@Identity() identity: IdentityRequest, @Body() updateSchedule: ScheduleDto) {
        return this.nats.httpResult(this.scheduleHead.update({ identity, updateSchedule: updateSchedule as any }), ScheduleDto);
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.scheduleHead.patch(
            { identity, data: { uuid, patches } }));
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    delete(@Identity() identity: IdentityRequest, @Body() data: DeleteDto) {
        return this.nats.httpResult(this.scheduleHead.delete({ identity, uuid: data.uuid }));
    }
}
