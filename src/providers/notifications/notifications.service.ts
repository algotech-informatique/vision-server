import { Injectable, BadRequestException } from '@nestjs/common';
import * as _ from 'lodash';
import { Observable, zip, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { BaseService } from '../@base/base.service';
import { Notification, User } from '../../interfaces';

@Injectable()
export class NotificationsService extends BaseService<Notification> {

    constructor(
        @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
        private usersService: UsersService) {
        super(notificationModel);
    }

    findOneAndVerify(customerKey: string, login: string, id: string): Observable<Notification> {
        return zip(
            this.usersService.findOneByLogin(customerKey, login),
            super.findOne(customerKey, id)).pipe(
                map((results: any[]) => {
                    const user: User = results[0];
                    const notification = results[1];

                    if (notification) {
                        this.verifyNotification(notification, user);
                        return notification;
                    } else {
                        throw new BadRequestException('notification unknown');
                    }
                }),
            );
    }

    getAllByUser(
        customerKey: string,
        login: string,
        state: string,
        skip: number,
        limit: number,
        channel?: string,
        order?: string | number,
        sort?: string,
    ): Observable<Notification[]> {
        return this.usersService.findOneByLogin(customerKey, login).pipe(
            mergeMap((user: User) => {
                const matchRead = (!state || state === 'all') ?
                    {} :
                    {
                        ['state.read']: state === 'read' ? { $in: [user.username] } : { $nin: [user.username] },
                    };

                const matchFrom = { ['state.from']: { $ne: user.username } };

                const matchTo = {
                    $or:
                        _.concat([{
                            ['state.to']: { $in: [`usr:${user.username}`] },
                        },
                        ], _.map(user.groups, (group) => {
                            return {
                                ['state.to']: { $in: [`grp:${group}`] },
                            };
                        })),
                };

                const matchExecute = {
                    $or: [
                        { ['state.execute']: '' },
                        { ['state.execute']: { $exists: false } },
                        { ['state.execute']: null },
                        { ['state.execute']: user.username },
                    ],
                };

                const matchChannel = channel ? {
                    $or: [
                        { channels: { $exists: false } },
                        { channels: channel }
                    ],
                } : {};

                const query = {
                    customerKey,
                    deleted: false,
                    $and: [
                        matchRead,
                        matchFrom,
                        matchTo,
                        matchExecute,
                        matchChannel,
                    ],
                };

                const aggregates: any = [
                    { $match: query },
                ];

                const _sort = sort ? sort : 'date';
                if ((!order && !sort) || order === 'desc' || order === -1) {
                    order = -1;
                } else {
                    order = 1;
                }

                aggregates.push(
                    { $sort: { [_sort]: order } },
                    { $skip: skip },
                    { $limit: limit });

                const obsList = this.notificationModel.aggregate(aggregates);

                return from(obsList).pipe(
                    map((notifications: Notification[]) => {
                        return notifications;
                    }),
                );
            }),
        );
    }

    verifyNotification(notification: Notification, user: User) {
        if (!notification.state.to) {
            throw new BadRequestException('notification not have "TO" property');
        }

        if (_.intersection(_.concat([`usr:${user.username}`], _.map(user.groups, group => `grp:${group}`)),
            notification.state.to).length === 0) {
            throw new BadRequestException('notification is not intended to the current user');
        }
    }
}