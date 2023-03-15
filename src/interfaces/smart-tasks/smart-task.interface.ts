import { BaseDocument } from '../base/base.interface';
import { SmartTaskPeriodicity } from './smart-task.periodicity.interface';

export interface SmartTask extends BaseDocument {
    enabled: boolean;
    name: string;
    periodicity: SmartTaskPeriodicity;
    priority: 'highest' | 'high' | 'normal' | 'low' | 'lowest';
    flowKey: string;
    flowType: 'smartflow' | 'workflow' | 'mail' | 'notify';
    inputs?: any[];
    dirUuid?: string;
    userUuid: string;
    nextRunAt?: string;
}
