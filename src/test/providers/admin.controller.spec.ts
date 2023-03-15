import { AdminController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { CustomerDto, CustomerInitResultDto, CustomerSearchDto } from '@algotech/core';
import { customer1, initCustomer } from '../fixtures/admin';
import * as _ from 'lodash';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('AdminController', () => {
    let adminController: AdminController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll( async () => {
        app = await utils.InitializeApp() as any as INestApplication;
        adminController = app.get<AdminController>(AdminController);

        await utils.Before(app, ['customers', 'users', 'groups', 'settings', 'environment', 'snmodels'], request);
    });

    afterAll((done) => {
        utils.After();
        done();
    });

    it('CREATE INSTANCE', () => {
        expect(adminController).toBeDefined();
    });

    it('/FINDALL', (done) => {
        const customerSearch: CustomerSearchDto = {
            customerKey: ['algotech'],
        };
        adminController.findCustomers( customerSearch ).subscribe({
            next: (res: CustomerDto[]) => {
                expect(res).toMatchPartialObject([customer1]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers list not found');
            },
        });
    });

    it('/INITCUSTOMER)', (done) => {
        adminController.initCustomer( initCustomer, true, true ).subscribe({
            next: (res: CustomerInitResultDto[]) => {
                done();
            },
            error: (err) => {
                return Promise.reject('Customers already exists');
            },
        });
    });

    it('/INDEXATION', (done) => {
        adminController.indexation( identity ).subscribe({
            next: (res: any) => {
                expect(res).toMatchPartialObject([]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers users not init');
            },
        });
    });

    /* it('/DELETEESINDEXANDPIPELINE', (done) => {
        adminController.deleteESindexAndPipiline( initDatabase.customerKey ).subscribe({
            next: (res: CustomerInitResultDto[]) => {
                expect(res).toMatchPartialObject([
                    { key: 'Smart Objects delete index', value: 'ok' },
                    { key: 'Documents delete index', value: 'ok' },
                ]);
                done();
            },
            error: (err) => {
                return Promise.reject('Customers delete ES Index And Pipeline');
            },
        });
    }); */

});