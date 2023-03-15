import { PlanGeneralDisplayPropertySettings } from './plan-general-display-property.interface';

export interface PlanGeneralDisplaySettings {
    readonly uuid: string;
    readonly propertyList: PlanGeneralDisplayPropertySettings[];
}
