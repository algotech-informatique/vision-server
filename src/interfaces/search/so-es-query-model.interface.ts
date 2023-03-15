
export interface EsSmartObjectsQueryModel {
    index: string;
    id: string;
    params: {
        setSource: {
            source: ['uuid', 'modelKey', 'properties', 'documents'],
        },
        from: number;
        size: number;
        sort: string[];
        modelKeys?: string[];
        min_score?: number,
        condition?: '\"should\"' | '\"must\"';
        nested?: any;
    };
}
