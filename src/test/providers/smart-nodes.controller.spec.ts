import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { createSnModel, listSnModel, modifyCreatedSnModel, snModelTest1 } from '../fixtures/smartnodes';
import { SmartNodesController } from '../../controllers';
import { CacheDto, DeleteDto, PatchPropertyDto, SnModelDto } from '@algotech/core';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('SmartNodesController', () => {

    let smartNodesController: SmartNodesController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartNodesController = app.get<SmartNodesController>(SmartNodesController);

        await utils.Before(app, 'snmodels', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(smartNodesController).toBeDefined();
    });

    it('/FIND (All)', (done) => {
        smartNodesController.findAll(identity).subscribe({
            next: (res: SnModelDto[]) => {
                expect(res).toMatchPartialArray(listSnModel);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find all');
            },
        });
    });

    it('/FIND (uuid)', (done) => {
        smartNodesController.findOne(identity, snModelTest1.uuid).subscribe({
            next: (res: SnModelDto) => {
                expect(res).toMatchPartialObject(snModelTest1);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find by uuid');
            },
        });
    });

    it('/FIND (Key)', (done) => {
        smartNodesController.findByKey(identity, snModelTest1.key).subscribe({
            next: (res: SnModelDto) => {
                expect(res).toMatchPartialObject(snModelTest1);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find by key');
            },
        });
    });

    it('/CREATE', (done) => {
        smartNodesController.create(identity, createSnModel).subscribe({
            next: (res: SnModelDto) => {
                createSnModel.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSnModel);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find by key');
            },
        });
    });

    it('/UPDATE', (done) => {
        modifyCreatedSnModel.uuid = createSnModel.uuid;
        smartNodesController.update(identity, modifyCreatedSnModel).subscribe({
            next: (res: SnModelDto) => {
                expect(res).toMatchPartialObject(modifyCreatedSnModel);
                done();
            },
            error: (err) => {
                return Promise.reject('No deleted Smart Nodes');
            },
        });
    });

    it('/PATCH', (done) => {
        const patch: PatchPropertyDto[] = [
            {
                op : 'replace',
                path : '/type/',
                value : 'workflow-1',
            },
        ];
        smartNodesController.patchProperty(identity, createSnModel.uuid, patch).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject(patch);
                done();
            },
            error: (err) => {
                return Promise.reject('No Smart Nodes patch');
            },
        });
    });

    it('/DELETE', (done) => {
        const data: DeleteDto = {
            uuid: createSnModel.uuid,
        };
        smartNodesController.delete(identity, data).subscribe({
            next: (res: boolean) => {
                expect(res).toEqual(true);
                done();
            },
            error: (err) => {
                return Promise.reject('No deleted Smart Nodes');
            },
        });
    });

    it('CACHE', (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        smartNodesController.cache(identity, d.toISOString() ).subscribe({
            next: (res: CacheDto) => {
                expect(res).toEqual({
                    updated: [],
                    deleted: [
                        createSnModel.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('No Cache Smart Nodes');
            },
        });
    });
});