import { Controller, Get, Param, UseGuards, Query, Post, Body, Delete, Patch } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { PatchPropertyDto, DeleteDto, NotificationDto } from '@algotech/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { NatsService, NotificationsHead, UsersHead } from '../providers';
import { tap, mergeMap, map } from 'rxjs/operators';
import { ActionCode, Identity } from '../common/@decorators';
import { IdentityRequest, Notification } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { BroadcastingMode } from '../common/@websockets/web-sockets.service';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
    constructor(
        private notificationsHead: NotificationsHead,
        private usersHead: UsersHead,
        private readonly nats: NatsService,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findAll(
        @Identity() identity: IdentityRequest,
        @Query('state') state: string,
        @Query('skip') skip,
        @Query('limit') limit,
        @Query('order') order: string,
        @Query('sort') sort: string,
        @Query('channel') channel: string): Observable<NotificationDto[]> {

        // state    : all
        //          : read
        //          : unread

        return this.nats.httpResult(this.notificationsHead.findAll(
            { identity, state, skip, limit, channel, order, sort }), NotificationDto);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    find(@Identity() identity: IdentityRequest, @Param('uuid') uuid): Observable<NotificationDto | {}> {
        return this.nats.httpResult(this.notificationsHead.findOne({ identity, uuid }), NotificationDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    create(@Identity() identity: IdentityRequest, @Body() notification: NotificationDto): Observable<NotificationDto> {
        return this.nats.httpResult(
            this.notificationsHead.create({ identity, notification: notification as any }).pipe(
                mergeMap((result: Notification) => {
                    return !notification.channels || notification.channels?.includes('mobile') ?
                        this.notifyPush(identity, result) :
                        of(result);
                }),
                tap((result: Notification) => {
                    // create and return notification
                    if (!notification.channels || notification.channels?.includes('web')) {
                        this.notify(identity, result, 'add');
                    }
                }),
            ), NotificationDto);
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    patchProperty(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]) {
        return this.nats.httpResult(this.notificationsHead.patch(
            { identity, data: { uuid, patches } }).pipe(
                tap(() => {
                    // ws execute for rm
                    if (patches.find((patche) => patche.path === '/state/execute')) {
                        this.notificationsHead.findOne({ identity, uuid }).subscribe(
                            (notification: Notification) => this.notify(identity, notification, 'rm'),
                        );
                    }
                }),
            ));
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    deleteNotification(@Identity() identity: IdentityRequest, @Body() data: DeleteDto) {
        return this.nats.httpResult(this.notificationsHead.delete({ identity, uuid: data.uuid }));
    }

    private notify(identity: IdentityRequest, notification: Notification, event) {
        if (notification) {
            process.emit('message', {
                cmd: 'socket.broadcast',
                data: {
                    cmd: `event.notifications.${event}`,
                    payload: event === 'rm' ? notification.uuid : notification,
                    client: identity,
                    mode: [BroadcastingMode.MultiRoom],
                    queryUsers: {
                        includes: notification.state.to,
                        excludes: [`usr:${notification.state.from}`, `usr:${notification.state.execute}`],
                    },
                }
            }, null);
        }
    }

    private notifyPush(identity: IdentityRequest, notification: Notification): Observable<Notification> {
        const gcm = require('node-gcm');
        const sender = new gcm.Sender(process.env.FCM_KEY);
        const message = new gcm.Message({
            data: {
                notification,
            },
            notification: {
                title: notification.title,
                body: notification.content,
                click_action: 'notifications',
            },
        });
        return this.nats.httpResult(this.usersHead.getMobileToken(
            { identity, to: notification.state.to, exclude: notification.state.from }), NotificationDto)
            .pipe(
                map((regTokens: string[]) => {
                    sender.send(message, { registrationTokens: _.compact(regTokens) }, (err, resp) => { });
                    return notification;
                }),
            );
    }

}
