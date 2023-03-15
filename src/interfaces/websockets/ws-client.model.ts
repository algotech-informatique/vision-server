
import { WsUserDto } from '@algotech/core';
import { IdentityRequest } from '../identity-request/identity-request';

export interface WsClient {
    identity: IdentityRequest;
    user: WsUserDto;
    client: any;
    sessionId: string;
}