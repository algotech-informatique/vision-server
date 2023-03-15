import { SnFlow } from './smart-nodes-flow.interface';
import { SnParam } from './smart-nodes-param.interface';
import { SnSection } from './smart-nodes-section.interface';
import { SnElement } from './smart-nodes-element.interface';

export interface SnNode extends SnElement {

    readonly key?: string;
    readonly parentId?: string;
    readonly icon: string;
    readonly type: string;
    readonly flowsEditable?: boolean;
    readonly flows: SnFlow[];
    readonly params: SnParam[];
    readonly sections: SnSection[];
    readonly expanded?: boolean;

}
