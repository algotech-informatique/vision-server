import { PlanGeneralDisplaySmartModelSettings } from './plan-general-display-smart-model.interface';

export interface PlanGeneralDisplayPropertySettings {
    readonly name: string;
    readonly smartModel: PlanGeneralDisplaySmartModelSettings[];
}
