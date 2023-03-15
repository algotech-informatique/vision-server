import { IdentityRequest, SmartTask, SmartTaskLog } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { SmartTasksHead } from '../../providers';
import { disabledSmartTask, smartTask1, updateSmartTask1 } from '../fixtures/smarttasks';

declare const jasmine, describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('SmartTasksHead', () => {
    let smartTasksHead: SmartTasksHead;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartTasksHead = app.get<SmartTasksHead>(SmartTasksHead);

        await utils.Before(app, 'agendaJobs', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(smartTasksHead).toBeDefined();
    });

    it ('/CREATE', (done) => {
        const data = { identity, smartTaskDto: smartTask1 };
        smartTasksHead.create(data).subscribe({
            next: (res: SmartTask) => {
                smartTask1.uuid = res.uuid;
                expect(res).toMatchPartialObject(smartTask1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not created');
            },
        });
    });

    it ('/CREATE (disabled)', (done) => {
        const data = { identity, smartTaskDto: disabledSmartTask };
        smartTasksHead.create(data).subscribe({
            next: (res: SmartTask) => {
                disabledSmartTask.uuid = res.uuid;
                expect(res).toMatchPartialObject(disabledSmartTask);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not created');
            },
        });
    });

    it ('/FIND (by uuid)', (done) => {
        const data = { identity, uuid: smartTask1.uuid };
        smartTasksHead.findByUuid(data).subscribe({
            next: (res: SmartTask) => {
                expect(res).toMatchPartialObject(smartTask1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not found');
            },
        });
    });

    it ('/FINDALL (skip / limit / enabled: null)', (done) => {
        const data = { identity, skip: 0, limit: 1 };
        smartTasksHead.findAll(data).subscribe({
            next: (res: SmartTask[]) => {
                expect(res).toMatchPartialObject([smartTask1]);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not found');
            },
        });
    });

    it ('/FINDALL (skip / limit / enabled)', (done) => {
        const data = { identity, skip: 0, limit: 1, status: '1' };
        smartTasksHead.findAll(data).subscribe({
            next: (res: SmartTask[]) => {
                expect(res).toMatchPartialObject([smartTask1]);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not found');
            },
        });
    });

    it ('/FINDALL (skip / limit / disabled)', (done) => {
        const data = { identity, skip: 0, limit: 1, status: '0' };
        smartTasksHead.findAll(data).subscribe({
            next: (res: SmartTask[]) => {
                expect(res).toMatchPartialObject([disabledSmartTask]);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not found');
            },
        });
    });

    it ('/UPDATE', (done) => {
        const data = { identity, uuid: updateSmartTask1.uuid, updateSmartTask: updateSmartTask1 };
        smartTasksHead.update(data).subscribe({
            next: (res: SmartTask) => {
                expect(res).toMatchPartialObject(updateSmartTask1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not found');
            },
        });
    });

    it ('/UPDATE (with error)', (done) => {
        const data = { identity, uuid: 'no-uuid-exists', updateSmartTask: null };
        smartTasksHead.update(data).subscribe({
            next: (res: SmartTask) => {
                return Promise.reject('SmartTask not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/SETSTATE (true)', (done) => {
        const data = { identity, uuid: smartTask1.uuid, isEnabled: true };
        smartTasksHead.setState(data).subscribe({
            next: (res: { acknowledged: boolean }) => {
                expect(res.acknowledged).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not deleted');
            },
        });
    });

    it ('/UNLOCKANDBINDJOBS', (done) => {
        smartTasksHead.unlockAndBindJobs(identity.customerKey).subscribe({
            next: (res: boolean) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not created');
            },
        });
    });

    it ('/START', (done) => {
        const data = { identity, smartTask: smartTask1 };
        smartTasksHead.start(data).subscribe({
            next: (res: boolean ) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not deleted');
            },
        });
    });

    it ('/STOP', (done) => {
        const data = { identity, smartTask: smartTask1 };
        smartTasksHead.stop(data).subscribe({
            next: (res: boolean ) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not deleted');
            },
        });
    });

    it ('/SETSTATE (false)', (done) => {
        const data = { identity, uuid: smartTask1.uuid, isEnabled: false };
        smartTasksHead.setState(data).subscribe({
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
        smartTasksHead.findLogsForSmartTask(data).subscribe({
            next: (res: SmartTaskLog[]) => {
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
        smartTasksHead.delete(data).subscribe({
            next: (res: { acknowledged: boolean }) => {
                expect(res.acknowledged).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not deleted');
            },
        });
    });

    it ('/DELETE (disabled smartTask)', (done) => {
        const data = { identity, flowKey: disabledSmartTask.flowKey };
        smartTasksHead.deleteByFlowKey(data).subscribe({
            next: (res: { acknowledged: boolean }[]) => {
                expect(res[0].acknowledged).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartTask not deleted');
            },
        });
    });

    it ('/DELETE (with error)', (done) => {
        const data = { identity, uuid: 'no-uuid-exists' };
        smartTasksHead.delete(data).subscribe({
            next: (res: { acknowledged: boolean }) => {
                return Promise.reject('SmartTask not deleted');
            },
            error: (err) => {
                done();
            },
        });
    });
});