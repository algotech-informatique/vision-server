import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CustomerService } from '../customers/customers.service';
import { UsersService } from '../users/users.service';
import * as CryptoJS from 'crypto-js';
import { Customer, CustomerLicence, User } from '../../interfaces';

@Injectable()
export class LicenceService {

    key = 'Cc8!kSDI*Ng`5,.'; // must be encapsuled with prod compilation

    constructor(
        private readonly customerService: CustomerService,
        private readonly userService: UsersService,
    ) { }

    getCustomerLicence(customerKey: string): Observable<CustomerLicence> {
        const customer$: Observable<Customer> = this.customerService.findByCustomerKey(customerKey);
        return customer$.pipe(
            map((customer: Customer) => this._decryptKey(customerKey, customer.licenceKey)),
        );
    }
    setCustomerLicence(lic: CustomerLicence): Observable<Customer> {
        const customer$: Observable<Customer> = this.customerService.findByCustomerKey(lic.customerKey);
        return customer$.pipe(
            mergeMap((customer: Customer) => {
                const licenceKey = this._encryptKey(lic);
                const updatedCustomer = Object.assign(customer, { licenceKey });
                return this.customerService.update(lic.customerKey, updatedCustomer);
            }),
        );
    }

    canAddMoreUser(customerKey: string, checkDesktop: boolean, checkMobile: boolean): Observable<boolean> {
        const customer$: Observable<Customer> = this.customerService.findByCustomerKey(customerKey);
        const users$: Observable<User[]> = this.userService.findAll(customerKey);
        return customer$.pipe(
            mergeMap((customer: Customer) =>
                users$.pipe(
                    map((users: User[]) => ({
                        licenceKey: customer.licenceKey,
                        numberOfUser: users.length,
                    })),
                ),
            ),
            map((result: { licenceKey: string, numberOfUser: number }) => {
                const lic: CustomerLicence = this._decryptKey(customerKey, result.licenceKey);
                const canDesktop = checkDesktop ? this._checkQuota(lic.desktop, result.numberOfUser + 1) : true;
                const canMobile = checkMobile ? this._checkQuota(lic.mobile, result.numberOfUser + 1) : true;
                return canDesktop && canMobile;
            }),
        );
    }

    _checkQuota(limit: number, expected: number): boolean {
        if (limit === -1) { return true; }
        return expected <= limit;
    }

    _decryptKey(customerKey: string, token: string): CustomerLicence {
        const lic = JSON.parse(CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8));
        if (lic.customerKey && lic.customerKey === customerKey) {
            return lic as CustomerLicence;
        } else {
            return null;
        }
    }

    _encryptKey(lic: CustomerLicence): string {
        return CryptoJS.AES.encrypt(JSON.stringify(lic), this.key);
    }
}