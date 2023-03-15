import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from } from 'rxjs';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { BaseService } from '../@base/base.service';
import { Schedule, ScheduleSearch } from '../../interfaces';
import { SearchScheduleService } from './search-schedule.service';

@Injectable()
export class SchedulesService extends BaseService<Schedule> {

    constructor(
        @InjectModel('Schedule') private readonly ScheduleModel: Model<Schedule>,
        private readonly searchSchedule: SearchScheduleService) {

        super(ScheduleModel);
    }

    createSchedule(customerKey: string, object: Schedule): Observable<Schedule> {
        return this.create(customerKey, object);
    }

    findByScheduleSearch(customerKey: string, filter: ScheduleSearch, skip: number, limit: number, order?: string | number, sort?: string)
        : Observable<Schedule[]> {
        let obsList: Observable<Schedule[]>;
        let sortproperty: string;
        const aggregates = _.assign(this.searchSchedule.getStagesFromScheduleSearch(customerKey, filter));
        if (_.size(aggregates) > 0) {
            if (sort) {
                if (order === 'desc' || order === '-1') {
                    order = '-1';
                } else {
                    order = '1';
                }
                sortproperty = '{ "$sort": { "' + sort + '": ' + order + '} }';
                aggregates.push(
                    JSON.parse(sortproperty));
            }

            if (skip && limit) {
                aggregates.push(
                    { $skip: skip * limit },
                    { $limit: limit });
            }

        }

        obsList = from(this.ScheduleModel.aggregate(aggregates));
        return obsList.pipe(
            map((obs: Schedule[]) => {
                return obs;
            }),
        );
    }

    getUUIDByRangeDate(data, dateStart: string, dateEnd: string): Observable<string[]> {
        const scheduleSearch: ScheduleSearch = {
            uuid: null,
            beginPlannedDate: [{start: dateStart, end: dateEnd}],
        };
        return this.findByScheduleSearch(data.identity.customerKey, scheduleSearch, 0, 1000000).pipe(
            map((schedules: Schedule[]) => {
                const listSO: string[] = _.reduce(schedules, (result, schedule: Schedule) => {
                    result.push(...schedule.soUuid);
                    return result;
                }, []);
                return listSO;
        }));
    }
}
