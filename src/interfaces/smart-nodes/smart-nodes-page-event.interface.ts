import { SnPageEventPipe } from './smart-nodes-page-event-pipe.interface';
export interface SnPageEvent {
    readonly id: string;
    readonly eventKey: string;
    readonly pipe: SnPageEventPipe[];
    readonly custom?: any;
}
