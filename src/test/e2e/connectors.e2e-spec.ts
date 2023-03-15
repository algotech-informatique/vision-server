import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import * as fs from 'fs';
import * as path from 'path';
declare const describe, beforeAll, afterAll, it: any;

describe('ConnectorsController (e2e)', () => {
    const request = require('supertest');
    let app: INestApplication;

    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, 'smartflowmodels', request);
        });
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test de la recuperation de tous les groupes
    /*it('(POST) /connectors/test-route with authorization without parmeters', () => {
      return request(app.getHttpServer())
        .post('/connectors/test-route/')
        .set('Authorization', utils.authorizationJWT)
        .expect(400);
    });
  
    it('(POST) /connectors/test-route without authorization', () => {
      return request(app.getHttpServer())
        .get('/connectors/test-route/')
        .expect(401);
    });*/

    it('(POST) /connectors/test-route with authorization and good parmeters', () => {
        return request(app.getHttpServer())
            .post('/connectors/test-route/test/')
            .set('authorization', utils.authorizationJWT)
            .set('header1', 'tata')
            .field('formData1', 'abcd')
            .attach('formData2', path.join(__dirname, '../files/giphy.gif'))
            .query({
                string: 'toto',
                number: 1,
                boolean: false,
                date: '1212/12/12'
            }).expect(200);
    });

    it('(GET) /connectors/service500 should return 500', () => {
        return request(app.getHttpServer())
            .get('/connectors/service500')
            .set('authorization', utils.authorizationJWT)
            .expect(500);
    });

    it('(POST) /connectors/service400 should return 400', () => {
        return request(app.getHttpServer())
            .post('/connectors/service400')
            .set('authorization', utils.authorizationJWT)
            .expect(400);
    });

    it('(POST) /connectors/dynamicStatus should return 202', () => {
        return request(app.getHttpServer())
            .post('/connectors/dynamicStatus')
            .set('authorization', utils.authorizationJWT)
            .send({
                error: 202
            })
            .expect(202)
            .then(response => {
                expect(response.body).toEqual({ success: true });
            });
    });

    it('(POST) /connectors/dynamicStatus should return 403', () => {
        return request(app.getHttpServer())
            .post('/connectors/dynamicStatus')
            .set('authorization', utils.authorizationJWT)
            .send({
                error: 403
            })
            .expect(403)
            .then(response => {
                expect(response.body).toEqual('an error occured');
            });
    });

    it('(POST) /connectors/dynamicStatus should return 500', () => {
        return request(app.getHttpServer())
            .post('/connectors/dynamicStatus')
            .set('authorization', utils.authorizationJWT)
            .send({
                error: 500
            })
            .expect(500);
    });

    it('(PUT) /connectors/dynamicStatusRoot should return 200', () => {
        return request(app.getHttpServer())
            .put('/connectors/dynamicStatusRoot')
            .set('authorization', utils.authorizationJWT)
            .send({
                error: 200
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    success: true,
                    value: {
                        success: true
                    }
                });
            });
    });

    it('(PUT) /connectors/dynamicStatusRoot should return 400', () => {
        return request(app.getHttpServer())
            .put('/connectors/dynamicStatusRoot')
            .set('authorization', utils.authorizationJWT)
            .send({
                error: 400
            })
            .expect(400)
            .then(response => {
                expect(response.body).toEqual({
                    success: false,
                    status: 400,
                    error: 'an error occured',
                });
            });
    });

    it('(PUT) /connectors/dynamicStatusRoot should return 500', () => {
        return request(app.getHttpServer())
            .put('/connectors/dynamicStatusRoot')
            .set('authorization', utils.authorizationJWT)
            .send({
                error: 500
            })
            .expect(500);
    });

    it('(GET) /connectors/smartFlow500 should return 500', () => {
        return request(app.getHttpServer())
            .get('/connectors/smartFlow500')
            .set('authorization', utils.authorizationJWT)
            .expect(500);
    });

    /*it('(PUT) /connectors/test-route with authorization and good parmeters', () => {
      return request(app.getHttpServer())
        .put('/connectors/test-route/test/')
        .set('Authorization', utils.authorizationJWT)
        .set('header1', 'tata')
        .send({
          string: 'toto',
          Segment1: 'tata',
        }).expect(200);
    });
  
    it('(PATCH) /connectors/test-route with authorization and good parmeters', () => {
      return request(app.getHttpServer())
        .patch('/connectors/test-route/test/')
        .set('Authorization', utils.authorizationJWT)
        .set('header1', 'tata')
        .query({
          string: 'toto',
          number: 1,
          boolean: false,
          date: '1212/12/12'
        }).expect(200);
    });
  
    it('(GET) /connectors/test-route (is webhook) with authorization JWT and good parmeters', () => {
      return request(app.getHttpServer())
        .get('/connectors/test-route/test/')
        .set('Authorization', utils.authorizationJWT)
        .set('header1', 'tata')
        .query({
          string: 'toto',
          number: 1,
          boolean: false,
          date: '1212/12/12'
        }).expect(401);
    });
  
    it('(GET) /connectors/test-route (is webhook) with right token and good parmeters', () => {
      return request(app.getHttpServer())
        .get('/connectors/test-route/test/')
        .set('Webhook-Header', 'webhook-token')
        .set('header1', 'tata')
        .query({
          string: 'toto',
          number: 1,
          boolean: false,
          date: '1212/12/12'
        }).expect(200);
    });
  
    it('(DELETE) /connectors/test-route with authorization and good parmeters', () => {
      return request(app.getHttpServer())
        .delete('/connectors/test-route/test/')
        .set('Authorization', utils.authorizationJWT)
        .set('header1', 'tata')
        .query({
          string: 'toto',
          number: 1,
          boolean: false,
          date: '1212/12/12'
        }).expect(200);
    });*/

});
