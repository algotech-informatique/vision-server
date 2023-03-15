import { SnPageBox } from './../../smart-nodes/smart-nodes-page-box.interface';
import { Lang } from '../../lang/lang.interface';
import { PlanPoiContentSettings } from './plan-poi-content-settings.interface';

export interface PlanPoiSettings {
    readonly uuid: string;
    readonly icon: string;
    readonly color: string;
    readonly displayName: Lang[];
    readonly content: PlanPoiContentSettings;
    readonly displayValue: string;
    readonly toolTip: string;
    readonly actionType: 'workflow' | 'property';
    readonly zoomMin: number;
    readonly zoomMax: number;
    readonly type: 'poi' | 'card';
    readonly widgets: {
        id: string;
        type: string;
        box: SnPageBox;
        custom: any;
        css: any;
    }[];
    readonly canvas?: {
        originWidth: number;
        originHeight: number;
        width: number;
        height: number;
    };
}
