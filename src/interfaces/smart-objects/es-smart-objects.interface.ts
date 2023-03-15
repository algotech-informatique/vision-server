import { ESSOproperty } from './es-soproperty.interface';

export interface EsSmartObject {
    uuid: string;
    modelKey: string;
    properties: ESSOproperty[];
    documents?: string[];
    tags?: string[];
    deleted: boolean;
}
