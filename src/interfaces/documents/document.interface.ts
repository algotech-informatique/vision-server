import { IndexStatus } from '@algotech-ce/core';
import { BaseDocument } from '../base/base.interface';
import { SmartPropertyObject } from '../smart-objects/smart-property-object.interface';
import { DocumentLockState } from './document-lock.interface';
import { DocumentMetadatas } from './document-metadatas.interface';
import { Version } from './version.interface';

export interface Document extends BaseDocument {
    readonly name: string;
    readonly ext: string;
    readonly documentModelKey?: string;
    readonly tags: string[];
    readonly lockState?: DocumentLockState;
    readonly extendedProperties: SmartPropertyObject[];
    readonly versions: Version[];
    readonly metadatas: DocumentMetadatas[];
    readonly indexStatus?: IndexStatus;
    readonly lastIndexDate?: string,
}
