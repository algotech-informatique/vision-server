import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { ScheduleDto, PatchPropertyDto } from '@algotech/core';
import { scheduleSearchAllOptions } from '../fixtures/schedule-search-all-options';
import { scheduleInBase, scheduleToAdd, scheduleToAdd1 } from '../fixtures/schedulesToAdd';
import { scheduleAdded, scheduleAdded1, scheduleInBaseUpdated } from '../fixtures/schedulesAdded';
import {
    Stype, activities, receivers, workFlow, scehduletype1, beginPlannedDate2030,
    beginPlannedDate2, beginPlannedDateafter3, scheduleUuid,
} from '../fixtures/schedulesearch';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe('scheduler', () => {

    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
        app = nestApp;
        return utils.Before(app, 'schedules', request);});
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test la création d'un schedule
    it('/POST add scheduleToAdd', () => {
        return request(app.getHttpServer())
            .post('/scheduler')
            .set('Authorization', utils.authorizationJWT)
            .send(scheduleToAdd)
            .expect(201)
            .then((response) => {
                const scheduleCreated: ScheduleDto = utils.clearDates(response.body);
                scheduleUuid.uuid.push(scheduleCreated.uuid);
                expect(scheduleCreated).toEqual(jasmine.objectContaining(scheduleAdded));
            });

    });

    // Test la création d'un 2ème schedule avec une date de début '2018-10-08T0:0:00+0:00'
    it('/POST add scheduleToAdd1', () => {
        return request(app.getHttpServer())
            .post('/scheduler/')
            .set('Authorization', utils.authorizationJWT)
            .send(scheduleToAdd1)
            .expect(201)
            .then((response) => {
                const scheduleCreated: ScheduleDto = utils.clearDates(response.body);
                scheduleUuid.uuid.push(scheduleCreated.uuid);
                scheduleInBaseUpdated.uuid = scheduleCreated.uuid;
                expect(scheduleCreated).toEqual(jasmine.objectContaining(scheduleAdded1));
            },
            );
    });

    // récupération de schedules par uuid
    it('/Post(search) par uuid', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=3&order=-1&sort=beginPlannedDate')
            .set('Authorization', utils.authorizationJWT)
            .send(scheduleUuid)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        jasmine.objectContaining(scheduleAdded1),
                        jasmine.objectContaining(scheduleAdded),
                    ]));
            });
    });

    // récupération d'un schedule par date de début 2018-10-08T10:00:00
    it('/Post(search) tout options + skip 0 + limit 0 + order -1 + sort beginPlannedDate', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=3&order=-1&sort=beginPlannedDate')
            .set('Authorization', utils.authorizationJWT)
            .send(scheduleSearchAllOptions)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        jasmine.objectContaining(scheduleInBase),
                        jasmine.objectContaining(scheduleAdded1),
                        jasmine.objectContaining(scheduleAdded),
                    ]));
            });
    });

    // récupération d'un schedule par date de début 2018-10-08T10:00:00
    it('/Post(search) tout options + skip 0 + limit 0 + order -1 + sort beginPlannedDate', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=3&order=-1&sort=beginPlannedDate')
            .set('Authorization', utils.authorizationJWT)
            .send(scheduleSearchAllOptions)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        jasmine.objectContaining(scheduleInBase),
                        jasmine.objectContaining(scheduleAdded1),
                        jasmine.objectContaining(scheduleAdded),
                    ]));
            });
    });

    // récupération d'un schedule par date de début 2019-10-08T01:00:00
    it('/Post(search) beginPlannedDate=2030-10-08T00:00:00 + skip 0 + limit 1', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=1')
            .set('Authorization', utils.authorizationJWT)
            .send(beginPlannedDate2030)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual([]);
            });
    });

    // récupération d'un schedule par date de début 2019-10-08T01:00:00
    it('/Post(search) beginPlannedDate={2018-10-08T00:00:00 2018-10-08T01:00:00 }+ skip 0 + limit 1', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=2')
            .set('Authorization', utils.authorizationJWT)
            .send(beginPlannedDate2)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        jasmine.objectContaining(scheduleAdded1),
                    ]));
            });
    });

    // récupération d'un schedule par date de début 2018-10-08T00:00:00
    it('/Post(search) beginPlannedDateafter08102018 + skip 0 + limit 3 + order -1 + sort beginPlannedDate', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=3&order=-1&sort=beginPlannedDate')
            .set('Authorization', utils.authorizationJWT)
            .send(beginPlannedDateafter3)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        jasmine.objectContaining(scheduleInBase),
                        jasmine.objectContaining(scheduleAdded),
                        jasmine.objectContaining(scheduleAdded1)]));
            });
    });

    // récupération d'un schedule par type
    it('/Post(search) beginPlannedDatetype + skip 0 + limit 3 + order -1 + sort beginPlannedDate', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=3&order=-1&sort=beginPlannedDate')
            .set('Authorization', utils.authorizationJWT)
            .send(Stype)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        jasmine.objectContaining(scheduleInBase),
                        jasmine.objectContaining(scheduleAdded1)]));
            });
    });

    // récupération d'un schedule par date Date de fin
    it('/Post(search) scehduletype1 skip 0 limit 3', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=3')
            .set('Authorization', utils.authorizationJWT)
            .send(scehduletype1)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [jasmine.objectContaining(scheduleAdded)]));
            });
    });

    // récupération d'un schedule par date Date de fin
    it('/Post(search) beginPlannedWorkFlow skip 0 limit 3', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=3')
            .set('Authorization', utils.authorizationJWT)
            .send(workFlow)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        jasmine.objectContaining(scheduleInBase),
                        jasmine.objectContaining(scheduleAdded),
                        jasmine.objectContaining(scheduleAdded1)]));
            });
    });

    // récupération d'un schedule par date Date de fin
    it('/Post(search) endPlannedDate=2021-10-08T00:00:00 skip 0 limit 3', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=3')
            .set('Authorization', utils.authorizationJWT)
            .send(receivers)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        jasmine.objectContaining(scheduleInBase),
                        jasmine.objectContaining(scheduleAdded),
                        jasmine.objectContaining(scheduleAdded1)]));
            });
    });

    // récupération d'un schedule par date Date de fin
    it('/search endPlannedDate=2021-10-08T01:00:00 skip 0 limit 3', () => {
        return request(app.getHttpServer())
            .post('/scheduler/search?skip=0&limit=3')
            .set('Authorization', utils.authorizationJWT)
            .send(activities)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        jasmine.objectContaining(scheduleInBase),
                        jasmine.objectContaining(scheduleAdded),
                        jasmine.objectContaining(scheduleAdded1)]));
            });
    });

    // Test du PATCH d'un schedule
    it('/PATCH scheduleInBase ', () => {
        return request(app.getHttpServer())
            .patch('/scheduler')
            .set('Authorization', utils.authorizationJWT)
            .send(scheduleInBaseUpdated)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.objectContaining(scheduleInBaseUpdated));
            });
    });

    // Test du PATCH des property de schedule
    it('/PATCH property du schedule scheduleInBaseUpdated', () => {
        const patches: PatchPropertyDto[] = [{
            op: 'replace',
            path: '/scheduleTypeKey',
            value: 'Equipement-Type33',
        },
        {
            op: 'replace',
            path: '/receivers/0/permission',
            value: 'RW',
        }];

        return request(app.getHttpServer())
            .patch('/scheduler/' + scheduleInBaseUpdated.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send(patches)
            .expect(200);
    });

    // Tests la supppression du schedule scheduleInBaseUpdated
    it('/DELETE schedule scheduleInBaseUpdated', () => {
        return request(app.getHttpServer())
            .delete('/scheduler/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: scheduleInBaseUpdated.uuid })
            .expect(200);
    });

});