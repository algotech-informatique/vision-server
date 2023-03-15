import { CustomerInitResult,IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { AdminHead } from '../../providers';
import { initCustomer, initDatabase, initOk } from '../fixtures/admin';
import * as _ from 'lodash';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('AdminHead', () => {
    let adminHead: AdminHead;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        adminHead = app.get<AdminHead>(AdminHead);

        await utils.Before(app, ['customers', 'users', 'groups', 'settings', 'environment', 'snmodels'], request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(adminHead).toBeDefined();
    });

    /* it('/FINDALL', (done) => {
        const customerSearch: CustomerSearch = {
            customerKey: ['algotech'],
        };
        adminHead.findAllCustomers({customerSearch}).subscribe({
            next: (res: Customer[]) => {
                expect(res).toMatchPartialObject([customer1]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers list not found');
            },
        });
    }); */

    /* it('/FINDALL (all)', (done) => {
        const customerSearch: CustomerSearch = {
            all: true,
        };
        adminHead.findAllCustomers({customerSearch}).subscribe({
            next: (res: Customer[]) => {
                expect(res).toMatchPartialObject([customer1, customer2, customer3]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers list not found');
            },
        });
    }); */

    it('/INITCUSTOMER', (done) => {
        adminHead.initCustomer({customer: initCustomer}).subscribe({
            next: (res: CustomerInitResult) => {
                expect(res).toMatchPartialObject(initOk[0]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers not init');
            },
        });
    });

    it('/INITCUSTOMER (with error - exists)', (done) => {
        adminHead.initCustomer({customer: initCustomer}).subscribe({
            next: (res: CustomerInitResult) => {
                return Promise.reject('Customers already exists');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/INITUSER', (done) => {
        adminHead.initUser({customer: initCustomer, ignoreEmail: true }).subscribe({
            next: (res: CustomerInitResult) => {
                expect(res).toMatchPartialObject(initOk[1]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers users not init');
            },
        });
    });

    /* it('/INITSADMINUSER', (done) => {
        adminHead.initsadminUser({customer: initCustomer, ignoreEmail: true }).subscribe({
            next: (res: CustomerInitResult) => {
                expect(res).toMatchPartialObject(initOk[1]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers users not init');
            },
        });
    }); */

    it('/RESETSOPIPELINE', (done) => {
        adminHead.resetESPipelineAndTempates(initDatabase).subscribe({
            next: (res: CustomerInitResult[]) => {
                expect(res).toMatchPartialObject([
                    { key: 'Documents pipeline', value: 'ok' },
                    { key: 'Documents template', value: 'ok' },
                    { key: 'SO template', value: 'ok' },
                    { key: 'SO template Search', value: 'ok' },
                    { key: 'Nested Values template', value: 'ok' },
                ]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers users not init');
            },
        });
    });

});