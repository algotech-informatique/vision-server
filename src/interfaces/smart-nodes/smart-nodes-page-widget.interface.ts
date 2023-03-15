import { SnPageBox } from './smart-nodes-page-box.interface';
import { SnPageEvent } from './smart-nodes-page-event.interface';
import { SnPageWidgetTypeReturn } from './smart-nodes-page-widget-type-return.interface';

export interface SnPageWidget {
    readonly id: string;
    readonly typeKey: string;
    readonly name: string;
    readonly box: SnPageBox;
    readonly group?: {
        widgets: SnPageWidget[],
    };
    readonly rules: {
        readonly id: string;
        readonly conditions: {
            readonly input: string;
            readonly criteria: string;
            readonly value: any;
        }[];
        readonly operator: 'and' | 'or';
        readonly name: string;
        readonly color: string;
        readonly css: any; // difference
        readonly custom: any; // difference
        readonly events: SnPageEvent[]; // difference
    }[];
    readonly returnData?: SnPageWidgetTypeReturn[];
    readonly isActive: boolean;
    readonly css: any;
    readonly custom: any;
    readonly events: SnPageEvent[];
    readonly afterTemplatePlaced?: any;
}
