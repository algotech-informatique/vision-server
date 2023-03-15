import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe('admin init sequence (e2e)', () => {
    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // penser à remettre les tests dès que ms-search sera intégré dans gateway
    /* const initCustomer: CustomerInitDto = {
        customerKey: 'nouveau',
        name: 'Le nouveau client',
        login: 'sadmin-nouveaux',
        email: 'abc@abc.com',
        password: '123456',
        languages: [{ lang: 'fr-FR', value: 'français' }, { lang: 'en-US', value: 'English' }],
        licenceKey: 'dsqdsqds',
    }; */

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, 'customers', request);
        });
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    it('Validate test', () => {
        expect(app).toBeDefined();
    });

    // Test init d'un customer
    /* it('/admin/customers/init', () => {
        return request(app.getHttpServer())
            .post('/admin/customers/init')
            .send(initCustomer)
            .expect(201)
            .then((response) => {
                const customerInitResult: CustomerInitResultDto[] = response.body;
                expect(customerInitResult).toEqual(jasmine.arrayContaining(initOk));
            });
    }); */

    // Test init d'un customer qui existe
    /* it('/admin/customers/init', () => {
        return request(app.getHttpServer())
            .post('/admin/customers/init')
            .send(initCustomer)
            .expect(400)
            .then((response) => {
                const customerInitResult: CustomerInitResultDto[] = response.body;
                expect(customerInitResult).toEqual(jasmine.objectContaining(initko));
            });
    }); */

    /* it('remove ES index and Pipiline', () => {
        return request(app.getHttpServer())
            .delete('/admin/customers/delete/es?customerKey=' + initCustomer.customerKey)
            .expect(200)
            .then((response) => {
                const customerInitResult: CustomerInitResultDto[] = response.body;
                expect(customerInitResult).toEqual(jasmine.arrayContaining(deleteESIndex));
            });
    }); */
});