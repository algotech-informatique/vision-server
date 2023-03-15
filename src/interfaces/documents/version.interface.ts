import { SmartPropertyObject } from '../smart-objects/smart-property-object.interface';
import { Annotation } from './annotation.interface';

export interface Version {
    readonly uuid: string;
    readonly fileID: string;
    readonly linkedFilesID: string[];
    readonly size: number;
    readonly dateUpdated: string;
    readonly reason: string;
    readonly userID: string;
    readonly extendedProperties: SmartPropertyObject[];
    readonly annotations: Annotation[];
}
