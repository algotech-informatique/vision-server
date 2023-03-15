import { SnBox } from './smart-nodes-box.interface';
import { SnGroup } from './smart-nodes-group.interface';
import { SnNode } from './smart-nodes-node.interface';
import { SnComment } from './smart-nodes-comment.interface';
import { DrawingData } from '../drawing/drawing-data.interface';

export interface SnView {

    readonly id: string;
    readonly groups: SnGroup[];
    readonly box: SnBox[];
    readonly nodes: SnNode[];
    readonly comments: SnComment[];
    readonly drawing: DrawingData;
    readonly options?: any;

}
