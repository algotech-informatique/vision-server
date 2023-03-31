import { from, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { URL } from 'url';
import { WsUserDto, UserDto } from '@algotech-ce/core';
import { ClassConstructor } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { IdentityRequest, WorkerMessage, WsClient, WsRoom } from '../../interfaces';
import { NatsService } from '../../providers';
import { AuthHead } from '../../providers/auth/auth.head';
import * as jwt from 'jsonwebtoken';

const MAX_USERS = 50;

export enum BroadcastingMode {
    IncludeMe,
    MultiRoom,
}

export interface QueryUser {
    includes: string[];
    excludes: string[];
}

@Injectable()
export class WebSocketService {

    rooms: WsRoom[] = [];

    constructor(private nats: NatsService, private authHead: AuthHead) {
        process.on('message', (msg: WorkerMessage) => {
            if (msg.cmd === 'socket.broadcast') {
                this.broadcast(msg.data.cmd, msg.data.payload, msg.data.client, msg.data.mode, msg.data.queryUsers);
            } else if (msg.cmd === 'socket.unicast') {
                this.unicast(msg.data.cmd, msg.data.payload, msg.data.client);
            }
        });
    }

    getRoom(namespace: string, customer: string) {
        let room = this.rooms.find(r => r.namespace === namespace && r.customer === customer);
        if (!room) {
            room = {
                namespace,
                customer,
                colorsAvailable: Array.from({ length: MAX_USERS }, (v, i) => i),
                wsClients: [],
            };
            this.rooms.push(room);
        }
        return room;
    }

    handleConnection(client: any, args) {
        const url = new URL(`http://socket${args.url}`);
        const token = url.searchParams.get('jwt');
        const namespace = url.pathname;

        if (!token) {
            client.close();
            return;
        }

        let decoded;
        let customerKey;
        try {
            decoded = jwt.decode(token);
            customerKey = process.env.CUSTOMER_KEY ? process.env.CUSTOMER_KEY : 'vision';
        } catch (err) {
            decoded = null;
        }

        if (decoded == null || customerKey == null) {
            // if not authorized
            client.close();
        } else {
            this.authHead.validateTokenUser(token)
                .subscribe((authenticated) => {
                    if (!authenticated) {
                        client.close();
                    } else {
                        const identity: IdentityRequest = {
                            login: decoded.preferred_username,
                            customerKey,
                            groups: decoded.groups,
                            sessionId: decoded.nonce,
                        };

                        const room = this.getRoom(namespace, customerKey);

                        const aWsUser: WsUserDto = {
                            uuid: decoded.sub,
                            email: decoded.email,
                            firstName: decoded.given_name,
                            lastName: decoded.family_name,
                            pictureUrl: '',
                            color: room.colorsAvailable[0],
                            focus: null,
                        };

                        room.wsClients.push({
                            identity,
                            user: aWsUser,
                            client,
                            sessionId: decoded.nonce,
                        });
                        room.colorsAvailable.splice(0, 1);

                        // Broadcast the new user to all except current client
                        this.broadcast('ws.user.add', aWsUser, client);
                        // Unicast the list of the user&focus(except current client) to the current client
                        this.unicast('ws.initialize',
                            room.wsClients
                                .filter((wsClient) => wsClient.client !== client)
                                .map((wsClient) => wsClient.user),
                            client);
                    }
                }, () => {
                    client.close();
                });
        }
    }

    handleDisconnect(client) {
        let aWsClient: WsClient = null;
        let aRoom: WsRoom = null;

        for (const room of this.rooms) {
            for (const wsClient of room.wsClients) {
                if (wsClient.client === client) {
                    aRoom = room;
                    aWsClient = wsClient;

                    break;
                }
            }
        }
        if (aWsClient) {
            aRoom.colorsAvailable.push(aWsClient.user.color);
            aRoom.colorsAvailable.sort((a, b) => a - b);
            /* const sort = aRoom.colorsAvailable.sort((a, b) => a - b);
            aRoom.colorsAvailable = sort; */

            // Broadcast the remove user to all
            this.broadcast('ws.user.rm', aWsClient.user, aWsClient.client, [BroadcastingMode.IncludeMe]);

            // Remove
            aRoom.wsClients.splice(aRoom.wsClients.findIndex(c => c === aWsClient), 1);
            if (aRoom.wsClients.length === 0) {
                this.rooms.splice(this.rooms.findIndex(r => r === aRoom), 1);
            }
        }
    }

    public broadcastFocus(pattern: string, client: any, zone: any) {
        let aWsClient: WsClient = null;
        for (const room of this.rooms) {
            aWsClient = room.wsClients.find(c => c.client === client);
            if (aWsClient) {
                break;
            }
        }
        // Assigne la zone
        aWsClient.user.focus = {
            pattern,
            zone: aWsClient.user.focus ? aWsClient.user.focus.zone : null,
        };
        if (_.isString(zone)) {
            aWsClient.user.focus.zone = zone;
        }

        // Broadcast the zone to all except current
        this.broadcast(`${pattern}.focus.chg`, {
            color: aWsClient.user.color,
            zone,
        }, client);
    }

    public saveAndBroadcast<T>(
        event: string,
        action: Observable<T>,
        client: any,
        payload: any,
        type: 'payload' | 'microservice' = 'payload',
        dtoType?: ClassConstructor<{}>,
        mode: BroadcastingMode[] = [],
        queryUsers?: QueryUser,
    ): Observable<any> {

        const obs = this.nats.httpResult(action, dtoType);
        return obs.pipe(
            mergeMap((response) => {
                const data = type === 'payload' ? payload : response;
                this.broadcast(event, data, client, mode, queryUsers);
                return of({ event: `${event}.ack`, data: {} });
            }),
            catchError((err) => {
                return of({ event: `${event}.err`, data: err });
            }),
        );
    }

    public getIdentity(client): IdentityRequest {
        for (const room of this.rooms) {
            const wsClient = room.wsClients.find(c => c.client === client);
            if (wsClient) {
                return wsClient.identity;
            }
        }
        return null;
    }

    public getClient(identity: IdentityRequest): any {
        for (const room of this.rooms) {
            const wsClient = room.wsClients.find(c => c.identity.login === identity.login && c.identity.customerKey === identity.customerKey);
            if (wsClient) {
                return wsClient.client;
            }
        }
        return null;
    }

    public unicast(event, message, client) {
        const unicastMessage = JSON.stringify({ event, data: message });
        if (client.readyState === 1) {
            client.send(unicastMessage);
        }
    }

    public broadcast(event, message: any, client, mode: BroadcastingMode[] = [], queryUsers?: QueryUser) {
        const broadCastMessage = JSON.stringify({ event, data: message, timestamp: new Date().getTime() });
        const selfBroadCastMessage = JSON.stringify({ event: `${event}.ack`, data: message, timestamp: new Date().getTime() });

        let rooms = _.clone(this.rooms);
        const currentRoom: WsRoom = _.find(rooms, ((r) => _.find(r.wsClients, (c => c.client === client))));

        // filter by customer
        if (!client) {
            rooms = [];
        } else if (!currentRoom && !client.customerKey) {
            rooms = [];
        } else if (currentRoom) {
            rooms = rooms.filter((r: WsRoom) => r.customer === currentRoom.customer);
        } else {
            rooms = rooms.filter((r: WsRoom) => r.customer === client.customerKey);
        }

        rooms = mode.indexOf(BroadcastingMode.MultiRoom) !== -1 ? rooms : [currentRoom];

        for (const room of rooms) {
            for (const aWsClient of room.wsClients) {
                const self = aWsClient.client === client || aWsClient.sessionId === client.sessionId;
                if (
                    (aWsClient.client.readyState === 1) &&
                    (mode.indexOf(BroadcastingMode.IncludeMe) !== -1 || (!self))
                ) {
                    if (queryUsers) {
                        // check current user is inside query (group|uuid)
                        const groups = _.map(aWsClient.identity.groups, group => `grp:${group}`);
                        const users = [`usr:${aWsClient.identity.login}`];

                        const _includes = _.intersection(_.concat(users, groups), queryUsers.includes).length !== 0;
                        const _excludes = _.intersection(_.concat(users, groups), queryUsers.excludes).length === 0;

                        if (_includes && _excludes) {
                            aWsClient.client.send(self ? selfBroadCastMessage : broadCastMessage);
                        }
                    } else {
                        aWsClient.client.send(self ? selfBroadCastMessage : broadCastMessage);
                    }
                }
            }
        }
    }
}