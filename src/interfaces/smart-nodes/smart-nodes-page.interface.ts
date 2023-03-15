import { SnPageEvent } from './smart-nodes-page-event.interface';
import { SnPageWidget } from './smart-nodes-page-widget.interface';
import { SnPageVariable } from './smart-nodes-page-variable.interface';
import { Lang } from '../lang/lang.interface';
import { SnCanvas } from './smart-nodes-canvas.interface';
import { SnPageEventPipe } from './smart-nodes-page-event-pipe.interface';

export interface SnPage {
    readonly id: string;
    readonly css: any;
    readonly icon?: string;
    readonly displayName: Lang[];
    readonly canvas: SnCanvas;
    readonly securityGroups?: string[];
    readonly widgets: SnPageWidget[];
    readonly header?: SnPageWidget;
    readonly footer?: SnPageWidget;
    readonly variables: SnPageVariable[];
    readonly dataSources: SnPageEventPipe[];
    readonly events: SnPageEvent[];
    readonly main?: boolean;
    readonly custom?: any;
    readonly pageHeight: number;
    readonly pageWidth: number;
}
