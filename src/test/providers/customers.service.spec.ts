import { Customer, IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { createCustomer, customer1, customer2, patchSet, updateCustomer } from '../fixtures/customers';
import { CustomerHead } from '../../providers';
import { PatchPropertyDto } from '@algotech/core';

declare const jasmine, describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

const identityError: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: '',
};

const identityCustomerKey2: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'customerKey2',
};

const identityTest: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'test-customer',
};

describe('CustomersHead', () => {
    let customerHead: CustomerHead;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        customerHead = app.get<CustomerHead>(CustomerHead);

        await utils.Before(app, 'customers', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(customerHead).toBeDefined();
    });

    it ('/FINDALL', (done) => {
        const data = { identity };
        customerHead.findAll(data).subscribe({
            next: (res: Customer[]) => {
                expect(res).toMatchPartialObject([customer1]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers list not found');
            },
        });
    });

    it ('/FIND (by uuid)', (done) => {
        const data = { identity: identityCustomerKey2, uuid: customer2.uuid };
        customerHead.findOneByUuid(data).subscribe({
            next: (res: Customer) => {
                expect(res).toMatchPartialObject(customer2);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not found');
            },
        });
    });

    it ('/FIND (by key)', (done) => {
        const data = { identity };
        customerHead.findByCustomerKey(data).subscribe({
            next: (res: Customer) => {
                expect(res).toMatchPartialObject(customer1);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not found');
            },
        });
    });

    it ('/FIND (with error)', (done) => {
        const data = { identity, uuid: 'no-uuid-exists' };
        customerHead.findOneByUuid(data).subscribe({
            next: (res: Customer) => {
                return Promise.reject('Customer found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/FIND (with error - key)', (done) => {
        const data = { identity: identityError };
        customerHead.findByCustomerKey(data).subscribe({
            next: (res: Customer) => {
                return Promise.reject('Customer found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/CREATE', (done) => {
        const data = { identity: identityTest, customer: createCustomer as Customer };
        customerHead.create(data).subscribe({
            next: (res: Customer) => {
                createCustomer.uuid = res.uuid;
                expect(res).toMatchPartialObject(createCustomer);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not created');
            },
        });
    });

    it ('/CREATE (with error)', (done) => {
        const data = { identity, customer: customer1 as Customer };
        customerHead.create(data).subscribe({
            next: (res: Customer) => {
                return Promise.reject('Customer already created');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateCustomer.uuid = createCustomer.uuid;
        const data = { identity: identityTest, customer: updateCustomer as Customer };
        customerHead.update(data).subscribe({
            next: (res: Customer) => {
                expect(res).toMatchPartialObject(updateCustomer);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not created');
            },
        });
    });

    it ('/UPDATE (with error, no Identity)', (done) => {
        const data = { identity: identityError, customer: updateCustomer as Customer };
        customerHead.update(data).subscribe({
            next: (res: Customer) => {
                return Promise.reject('Customer not match');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE (with error - no uuid)', (done) => {
        updateCustomer.uuid = 'no-uuid-exists';
        const data = { identity: identityError, customer: updateCustomer as Customer };
        customerHead.update(data).subscribe({
            next: (res: Customer) => {
                return Promise.reject('Customer not match');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/PATCH', (done) => {
        const data = { identity: identityTest, uuid: createCustomer.uuid, patches: [patchSet] };
        customerHead.patchCustomer(data).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject([patchSet]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not patched');
            },
        });
    });

    /* it ('/SETLICENSE', (done) => {
        const payload = {
            desktop: true,
            mobile: false,
            space: false,
        };
        const data = { identity: identityTest, payload };
        customerHead.setLicence(data).subscribe({
            next: (res: Customer) => {
                expect(res.customerKey).toBe(identityTest.customerKey);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer license not set');
            },
        });
    });

    it ('/GETLICENSE', (done) => {
        const payLoad = {
            customerKey: identityTest.customerKey,
            desktop: true,
            mobile: 0,
            space: 0,
        };
        const data = { identity: identityTest };
        customerHead.getLicence(data).subscribe({
            next: (res: CustomerLicence) => {
                expect(res).toMatchPartialObject(payLoad);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer license not get');
            },
        });
    }); */

    it ('/DELETE', (done) => {
        const data = { identity: identityTest, uuid: createCustomer.uuid };
        customerHead.delete(data).subscribe({
            next: (res: boolean) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not deleted');
            },
        });
    });

    it ('/DELETE (with error)', (done) => {
        const data = { identity: identityError, uuid: 'no-uuid-exists' };
        customerHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('Customer deleted');
            },
            error: (err) => {
                done();
            },
        });
    });

});