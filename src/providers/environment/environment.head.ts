import { identity, Observable, tap } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { EnvironmentConnectorDto, PatchPropertyDto } from '@algotech-ce/core';
import { EnvironmentService } from './environment.service';
import { CustomerInit, CustomerInitResult, Environment, IdentityRequest } from '../../interfaces';
import cluster from 'cluster';

@Injectable()
export class EnvironmentHead {

    constructor(
        private readonly environmentService: EnvironmentService,
    ) { }

    findOne(data: { identity: IdentityRequest }): Observable<Environment> {
        return this.environmentService.findOneByCustomerKey(data.identity.customerKey);
    }

    init(data: { customer: CustomerInit }): Observable<CustomerInitResult> {
        return this.environmentService.init(data.customer);
    }

    create(data: { identity: IdentityRequest; data: Environment }): Observable<Environment> {
        return this.environmentService.create(data.identity.customerKey, data.data);
    }

    update(data: { identity: IdentityRequest; data: Environment }): Observable<Environment> {
        return this.environmentService.update(data.identity.customerKey, data.data);
    }

    patch(data: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {
        return this.environmentService.patchProperty(data.identity.customerKey, data.data.uuid, data.data.patches).pipe(
            tap(() => {
                if (cluster.isWorker) {
                    process.emit('message', { cmd: 'clear-data-cache' }, this);
                }
            })
        )
    }

    getParameters(data: { identity: IdentityRequest }): Observable<EnvironmentConnectorDto[]> {
        return this.environmentService.getParameters(data.identity.customerKey);
    }

    setParameters(data: { identity: IdentityRequest; connectors: EnvironmentConnectorDto[] }): Observable<EnvironmentConnectorDto[]> {
        return this.environmentService.setParameters(data.identity.customerKey, data.connectors);
    }

    encryptPassword(password: string) {
        return this.environmentService.encryptPassword(password);
    }

    decryptPassword(encryptedString: string) {
        return this.environmentService.decryptPassword(encryptedString);
    }

}