import { Observable, of, throwError } from 'rxjs';
import { SchedulesService } from './schedules.service';
import { PatchPropertyDto, SmartObjectDto } from '@algotech/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IdentityRequest, Schedule, ScheduleSearch, SmartObject } from '../../interfaces';
import { mergeMap } from 'rxjs/operators';
import { SmartObjectsHead } from '../smart-objects/smart-objects.head';

@Injectable()
export class SchedulesHead {

    constructor(
        private readonly scheduleService: SchedulesService,
        private smartObjectHead: SmartObjectsHead,
    ) { }

    create(data: { identity: IdentityRequest, schedule: Schedule }): Observable<Schedule> {
        return this.scheduleService.create(data.identity.customerKey, data.schedule, true);
    }

    find(data: { identity; scheduleSearch?: ScheduleSearch; skip: number;
        limit: number; sort?: string; order?: string; }): Observable<Schedule[]> {

        return this.scheduleService.findByScheduleSearch(data.identity.customerKey,
            data.scheduleSearch, data.skip, data.limit, data.order, data.sort);
    }

    getSObyRangeData( data: { identity: IdentityRequest; dateStart: string; dateEnd: string; skip: number; limit: number;
            }): Observable<SmartObject | SmartObject[] | SmartObjectDto[]> {

        const numskip = data.skip ? +data.skip : 0; // +num est "équivalent" au parseInt(num)
        const numlimit = data.limit ? +data.limit : 1000;

        return this.scheduleService.getUUIDByRangeDate(data, data.dateStart, data.dateEnd).pipe(
            mergeMap((listSO: string[]) => {
                return this.smartObjectHead.find(
                    { identity: data.identity, uuids: listSO, type: 'include', skip: numskip, limit: numlimit });
        }));

    }

    update(data: { identity: IdentityRequest; updateSchedule: Schedule }): Observable<Schedule> {
        return this.scheduleService.update(data.identity.customerKey, data.updateSchedule);
    }

    patch(data: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {
        return this.scheduleService.patchProperty(data.identity.customerKey, data.data.uuid, data.data.patches);
    }

    delete(data: { identity: IdentityRequest; uuid: string }): Observable<boolean> {

        return this.scheduleService.delete(data.identity.customerKey, data.uuid).pipe(
            mergeMap((result: boolean) => {
                if (result === true) {
                    return of(result);
                } else {
                    return throwError(() => new BadRequestException('Delete schedule failed'));
                }
            }),
        );
    }
}
