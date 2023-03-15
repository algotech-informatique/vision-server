import { SmartObject } from '../smart-objects/smart-object.interface';
import { TagSearchResult } from './tag-search-result.interface';
import { SearchResult } from './search-result.interface';
import { DocRecommendation } from './doc-recommendation.interface';

export interface QuerySearchResult {
    header: {
        type: 'so' | 'tag' | 'file' | 'layer';
        name: string;
        count: number | '*';
    };
    values: SmartObject[] | SearchResult[] | TagSearchResult[];
    docRecommendations: DocRecommendation[];
}
