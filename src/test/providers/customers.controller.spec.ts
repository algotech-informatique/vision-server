import { CustomersController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { createCustomer, customer1, customer2, updateCustomer } from '../fixtures/customers';
import { CustomerDto } from '@algotech-ce/core';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
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

const identityTestSadmin: IdentityRequest = {
    login: 'jford',
    groups: ['sadmin'],
    customerKey: 'test-customer',
};

describe('CustomersController', () => {
    let customerController: CustomersController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        customerController = app.get<CustomersController>(CustomersController);

        await utils.Before(app, 'customers', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(customerController).toBeDefined();
    });

    it ('/FINDALL', (done) => {
        customerController.findAll(identity).subscribe({
            next: (res: CustomerDto[]) => {
                expect(res).toMatchPartialObject([customer1]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers list not found');
            },
        });
    });

    it ('/FIND (by uuid)', (done) => {
        customerController.findOneByUuid(identityCustomerKey2, customer2.uuid ).subscribe({
            next: (res: CustomerDto | {}) => {
                expect(res).toMatchPartialObject(customer2);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not found');
            },
        });
    });

    it ('/FIND (by key)', (done) => {
        customerController.getByCustomerKey(identity).subscribe({
            next: (res: CustomerDto) => {
                expect(res).toMatchPartialObject(customer1);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not found');
            },
        });
    });

    it ('/CREATE', (done) => {
        customerController.create(identityTest, createCustomer).subscribe({
            next: (res: CustomerDto) => {
                createCustomer.uuid = res.uuid;
                expect(res).toMatchPartialObject(createCustomer);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not created');
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateCustomer.uuid = createCustomer.uuid;
        customerController.update(identityTest, updateCustomer).subscribe({
            next: (res: CustomerDto) => {
                expect(res).toMatchPartialObject(updateCustomer);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not created');
            },
        });
    });

    /* 
    it ('/SETLICENSE', (done) => {
        const payload = {
            desktop: 1,
            mobile: 0,
            space: 0,
        };
        customerController.setLicence(identityTestSadmin, payload).subscribe({
            next: (res: CustomerDto) => {
                expect(res.uuid).toBe(createCustomer.uuid);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer license not set');
            },
        });
    });

    it ('/SETLICENSE (with error - no sadmin)', () => {
        const payload = {
            desktop: 1,
            mobile: 0,
            space: 0,
        };
        expect( () => customerController.setLicence(identityTest, payload),
            ).toThrowError(new BadRequestException('Only Super Admin can access to this resource'));
    });

    it ('/GETLICENSE', (done) => {
        const payLoad = {
            desktop: 1,
            mobile: 0,
            space: 0,
        };
        customerController.getLicence(identity).subscribe({
            next: (res: CustomerLicence) => {
                expect(res).toMatchPartialObject(payLoad);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer license not get');
            },
        });
    });

    it ('/GETLICENSE (with error - no sadmin)', () => {
        const payLoad = {
            customerKey: identityTest.customerKey,
            desktop: true,
            mobile: 0,
            space: 0,
        };
        expect (() => customerController.getLicence(identityTest),
            ).toThrowError(new BadRequestException('Only Super Admin can access to this resource'));
    });

    it ('/PATCH', (done) => {
        customerController.patchCustomer(identityTestSadmin, createCustomer.uuid, [patchSet]).subscribe({
            next: (res: any) => {
                expect(res).toMatchPartialObject([patchSet]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not patched');
            },
        });
    });

    it ('/PATCH (with error - no sadmin)', () => {
        expect( () => customerController.patchCustomer(identityTest, createCustomer.uuid, [patchSet]),
            ).toThrowError(new BadRequestException('Only Super Admin can access to this resource'));
    });
 */
    it ('/DELETE', (done) => {
        customerController.delete(identityTestSadmin, {uuid: createCustomer.uuid}).subscribe({
            next: (res: boolean) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Customer not deleted');
            },
        });
    });

});