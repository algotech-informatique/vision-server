import { Lang } from '../lang/lang.interface';
import { SnCanvas } from './smart-nodes-canvas.interface';

export interface SnElement {

    readonly id: string;
    readonly displayName: Lang[] | string;
    readonly open: boolean;
    readonly canvas: SnCanvas;
    readonly custom?: any;

}
