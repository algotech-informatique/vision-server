import { WsClient } from './ws-client.model';

export interface WsRoom {
    customer: string; // ID
    namespace: string; // ID
    colorsAvailable: number[];
    wsClients: WsClient[];
}