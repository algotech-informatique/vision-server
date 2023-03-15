import {
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WsResponse, WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { SnModelDto } from '@algotech/core';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { WebSocketService, BroadcastingMode } from './web-sockets.service';
import { EnvironmentHead, SmartNodesHead } from '../../providers';
import { SnModel } from '../../interfaces';

@WebSocketGateway(3001, { transports: ['websocket'] })
export class WebSocketBaseGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer() private server: any;

    constructor(
        private readonly smartnodesHead: SmartNodesHead,
        private readonly environmentHead: EnvironmentHead,
        protected readonly webSocketService: WebSocketService) {
    }

    handleConnection(client: any, args) {
        this.webSocketService.handleConnection(client, args);
    }

    handleDisconnect(client) {
        this.webSocketService.handleDisconnect(client);
    }

    afterInit() {
        this.server.emit('testing', { do: 'stuff' });
    }

    /*
        SMART NODES
    */
    @SubscribeMessage('event.smartnodes.add')
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { ignoreDecorators: true } }))
    onAddSmartNodeModel(client: any, payload: SnModelDto): Observable<WsResponse<any>> {
        return this.webSocketService.saveAndBroadcast('event.smartnodes.add',
            this.smartnodesHead.create({
                identity: this.webSocketService.getIdentity(client),
                data: { customerKey: '', deleted: false, ...payload } as SnModel,
            }), client, payload, 'payload', SnModelDto);
    }

    @SubscribeMessage('event.smartnodes.chg')
    onChgSmartNodeModel(client: any, payload: any): Observable<WsResponse<any>> {
        return this.webSocketService.saveAndBroadcast('event.smartnodes.chg',
            this.smartnodesHead.patch({
                identity: this.webSocketService.getIdentity(client),
                data: payload,
            }), client, payload);
    }

    @SubscribeMessage('event.smartnodes.rm')
    onRmSmartNodeModel(client: any, payload: any): Observable<WsResponse<any>> {
        return this.webSocketService.saveAndBroadcast('event.smartnodes.rm',
            this.smartnodesHead.delete({
                identity: this.webSocketService.getIdentity(client),
                data: payload,
            }), client, payload);
    }

    /*
        Environments
    */
    @SubscribeMessage('event.environment.chg')
    onChgEnvironment(client: any, payload: any): Observable<WsResponse<any>> {
        return this.webSocketService.saveAndBroadcast('event.environment.chg',
            this.environmentHead.patch({
                identity: this.webSocketService.getIdentity(client),
                data: payload,
            }), client, payload);
    }

    /*
        publish
    */
    @SubscribeMessage('event.publish')
    onPublish(client: any, payload: any) {
        this.webSocketService.broadcast('event.publish', payload, this.webSocketService.getIdentity(client),
            [BroadcastingMode.MultiRoom]);
    }

    /*
        cursor (move)
    */

    @SubscribeMessage('event.view.focus')
    onViewChange(client: any, view: string) {
        this.webSocketService.broadcastFocus('event.view', client, view);
    }

    @SubscribeMessage('event.cursor.focus')
    onCursorMove(client: any, payload: any) {
        this.webSocketService.broadcastFocus('event.cursor', client, payload);
    }
}
