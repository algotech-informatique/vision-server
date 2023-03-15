import { IconMetadata } from './icon-metadata.interface';

export interface FileIcon {
    readonly _id: string;
    readonly metadata: IconMetadata;
    readonly filename: string;
    readonly aliases: boolean;
    readonly chunkSize: number;
    readonly uploadDate: string;
    readonly length: number;
    readonly contentType: string;
    readonly md5: string;
}