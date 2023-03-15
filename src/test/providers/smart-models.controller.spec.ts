import { SmartModelsController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { createsmartModel, patchPull, patchSet,
    smartModel1 } from '../fixtures/smartmodels';
import { CacheDto, DeleteDto, PatchPropertyDto, SmartModelDto } from '@algotech/core';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('SmartModelsController', () => {

    let smartModelsController: SmartModelsController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartModelsController = app.get<SmartModelsController>(SmartModelsController);

        await utils.Before(app, 'smartmodels', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(smartModelsController).toBeDefined();
    });

    it('/FIND (uuid)', (done) => {
        smartModelsController.find(identity, smartModel1.uuid).subscribe({
            next: (res: {} | SmartModelDto) => {
                expect(res).toMatchPartialObject(smartModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Model by uuid not found');
            },
        });
    });

    it('/FIND (key)', (done) => {
        smartModelsController.findByKey(identity, smartModel1.key).subscribe({
            next: (res: {} | SmartModelDto) => {
                expect(res).toMatchPartialObject(smartModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Model by key not found');
            },
        });
    });

    it('/FIND (all)', (done) => {
        smartModelsController.findAll(identity, true, '').subscribe({
            next: (res: SmartModelDto[]) => {
                expect(res).not.toMatchPartialObject([smartModel1]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Models not found');
            },
        });
    });

    it('/CREATE', (done) => {
        smartModelsController.create(identity, createsmartModel).subscribe({
            next: (res: SmartModelDto) => {
                createsmartModel.uuid = res.uuid;
                expect(res).toMatchPartialObject(createsmartModel);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Models not created');
            },
        });
    });

    it('/PATCH', (done) => {
        const patches: PatchPropertyDto[] = [
            patchSet,
            patchPull,
        ];
        smartModelsController.patchProperty(identity, createsmartModel.uuid, patches).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject([patchSet, patchPull]);
                done();
            },
            error: (err) => {
                return Promise.reject('Patch Smart Models not found');
            },
        });
    });

    it('/UPDATE', (done) => {
        smartModelsController.update(identity, createsmartModel).subscribe({
            next: (res: SmartModelDto) => {
                expect(res).toMatchPartialObject(createsmartModel);
                done();
            },
            error: (err) => {
                return Promise.reject('Patch Smart Models not found');
            },
        });
    });

    it('/DELETE', (done) => {
        const data: DeleteDto = {
            uuid: createsmartModel.uuid,
        };
        smartModelsController.deleteSM(identity, data).subscribe({
            next: (res: boolean) => {
                done();
            },
            error: (err) => {
                return Promise.reject('Patch Smart Models not found');
            },
        });
    });

    it('/CACHE', (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        smartModelsController.cache(identity, d.toISOString() ).subscribe({
            next: (res: CacheDto) => {
                expect(res).toEqual({
                    updated: [],
                    deleted: [
                        createsmartModel.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Cache Smart Models not found');
            },
        });
    });

});