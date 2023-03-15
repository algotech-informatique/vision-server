
export interface EsdocQueryModel {
    index: string;
    id: string;
    params: {
        setSource: {
            source: ['title', 'tags'],
        },
        from: number;
        size: number;
        setFilter?: {
            tags?: any,
            modelKeys?: any,
        };
        titles: any;
        texts: any;
        nested: any;
        metadatas: any;
    };
}
