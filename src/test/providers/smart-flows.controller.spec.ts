import { SmartFlowsController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { CacheDto, PatchPropertyDto, WorkflowModelDto } from '@algotech/core';
import { createFlowsModel, flowsModel1, flowsModel2,
    flowsModel3, patchPull, patchPush, patchRemove, patchSet } from '../fixtures/smartflowmodels';

declare const jasmine, describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('SmartFlowsController', () => {
    let smartFlowsController: SmartFlowsController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartFlowsController = app.get<SmartFlowsController>(SmartFlowsController);

        await utils.Before(app, ['smartflowmodels', 'smartobjects'], request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(smartFlowsController).toBeDefined();
    });

    it ('/FINDALL', (done) => {
        const data = { identity };
        smartFlowsController.findAll(identity).subscribe({
            next: (res: WorkflowModelDto[]) => {
                expect(res).toMatchPartialArray([flowsModel1, flowsModel2, flowsModel3]);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlows list not found');
            },
        });
    });

    it ('/FINDONE (uuid)', (done) => {
        smartFlowsController.findOne(identity, flowsModel1.uuid).subscribe({
            next: (res: WorkflowModelDto) => {
                expect(res).toMatchPartialObject(flowsModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlow not found');
            },
        });
    });

    it ('/FINDKEY', (done) => {
        smartFlowsController.findByKey(identity, flowsModel1.key).subscribe({
            next: (res: WorkflowModelDto) => {
                expect(res).toMatchPartialObject(flowsModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlow not found');
            },
        });
    });

    it ('/FINDVIEW', (done) => {
        smartFlowsController.findByView(identity, flowsModel1.snModelUuid).subscribe({
            next: (res: WorkflowModelDto) => {
                expect(res).toMatchPartialObject(flowsModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlow not found');
            },
        });
    });

   /*  it ('/STARTSMARTFLOW', (done) => {
        const launchOptions: WorkflowLaunchOptionsDto = {
            key: 'test-e2e-smartflow',
            fromScheduler: false,
            readonly: false,
            toData: false,
        };
        const data = { identity, launchOptions };
        const objRes = null
        smartFlowsController.startSmartFlow(identity, launchOptions, objRes);
        
        if (!objRes) {
            return Promise.reject('No correctly started Smart flows');
        } else {
            createSmartObject.uuid = objRes.uuid;
            expect(objRes).toMatchPartialObject(createSmartObject);
            done();
        }
    });
 */
    /* it ('/STARTSMARTFLOW (with inputs)', (done) => {

        const launchOptions: WorkflowLaunchOptionsDto = {
            key: 'test-e2e-toData',
            fromScheduler: false,
            inputs: [
                {
                    key: 'page',
                    value: '0',
                },
                {
                    key: 'limit',
                    value: '2',
                },
            ],
            readonly: false,
            toData: true,
        };
        const data = { identity, launchOptions };
        const objRes = null
        smartFlowsController.startSmartFlow(identity, launchOptions, objRes);
        if (objRes) {
            const data = objRes.data.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
            expect(data).toBeTruthy();
            expect(objRes.smartobjects.length).toEqual(2);
            expect(objRes.type).toEqual('so:parent');
            done();
        } else {
            return Promise.reject('No correctly started Smart flows');
        }        
    }); */

    it ('/CREATE', (done) => {
        smartFlowsController.create(identity, createFlowsModel).subscribe({
            next: (res: WorkflowModelDto) => {
                createFlowsModel.uuid = res.uuid;
                expect(res).toMatchPartialObject(createFlowsModel);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlow not created');
            },
        });
    });

    it ('/PATCH', (done) => {
        const patches: PatchPropertyDto[] = [
            patchSet,
            patchPush,
            patchPull,
            patchRemove,
        ];
        smartFlowsController.patchProperty(identity, flowsModel1.uuid, patches).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject([patchSet, patchPush, patchPull, patchRemove]);
                done();
            },
            error: (err) => {
                return Promise.reject('No correctly patched Smart flows');
            },

        });
    });

    it ('/PUBLISH', (done) => {
        smartFlowsController.publish(identity, createFlowsModel).subscribe({
            next: (res: WorkflowModelDto) => {
                expect(res).toMatchPartialObject(createFlowsModel);
                done();
            },
            error: (err) => {
                return Promise.reject('Flowmodel not created');
            },

        });
    });

    it ('/DELETE', (done) => {
        smartFlowsController.delete(identity, {uuid: createFlowsModel.uuid}).subscribe({
            next: (res: boolean ) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlow not created');
            },
        });
    });

    it(`CACHE`, (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        smartFlowsController.cache(identity, d.toISOString() ).subscribe({
            next: (res: CacheDto) => {
                expect(res).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({uuid: flowsModel1.uuid}),
                    ]),
                    deleted: [
                        createFlowsModel.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Smart flows cache not found');
            },
        });
    });
});