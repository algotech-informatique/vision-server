import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import * as path from 'path';
import { ProcessMonitoringSearchDto } from '@algotech/core';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe('I18nController (e2e)', () => {
    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll((done) => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, ['customers', 'snmodels', 'tags', 'genericlists', 'settings', 'monitoring'], request).then(() => {
                done();
            });
        });
    });

    // Finalisation
    afterAll((done) => {
        return Promise.all([
            utils.After('customers'),
            utils.After('snmodels'),
            utils.After('tags'),
            utils.After('genericlists'),
            utils.After('settings'),
            utils.After('monitoring'),
        ]).then(() => {
            done();
        });
    });

    // import test error files
    it('/POST i18n/import (error)', () => {
        return request(app.getHttpServer())
            .post('/i18n/import')
            .set('Authorization', utils.authorizationJWT)
            .attach('file', path.join(__dirname, '../files/i18n-error.csv'))
            .expect(400);
    });

    // import test no data
    it('/POST i18n/import (no data)', () => {
        return request(app.getHttpServer())
            .post('/i18n/import')
            .set('Authorization', utils.authorizationJWT)
            .attach('file', path.join(__dirname, '../files/i18n-no-data.csv'))
            .expect(201)
            .then(response => {
                expect(response.text).toEqual('false');
            });
    });

    // import test update lang + unknows rows + ignore rows
    it('/POST i18n/import (update)', () => {
        return request(app.getHttpServer())
            .post('/i18n/import')
            .set('Authorization', utils.authorizationJWT)
            .attach('file', path.join(__dirname, '../files/i18n-update.csv'))
            .expect(201)
            .then(response => {
                expect(response.text).toEqual('true');
            });
    });

    it('/POST monitoring check update', () => {
        const processSearch: ProcessMonitoringSearchDto = {
            byProcessState: 'succeeded'
        }
        return timer(500).pipe(
            mergeMap(() => request(app.getHttpServer())
                .post('/monitoring/import/i18n')
                .set('Authorization', utils.sadminauthorizationJWT)
                .send(processSearch)
                .expect(201)
                .then((response) => {
                    expect(response.body[0].result).toEqual({
                        ignoreRows: 7,
                        unknownRows: 2,
                        updatedRows: 2,
                    })
                })
            )
        ).toPromise();
    });

    it('/GET smartnodes check update', () => {
        return request(app.getHttpServer())
            .get('/smartnodes/bfd4aaff-e4d0-c7ff-70b5-d1fb8b4c1a00')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const snModel: any = response.body;
                expect(snModel.displayName).toEqual(jasmine.arrayContaining([{
                    lang: 'en-US',
                    value: 'UPDATE'
                }]));
            });
    });

    // import test add new lang (check customer + progress)
    it('/POST i18n/import (add new lang)', () => {
        return request(app.getHttpServer())
            .post('/i18n/import')
            .set('Authorization', utils.authorizationJWT)
            .attach('file', path.join(__dirname, '../files/i18n-new-lang.csv'))
            .expect(201)
            .then(response => {
                expect(response.text).toEqual('true');
            });
    });

    it('/POST monitoring check update', () => {
        const processSearch: ProcessMonitoringSearchDto = {
            byProcessState: 'succeeded'
        }
        return timer(500).pipe(
            mergeMap(() => request(app.getHttpServer())
                .post('/monitoring/import/i18n')
                .set('Authorization', utils.sadminauthorizationJWT)
                .send(processSearch)
                .expect(201)
                .then((response) => {
                    expect(response.body[0].result).toEqual({
                        ignoreRows: 0,
                        unknownRows: 0,
                        updatedRows: 11,
                    })
                })
            )
        ).toPromise();
    });

    it('/GET customers check update', () => {
        return request(app.getHttpServer())
            .get('/customers/self')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const customer: any = response.body;
                expect(customer.languages).toEqual(jasmine.arrayContaining([{
                    lang: 'da-DK',
                    value: 'Danish'
                }]));
            });
    });

    it('/GET smartnodes check update', () => {
        return request(app.getHttpServer())
            .get('/smartnodes/bfd4aaff-e4d0-c7ff-70b5-d1fb8b4c1a00')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const snModel: any = response.body;
                expect(snModel.displayName).toEqual(jasmine.arrayContaining([{
                    lang: 'da-DK',
                    value: 'New Lang'
                }]));
            });
    });

    // export
    it('/POST i18n/export', () => {
        return request(app.getHttpServer())
            .get('/i18n/export')
            .set('Authorization', utils.authorizationJWT)
            .expect(200);
    });
});