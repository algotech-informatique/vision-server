import { PlanLayersIframeEventSettings } from './plan-layers-iframe-event-settings.interface';

export interface PlanLayersIframeSettings {
    readonly url: string;
    readonly properties: { key: string; value: string; }[];
    readonly event: PlanLayersIframeEventSettings;
}
