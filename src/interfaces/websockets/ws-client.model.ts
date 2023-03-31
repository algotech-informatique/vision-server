
import { WsUserDto } from '@algotech-ce/core';
import { IdentityRequest } from '../identity-request/identity-request';

export interface WsClient {
    identity: IdentityRequest;
    user: WsUserDto;
    client: any;
    sessionId: string;
}