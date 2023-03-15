import { DateRange } from '../base/base.dateRange';
import { SmartTaskRepetition } from './smart-task-repetition.interface';

export class SmartTaskPeriodicity {
    repeatEvery?: SmartTaskRepetition[];
    hoursOfTheDay?: number[];
    daysOftheWeek?: number[];
    daysOftheMonth?: number[];
    monthsOftheYear?: number[];
    skipImmediate: boolean;
    dateRange: DateRange;
    timeZone: string;
}
