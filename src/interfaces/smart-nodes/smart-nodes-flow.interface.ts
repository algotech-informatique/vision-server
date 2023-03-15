import { SnConnector } from './smart-nodes-connector.interface';
import { SnParam } from './smart-nodes-param.interface';

export interface SnFlow extends SnConnector {

    readonly paramsEditable?: boolean;
    readonly params: SnParam[];

}
