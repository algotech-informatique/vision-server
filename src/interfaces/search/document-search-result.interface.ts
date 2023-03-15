import { Document } from '../documents/document.interface';

export interface DocumentSearchResult extends Document {
    highlights: string[];
}
