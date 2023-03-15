import { SmartObject } from '../smart-objects/smart-object.interface';

export interface DocRecommendation {
    name: string;
    ext: string;
    smartObjects: SmartObject[];
}
