import { SnConnector } from './smart-nodes-connector.interface';

export interface SnParam extends SnConnector {

    readonly id: string;
    readonly types: string | string[];
    readonly display?: string;
    readonly multiple: boolean;
    readonly pluggable: boolean;
    readonly master?: boolean;
    readonly required?: boolean;
    readonly hidden?: boolean;
    readonly default?: any;
    readonly value?: any;

}
