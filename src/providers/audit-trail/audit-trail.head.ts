import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, IdentityRequest } from '../../interfaces';
import { SettingsDataService } from '../@base/settings-data.service';
import { SettingsDto } from '@algotech-ce/core';

@Injectable()
export class AuditTrailHead {

    constructor(
        @InjectModel('AuditLog') private readonly auditLogModel: Model<AuditLog>,
        private settingsDataService: SettingsDataService) {
    }

    public getSettings(): Observable<SettingsDto> {
        return this.settingsDataService.getContext().pipe(
            catchError((err) => {
                return of(null);
            }),
            map((context) => {
                return context.settings;
            }),
        );
    }

    public createLog(log: AuditLog) {
        return from(new this.auditLogModel(log).save());
    }

    public getLogs(dateBegin, dateEnd, identity: IdentityRequest) {
        return from(this.auditLogModel.find({
            customerKey: identity.customerKey,
            eventDate: {
                $gte: dateBegin,
                $lte: dateEnd,
            },
        }));
    }

}
