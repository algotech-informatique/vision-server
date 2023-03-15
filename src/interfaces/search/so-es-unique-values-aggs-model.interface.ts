
export interface EsSmartObjectsUniqueValuesAggsModel {
    index: string;
    id: string;
    params: {
        modelKey: string;
        property: string;
        valueRegExp?: string;
        size: number;
        order: string;
    };
}
