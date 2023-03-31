import { INestApplication } from '@nestjs/common';
import { smartTask1, disabledSmartTask, updateSmartTask1 } from '../fixtures/smart-taks';
import { TestUtils } from '../utils';
import moment from 'moment';
import { SmartTaskDto } from '@algotech-ce/core';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe('smartTasks', () => {

    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();
    smartTask1.periodicity.dateRange.start = moment().format('YYYY-MM-DD[T]HH:mm:ss');
    disabledSmartTask.periodicity.dateRange.start = moment().format('YYYY-MM-DD[T]HH:mm:ss');
    updateSmartTask1.periodicity.dateRange.start = moment().format('YYYY-MM-DD[T]HH:mm:ss');
    let tasckCreated: SmartTaskDto;
    let disabledTasckCreated: SmartTaskDto;

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
        app = nestApp;
        return utils.Before(app, 'agendaJobs', request);});
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test la création d'un schedule
    it('/POST add smartTask1', () => {
        return request(app.getHttpServer())
            .post('/smart-tasks')
            .set('Authorization', utils.authorizationJWT)
            .send(smartTask1)
            .expect(201)
            .then((response) => {
                tasckCreated = utils.clearDates(response.body);
                tasckCreated.uuid = (smartTask1.uuid);
                expect(tasckCreated).toEqual(jasmine.objectContaining(smartTask1));
            });

    });

    // Test la création d'un schedule
    it('/POST add disabledSmartTask', () => {
        return request(app.getHttpServer())
            .post('/smart-tasks')
            .set('Authorization', utils.authorizationJWT)
            .send(disabledSmartTask)
            .expect(201)
            .then((response) => {
                disabledTasckCreated = utils.clearDates(response.body);
                disabledTasckCreated.uuid = (disabledSmartTask.uuid);
                expect(disabledTasckCreated).toEqual(jasmine.objectContaining(disabledSmartTask));
            });

    });

    it('/Get skip 0 limit 1 enabled null', () => {
        return request(app.getHttpServer())
            .get('/smart-tasks?skip=0&limit=1')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const tasks: SmartTaskDto = utils.clearDates(response.body);
                expect(tasks).toEqual(jasmine.arrayContaining([jasmine.objectContaining(smartTask1)]));
            });

    });

    it('/Get skip 0 limit 1 enabled', () => {
        return request(app.getHttpServer())
            .get('/smart-tasks?skip=0&limit=1&status=1')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const tasks: SmartTaskDto = utils.clearDates(response.body);
                expect(tasks).toEqual(jasmine.arrayContaining([jasmine.objectContaining(smartTask1)]));
            });

    });

    it('/Get skip 0 limit 1 disabled', () => {
        return request(app.getHttpServer())
            .get('/smart-tasks?skip=0&limit=1&status=0')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const tasks: SmartTaskDto = utils.clearDates(response.body);
                expect(tasks).toEqual(jasmine.arrayContaining([jasmine.objectContaining(disabledSmartTask)]));
            });

    });

    it('Update smartTask', () => {

        return request(app.getHttpServer())
            .patch(`/smart-tasks/${tasckCreated.uuid}`)
            .set('Authorization', utils.authorizationJWT)
            .send(updateSmartTask1)
            .expect(200).then((response) => {
                const tasks: SmartTaskDto = utils.clearDates(response.body);
                expect(tasks).toEqual(jasmine.objectContaining(updateSmartTask1));
            });
    });

    it('setState smartTask disabled', () => {

        return request(app.getHttpServer())
            .patch(`/smart-tasks/setState/${tasckCreated.uuid}?disable`)
            .set('Authorization', utils.authorizationJWT)
            .expect(200).then((response) => {
                expect(response.body.acknowledged).toBe(true);
            });
    });

    it('setState smartTask enabled', () => {

        return request(app.getHttpServer())
            .patch(`/smart-tasks/setState/${tasckCreated.uuid}?enable`)
            .set('Authorization', utils.authorizationJWT)
            .expect(200).then((response) => {
                expect(response.body.acknowledged).toBe(true);
            });
    });

    it('delete smartTask', () => {

        return request(app.getHttpServer())
            .delete(`/smart-tasks/${tasckCreated.uuid}`)
            .set('Authorization', utils.authorizationJWT)
            .expect(200).then((response) => {
                expect(response.body.acknowledged).toBe(true);
            });
    });

});