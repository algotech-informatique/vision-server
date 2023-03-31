import { INestApplication } from '@nestjs/common';
import { customer1 } from '../fixtures/customers';
import { TestUtils } from '../utils';
import { CustomerDto } from '@algotech-ce/core';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe('CustomersController (e2e)', () => {
    const request = require('supertest');
    const _ = require('lodash');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    const modifyCustomer: CustomerDto = {
        uuid: 'd3f179ac-3415-49e9-857b-ead1b70cee92',
        customerKey: 'algotech',
        name: 'Algotech Informatique',
        logoUrl: 'fake-url:algotech',
        languages: [
            {
                lang: 'fr-FR',
                value: 'Français',
            },
            {
                lang: 'en-US',
                value: 'English',
            },
            {
                lang: 'es-ES',
                value: 'Español',
            },
            {
                lang: 'it-IT',
                value: 'Italiano',
            },
        ],
        licenceKey: 'U2FsdGVkX19Qi4u1tBzPDXXkaju+hOJeU1qjn/MeUZMXHbs40XjPbs0pltlPx4UyxmNvK6Xi5r5ZULZR/hiEN9mG16UxLvMYEz2b/WTsdJ8=',
        applicationsKeys: [
            '5f9a0d75-847d-488f-85cd-57581d9c0dc6',
            '77378424-cc2d-4e0b-93bb-c0a996044dcc',
            'f8312f4d-b0e1-4fd8-a171-dbce6b44b5a0',
        ],
    };

    const modifyCustomerWrongCustomerKey: CustomerDto = {
        customerKey: 'algotechfake',
        name: 'Algotech Informatique',
        logoUrl: 'fake-url:algotech',
        languages: [
            {
                lang: 'fr-FR',
                value: 'Français',
            },
            {
                lang: 'en-US',
                value: 'English',
            },
            {
                lang: 'es-ES',
                value: 'Español',
            },
            {
                lang: 'it-IT',
                value: 'Italiano',
            },
        ],
        licenceKey: 'U2FsdGVkX19Qi4u1tBzPDXXkaju+hOJeU1qjn/MeUZMXHbs40XjPbs0pltlPx4UyxmNvK6Xi5r5ZULZR/hiEN9mG16UxLvMYEz2b/WTsdJ8=',
        applicationsKeys: [
            '5f9a0d75-847d-488f-85cd-57581d9c0dc6',
            '77378424-cc2d-4e0b-93bb-c0a996044dcc',
            'f8312f4d-b0e1-4fd8-a171-dbce6b44b5a0',
        ],
    };

    const modifyCustomerWrongUuid: CustomerDto = {
        uuid: '00742',
        customerKey: 'algotech',
        name: 'Algotech Informatique',
        logoUrl: 'fake-url:algotech',
        languages: [
            {
                lang: 'fr-FR',
                value: 'Français',
            },
            {
                lang: 'en-US',
                value: 'English',
            },
            {
                lang: 'es-ES',
                value: 'Español',
            },
            {
                lang: 'it-IT',
                value: 'Italiano',
            },
        ],
        licenceKey: 'U2FsdGVkX19Qi4u1tBzPDXXkaju+hOJeU1qjn/MeUZMXHbs40XjPbs0pltlPx4UyxmNvK6Xi5r5ZULZR/hiEN9mG16UxLvMYEz2b/WTsdJ8=',
        applicationsKeys: [
            '5f9a0d75-847d-488f-85cd-57581d9c0dc6',
            '77378424-cc2d-4e0b-93bb-c0a996044dcc',
            'f8312f4d-b0e1-4fd8-a171-dbce6b44b5a0',
        ],
    };

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

    // Test de la recuperation des parametres du client selon sa customerKey
    it('/customers (GET)', () => {
        return request(app.getHttpServer())
            .get('/customers')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const customers: object[] = utils.clearDates(response.body);
                expect(customers).toEqual(jasmine.arrayContaining([
                    customer1,
                ]));
            });
    });

    it('/customers/self (GET by CustomerKey)', () => {
        return request(app.getHttpServer())
            .get('/customers/self')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const customers: object[] = utils.clearDates(response.body);
                expect(customers).toEqual((customer1),
                );
            });
    });

    // Test de la recuperation d'un customer inexistant
    it('/customers/uuid - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/customers/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'un customer by uuid
    // it('/customers/uuid (GET)', () => {
    //     return request(app.getHttpServer())
    //         .get('/customers/' + customer1.uuid)
    //         .set('Authorization', utils.authorizationJWT)
    //         .expect(200)
    //         .then((response) => {
    //             const customer: object = response.body;
    //             expect(customer).toEqual(customer1);
    //         });
    // });

    // Test de l'ajout d'un customer
    // it('/customers (POST)', () => {
    //     return request(app.getHttpServer())
    //         .post('/customers')
    //         .set('Authorization', utils.authorizationJWT)
    //         .send(createCustomer)
    //         .expect(201)
    //         .then(response => {
    //             const customer: any = response.body;
    //             delete customer.uuid;
    //             expect(customer).toEqual(jasmine.objectContaining(createCustomer));
    //         });
    // });

    // Test de l'ajout d'un customer avec nom existant
    // it('/customers - nom existant (POST)', () => {
    //     return request(app.getHttpServer())
    //         .post('/customers')
    //         .set('Authorization', utils.authorizationJWT)
    //         .send(createExistingCustomerKey)
    //         .expect(400);
    // });

    // Test de l'ajout d'un customer avec nom non renseigne
    // it('/customers - nom non renseigne (POST)', () => {
    //     return request(app.getHttpServer())
    //         .post('/customers')
    //         .set('Authorization', utils.authorizationJWT)
    //         .send(createWrongCustomer)
    //         .set('Content-Type', 'application/json')
    //         .expect(400);
    // });

    // Test de l'ajout d'un customer avec nom vide
    // it('/customers - nom vide (POST)', () => {
    //     return request(app.getHttpServer())
    //         .post('/customers')
    //         .set('Authorization', utils.authorizationJWT)
    //         .send(createEmptyCustomerKey)
    //         .set('Content-Type', 'application/json')
    //         .expect(400);
    // });

    // Test de la modification d'un customer existant
    it('/customers (PUT)', () => {
        return request(app.getHttpServer())
            .put('/customers')
            .set('Authorization', utils.authorizationJWT)
            .send(modifyCustomer)
            .expect(200)
            .then(response => {
                const customer: object = utils.clearDates(response.body);
                expect(customer).toEqual(modifyCustomer);
            });
    });

    // Test de la modification d'un customer non existant
    it('/customers (PUT) customerKey non valide', () => {
        return request(app.getHttpServer())
            .put('/customers')
            .set('Authorization', utils.authorizationJWT)
            .send(modifyCustomerWrongCustomerKey)
            .set('Content-Type', 'application/json')
            .expect(400);
    });

    it('/customers (PUT) uuid non valide', () => {
        return request(app.getHttpServer())
            .put('/customers')
            .set('Authorization', utils.authorizationJWT)
            .send(modifyCustomerWrongUuid)
            .set('Content-Type', 'application/json')
            .expect(400);
    });

    // Test de la suppression d'un customer
    // it('/customers (DELETE)', () => {
    //     return request(app.getHttpServer())
    //         .delete('/customers')
    //         .set('Authorization', utils.authorizationJWT)
    //         .send({ uuid: customer2.uuid })
    //         .expect(200);
    // });

    // Test si la suppression est bien effectuée
    // it('/customers/uuid (GET)', () => {
    //     return request(app.getHttpServer())
    //         .get('/customers/' + customer2.uuid)
    //         .set('Authorization', utils.authorizationJWT)
    //         .expect(200)
    //         .then(response => {
    //             const customer: object = response.body;
    //             expect(customer).toEqual({});
    //         });
    // });
});