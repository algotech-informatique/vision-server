import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PatchPropertyDto } from '@algotech-ce/core';
import { NotificationsService } from './notifications.service';
import { IdentityRequest, Notification } from '../../interfaces';

@Injectable()
export class NotificationsHead {

    constructor(
        private readonly notificationsService: NotificationsService,
    ) {}

    findOne(data: { identity: IdentityRequest; uuid: string }): Observable<Notification> {
        return this.notificationsService.findOneAndVerify(data.identity.customerKey, data.identity.login, data.uuid);
    }

    findAll(data: { identity: IdentityRequest, state: string, skip: number; limit: number; channel?: string; sort?: string; order?: string; })
        : Observable<Notification[]> {
        const numskip = data.skip ? + data.skip : 0;
        const numlimit = data.limit ? + data.limit : 100;
        return this.notificationsService.getAllByUser(
                data.identity.customerKey,
                data.identity.login,
                data.state,
                numskip,
                numlimit,
                data.channel,
                data.order,
                data.sort);
    }

    create(data: {
        identity: IdentityRequest;
        notification: Notification;
    }): Observable<Notification> {
        return this.notificationsService.create(data.identity.customerKey, data.notification, true);
    }

    patch(data: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {
        return this.notificationsService.patchProperty(data.identity.customerKey, data.data.uuid, data.data.patches);
    }

    delete(data: { identity: IdentityRequest, uuid: string }): Observable<boolean> {
        return this.notificationsService.delete(data.identity.customerKey, data.uuid);
    }
}