import { SmartObject } from '../smart-objects/smart-object.interface';
import { DocumentSearchResult } from './document-search-result.interface';

export interface SearchResult {
    smartObjects: SmartObject[];
    file: DocumentSearchResult;
}
