import { PlanGeneralSettings } from './plan-general-settings.interface';
import { PlanPoiSettings } from './plan-poi-settings.interface';
import { PlanContainersSettings } from './plan-containers-settings.interface';

export interface PlanSettings {
    readonly general: PlanGeneralSettings;
    readonly poi: PlanPoiSettings[];
    readonly containers: PlanContainersSettings[];
}
