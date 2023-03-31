import { Injectable } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PatchPropertyDto } from '@algotech-ce/core';
import { Observable } from 'rxjs';
import { CustomerInit, CustomerInitResult, IdentityRequest, Settings } from '../../interfaces';

@Injectable()
export class SettingsHead {
    constructor(private readonly settingsService: SettingsService) { }

    findAll(): Observable<Settings[]> {
        return this.settingsService.findAllCustomers();
    }

    findOne(data: { identity: IdentityRequest }): Observable<Settings> {
        return this.settingsService.findOneByCustomerKey(data.identity.customerKey);
    }

    init(data: { customer: CustomerInit }): Observable<CustomerInitResult> {
        return this.settingsService.init(data.customer);
    }

    create(data: { identity: IdentityRequest, settings: Settings }): Observable<Settings> {
        return this.settingsService.create(data.identity.customerKey, data.settings);
    }

    update(data: { identity: IdentityRequest, settings: Settings }): Observable<Settings> {
        return this.settingsService.update(data.identity.customerKey, data.settings);
    }

    patch(data: { identity: IdentityRequest, uuid: string, patches: PatchPropertyDto[] }): Observable<PatchPropertyDto[]> {
        return this.settingsService.patchProperty(data.identity.customerKey, data.uuid, data.patches);
    }
}