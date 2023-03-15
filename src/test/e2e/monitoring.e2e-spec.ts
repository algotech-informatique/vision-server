import { ProcessMonitoringSearchDto } from '@algotech/core';
import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { importDoccanceled, importDocsucceeded, importSosError, importSossucceeded, indexationDocsucceeded, indexationSossucceeded } from '../fixtures/monitoring';
import { TestUtils } from '../utils';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe('monitoring', () => {

  const request = require('supertest');
  let app: INestApplication;
  const utils: TestUtils = new TestUtils();

  // Initialisation
  beforeAll((done) => {
    return utils.InitializeApp().then((nestApp) => {
      app = nestApp;
      return utils.Before(app, 'monitoring', request).then(() => {
        done();
      });
    });
  });

  // Finalisation
  afterAll((done) => {
    return utils.After('monitoring').then(() => {
      done();
    });
  });


  // all inProgess process must bu calceled at server start
  it('/POST all monitoring inProgess (POST)', () => {
    const processSearch: ProcessMonitoringSearchDto = {
      byProcessState: 'inProgress',
    }
    return request(app.getHttpServer())
      .post('/monitoring')
      .set('Authorization', utils.sadminauthorizationJWT)
      .send(processSearch)
      .expect(201)
      .then((response) => {
        expect(utils.clearDates(response.body)).toEqual([]);
      });
  });

  // all error process must bu calceled at server start
  it('/POST all monitoring error (POST)', () => {
    const processSearch: ProcessMonitoringSearchDto = {
      byProcessState: 'error',
    }
    return request(app.getHttpServer())
      .post('/monitoring')
      .set('Authorization', utils.sadminauthorizationJWT)
      .send(processSearch)
      .expect(201)
      .then((response) => {
        expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining([importSosError]));
      });
  });

  // all canceled process must bu calceled at server start
  it('/POST monitoring canceled (POST)', () => {
    const processSearch: ProcessMonitoringSearchDto = {
      byProcessState: 'canceled',
    }
    return request(app.getHttpServer())
      .post('/monitoring')
      .set('Authorization', utils.sadminauthorizationJWT)
      .send(processSearch)
      .expect(201)
      .then((response) => {
        expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([importDoccanceled]));
      });
  });

  // all succeeded process must bu calceled at server start
  it('/POST monitoring succeeded (POST)', () => {
    const processSearch: ProcessMonitoringSearchDto = {
      byProcessState: 'succeeded',
    }
    return request(app.getHttpServer())
      .post('/monitoring')
      .set('Authorization', utils.sadminauthorizationJWT)
      .send(processSearch)
      .expect(201)
      .then((response) => {
        expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([importDocsucceeded, indexationDocsucceeded]));
      });
  });

  it('/POST monitoring by uuids (POST)', () => {
    const processSearch: ProcessMonitoringSearchDto = {
      byUuids: [
        'd7192560-1f8c-4120-8a3d-d00ac92cca06',
        'd7192560-1f8c-4120-8a3d-d00ac92cca07',
        'd7192560-1f8c-4120-8a3d-d00ac92cca08'
      ],
    }
    return request(app.getHttpServer())
      .post('/monitoring')
      .set('Authorization', utils.sadminauthorizationJWT)
      .send(processSearch)
      .expect(201)
      .then((response) => {
        expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([
          importSossucceeded,
          importSosError,
          importDoccanceled]));
      });
  });

  it('/POST monitoring import/so by uuids (POST)', () => {
    const processSearch: ProcessMonitoringSearchDto = {
      byUuids: [
        'd7192560-1f8c-4120-8a3d-d00ac92cca06',
        'd7192560-1f8c-4120-8a3d-d00ac92cca07',
        'd7192560-1f8c-4120-8a3d-d00ac92cca08'
      ],
    }
    return request(app.getHttpServer())
      .post('/monitoring/import/so')
      .set('Authorization', utils.sadminauthorizationJWT)
      .send(processSearch)
      .expect(201)
      .then((response) => {
        expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([
          importSossucceeded,
          importSosError]));
      });
  });

   it('/POST monitoring import/doc by uuids (POST)', () => {
    const processSearch: ProcessMonitoringSearchDto = {
      byProcessState: 'canceled'
    }
    return request(app.getHttpServer())
      .post('/monitoring/import/doc')
      .set('Authorization', utils.sadminauthorizationJWT)
      .send(processSearch)
      .expect(201)
      .then((response) => {
        expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([
          importDoccanceled]));
      });
  });

/*   it('/POST monitoring indexation/so (POST)', () => {
    const processSearch: ProcessMonitoringSearchDto = {}
    return request(app.getHttpServer())
      .post('/monitoring/indexation/so')
      .set('Authorization', utils.sadminauthorizationJWT)
      .send(processSearch)
      .expect(201)
      .then((response) => {
        expect(utils.clearDates(response.body)).toEqual([indexationSossucceeded]);
      });
  }); */

  // all succeeded process must bu calceled at server start
  it('/POST monitoring succeeded (POST)', () => {
    const processSearch: ProcessMonitoringSearchDto = {
      byProcessState: 'succeeded',
    }
    return request(app.getHttpServer())
      .post('/monitoring/indexation/doc')
      .set('Authorization', utils.sadminauthorizationJWT)
      .send(processSearch)
      .expect(201)
      .then((response) => {
        expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([indexationDocsucceeded]));
      });
  });
});