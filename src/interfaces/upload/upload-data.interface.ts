import { FileUploadDto, SysFile } from '@algotech/core';
import { IdentityRequest } from '../identity-request/identity-request';
import { UploadFile } from './upload-file.interface';

export interface UploadData {
    identity: IdentityRequest;
    file: UploadFile;
    uuid: string;
    details: FileUploadDto;
}