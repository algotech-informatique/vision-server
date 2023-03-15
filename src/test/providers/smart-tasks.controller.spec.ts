import { SmartTasksController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { SmartTaskDto, SmartTaskLogDto } from '@algotech/core';
import { smartTask1, updateSmartTask1 } from '../fixtures/smarttasks';

declare const jasmine, describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('SmartTaskssController', () => {
    let smartTasksController: SmartTasksController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartTasksController = app.get<SmartTasksController>(SmartTasksController);

        await utils.Before(app, 'agendaJobs', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(smartTasksController).toBeDefined();
    });

    it ('/CREATE', (done) => {
        smartTasksController.create(identity, smartTask1).subscribe({
            next: (res: SmartTaskDto) => {
                smartTask1.uuid = res.uuid;
                expect(res).toMatchPartialObject(smartTask1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not created');
            },
        });
    });

    it ('/FIND (by uuid)', (done) => {
        smartTasksController.findByUuid(identity, smartTask1.uuid).subscribe({
            next: (res: SmartTaskDto) => {
                expect(res).toMatchPartialObject(smartTask1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not found');
            },
        });
    });

    it ('/FINDALL (skip / limit / enabled: null)', (done) => {
        smartTasksController.findAll(identity, 0, 1).subscribe({
            next: (res: SmartTaskDto[]) => {
                expect(res).toMatchPartialObject([smartTask1]);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not found');
            },
        });
    });

    it ('/UPDATE', (done) => {
        smartTasksController.update(identity, updateSmartTask1.uuid, updateSmartTask1).subscribe({
            next: (res: SmartTaskDto) => {
                expect(res).toMatchPartialObject(updateSmartTask1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not found');
            },
        });
    });

    it ('/SETSTATE (true)', (done) => {
        smartTasksController.setState(identity, smartTask1.uuid, true).subscribe({
            next: (res: { acknowledged: boolean }) => {
                expect(res.acknowledged).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not deleted');
            },
        });
    });

    it ('/FINDLOGS', (done) => {
        const data = { identity, uuid: smartTask1.uuid };
        smartTasksController.findLogsForSmartTask(identity, smartTask1.uuid).subscribe({
            next: (res: SmartTaskLogDto[]) => {
                expect(res.length).toBe(0);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not deleted');
            },
        });
    });

    it ('/DELETE', (done) => {
        const data = { identity, uuid: smartTask1.uuid };
        smartTasksController.delete(identity, smartTask1.uuid).subscribe({
            next: (res: { acknowledged: boolean }) => {
                expect(res.acknowledged).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not deleted');
            },
        });
    });
});