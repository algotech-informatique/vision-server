import { Lang } from '../lang/lang.interface';
import { SnCanvas } from './smart-nodes-canvas.interface';

export interface SnComment {

    readonly id: string;
    readonly parentId?: string;
    readonly open: boolean;
    readonly comment: Lang[] | string;
    readonly canvas: SnCanvas;

}
