import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerService } from './customers.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { LicenceService } from '../admin/licence.service';
import { Customer, CustomerLicence, IdentityRequest } from '../../interfaces';
import { PatchPropertyDto } from '@algotech/core';

@Injectable()
export class CustomerHead {
    constructor(
        private readonly customerService: CustomerService,
        private readonly licenceService: LicenceService) { }

    findOneByUuid(data: { identity: IdentityRequest, uuid: string }): Observable<Customer> {
        return this.customerService.findOne(data.identity.customerKey, data.uuid);
    }

    findAll(data: { identity: IdentityRequest }): Observable<Customer[]> {
        return this.customerService.findAll(data.identity.customerKey);
    }

    findByCustomerKey(data: { identity: IdentityRequest }): Observable<Customer> {
        return this.customerService.findByCustomerKey(data.identity.customerKey);
    }

    create(data: { identity: IdentityRequest, customer: Customer }): Observable<Customer> {
        return this.customerService.create(data.identity.customerKey, data.customer);
    }

    update(data: { identity: IdentityRequest, customer: Customer }): Observable<Customer> {
        return this.customerService.update(data.identity.customerKey, data.customer);
    }

    delete(data: { identity: IdentityRequest, uuid: string }): Observable<boolean> {

        const obsDelete$: Observable<boolean> = this.findOneByUuid(data).pipe(
            mergeMap(() => {
                    return this.customerService.delete(data.identity.customerKey, data.uuid);
            }),
            catchError(() => {
                return of(false);
            }),
        );
        return obsDelete$.pipe(mergeMap(
            (result: boolean) => {
                if (result === true) {
                    return of(result);
                } else {
                    return throwError(() => new BadRequestException('Delete customer failed'));
                }
            },
        ));
    }

    setLicence(data: { identity: IdentityRequest, payload: any }): Observable<Customer> {
        const lic: CustomerLicence = {
            customerKey: data.identity.customerKey,
            desktop: data.payload.desktop ? data.payload.desktop : 0,
            mobile: data.payload.mobile ? data.payload.mobile : 0,
            space: data.payload.space ? data.payload.space : 0,
        };
        return this.licenceService.setCustomerLicence(lic);
    }

    getLicence(data: { identity: IdentityRequest }): Observable<CustomerLicence> {
        return this.licenceService.getCustomerLicence(data.identity.customerKey);
    }

    patchCustomer(data: { identity: IdentityRequest, uuid: string, patches: any }): Observable<PatchPropertyDto[]> {
        return this.customerService.patchProperty(data.identity.customerKey, data.uuid, data.patches);
    }
}