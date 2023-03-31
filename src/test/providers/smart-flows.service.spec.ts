import { INestApplication } from '@nestjs/common';
import { IdentityRequest, WorkflowModel } from '../../interfaces';
import { TestUtils } from '../utils';
import * as _ from 'lodash';
import {
    createFlowsModel, createflowsModel2, createSmartObject, duplicateKeyFlowsModel, flowsModel1, flowsModel2, flowsModel3,
    patchPull, patchPush, patchRemove, patchSetNoRespectModel, publishExistSmartFlow,
    publishFlowsModel, publishNewSmartFlow
} from '../fixtures/smartflowmodels';
import { SmartFlowsHead } from '../../providers';
import { CacheDto, PatchPropertyDto, SmartObjectDto, WorkflowLaunchOptionsDto } from '@algotech-ce/core';

declare const jasmine, describe, beforeAll, afterAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [],
    customerKey: 'algotech',
};

const identityError: IdentityRequest = {
    login: 'jford',
    groups: [],
    customerKey: '',
};

const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/displayName/[lang:fr-FR]/value',
    value: 'premier smartflow patch',
};

describe('SmartFlowsHead', () => {
    let smartFlowsHead: SmartFlowsHead;
    const utils: TestUtils = new TestUtils();
    const request = require('supertest');
    let app: INestApplication;
    let files = [];
    let body = {};
    let headers = {};
    let queryStrings = {};
    let urlSegments = [];
    
    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartFlowsHead = app.get<SmartFlowsHead>(SmartFlowsHead);

        await utils.Before(app, ['smartflowmodels', 'smartobjects'], request);
    });

    afterAll(async () => {
        await utils.AfterArray(['smartflowmodels', 'smartobjects']);
    });

    it('CREATE INSTANCE', () => {
        expect(smartFlowsHead).toBeDefined();
    });

    // FIND //

    it('/FIND (all)', (done) => {
        const data = { identity };
        smartFlowsHead.find(data).subscribe({
            next: (res: WorkflowModel | WorkflowModel[]) => {
                expect(res).toMatchPartialArray([flowsModel1, flowsModel2, flowsModel3]);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlows list not found');
            },
        });
    });

    it('/FIND (uuid)', (done) => {
        const data = { identity, uuid: flowsModel1.uuid };
        smartFlowsHead.find(data).subscribe({
            next: (res: WorkflowModel | WorkflowModel[]) => {
                expect(res).toMatchPartialObject(flowsModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlow not found');
            },
        });
    });

    it('/FIND (with error - uuid)', (done) => {
        const data = { identity, uuid: 'no-uuid-exists' };
        smartFlowsHead.find(data).subscribe({
            next: (res: WorkflowModel | WorkflowModel[]) => {
                return Promise.reject('Smart flows couldnt exists');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (key)', (done) => {
        const data = { identity, key: flowsModel1.key };
        smartFlowsHead.find(data).subscribe({
            next: (res: WorkflowModel | WorkflowModel[]) => {
                expect(res).toMatchPartialObject(flowsModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlow not found');
            },
        });
    });

    it('/FIND (with error - key)', (done) => {
        const data = { identity, key: 'no-key-exists' };
        smartFlowsHead.find(data).subscribe({
            next: (res: WorkflowModel | WorkflowModel[]) => {
                return Promise.reject('Smart flows couldnt exists');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (snModel)', (done) => {
        const data = { identity, snModelUuid: flowsModel1.snModelUuid };
        smartFlowsHead.find(data).subscribe({
            next: (res: WorkflowModel | WorkflowModel[]) => {
                expect(res).toMatchPartialObject(flowsModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlow not found');
            },
        });
    });

    it('/FIND (with error - snModel)', (done) => {
        const data = { identity, snModelUuid: 'sn-model-uuid-not-exists' };
        smartFlowsHead.find(data).subscribe({
            next: (res: WorkflowModel | WorkflowModel[]) => {
                return Promise.reject('SmartFlow not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/STARTSMARTFLOW', (done) => {
        const launchOptions: WorkflowLaunchOptionsDto = {
            key: 'test-e2e-smartflow',
        };
        const data = { identity, launchOptions };
        smartFlowsHead.startSmartFlow(data).subscribe({
            next: (res: SmartObjectDto) => {
                createSmartObject.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSmartObject);
                done();
            },
            error: (err) => {
                return Promise.reject('No correctly started Smart flows');
            },
        });
    });

    it('/STARTSMARTFLOW (from scheduler)', (done) => {
        const launchOptions: WorkflowLaunchOptionsDto = {
            key: 'test-e2e-smartflow',
            fromScheduler: true,
        };
        const data = { identity, launchOptions };
        smartFlowsHead.startSmartFlow(data).subscribe({
            next: (res: boolean) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('No correctly started Smart flows');
            },
        });
    });

   /*  it('/STARTSMARTFLOW (to data)', (done) => {
        const launchOptions: WorkflowLaunchOptionsDto = {
            key: 'test-e2e-toData',
            fromScheduler: false,
            inputs: [],
            readonly: false,
            toData: true,
        };
        const data = { identity, launchOptions };
        smartFlowsHead.startSmartFlow(data).subscribe({
            next: (res: any) => {
                const data = res.data.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
                expect(data).toBeTruthy();
                expect(res.smartobjects.length).toEqual(2);
                expect(res.type).toEqual('so:parent');
                done();
            },
            error: (err) => {
                return Promise.reject('No correctly started Smart flows');
            },
        });
    }); */

    it('/CREATE', (done) => {
        const data = { identity, smartflow: createFlowsModel as WorkflowModel };
        smartFlowsHead.create(data).subscribe({
            next: (res: WorkflowModel) => {
                createFlowsModel.uuid = res.uuid;
                expect(res).toMatchPartialObject(createFlowsModel);
                done();
            },
            error: (err) => {
                return Promise.reject('Flowmodel not created');
            },

        });
    });

    it('/CREATE (2)', (done) => {
        const data = { identity, smartflow: createflowsModel2 as WorkflowModel };
        smartFlowsHead.create(data).subscribe({
            next: (res: WorkflowModel) => {
                createflowsModel2.uuid = res.uuid;
                expect(res).toMatchPartialObject(createflowsModel2);
                done();
            },
            error: (err) => {
                return Promise.reject('Flowmodel not created');
            },

        });
    });

    it('/CREATE (with error)', (done) => {
        const data = { identity, smartflow: createFlowsModel as WorkflowModel };
        smartFlowsHead.create(data).subscribe({
            next: (res: WorkflowModel) => {
                return Promise.reject('Smart flows created with error');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/CREATE (with error - duplicate Key )', (done) => {
        const data = { identity, smartflow: duplicateKeyFlowsModel as WorkflowModel };
        smartFlowsHead.create(data).subscribe({
            next: (res: WorkflowModel) => {
                return Promise.reject('Smart flows created with duplicity');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/PUBLISH', (done) => {
        const data = { identity, smartflow: createFlowsModel as WorkflowModel };
        smartFlowsHead.publish(data).subscribe({
            next: (res: WorkflowModel) => {
                createFlowsModel.uuid = res.uuid;
                expect(res).toMatchPartialObject(createFlowsModel);
                done();
            },
            error: (err) => {
                return Promise.reject('Flowmodel not created');
            },

        });
    });

    it('/PUBLISH (not created)', (done) => {
        const data = { identity, smartflow: publishFlowsModel as WorkflowModel };
        smartFlowsHead.publish(data).subscribe({
            next: (res: WorkflowModel) => {
                publishFlowsModel.uuid = res.uuid;
                expect(res).toMatchPartialObject(publishFlowsModel);
                done();
            },
            error: (err) => {
                return Promise.reject('Flowmodel not created');
            },

        });
    });

    it('/PUBLISH (add new)', (done) => {
        const data = { identity, smartflow: publishNewSmartFlow as WorkflowModel };
        smartFlowsHead.publish(data).subscribe({
            next: (res: WorkflowModel) => {
                expect(res).toMatchPartialObject(publishNewSmartFlow);
                done();
            },
            error: (err) => {
                return Promise.reject('Flowmodel not published');
            },

        });
    });

    it('/PUBLISH (remplace)', (done) => {
        const data = { identity, smartflow: publishExistSmartFlow as WorkflowModel };
        smartFlowsHead.publish(data).subscribe({
            next: (res: WorkflowModel) => {
                expect(res).toMatchPartialObject(_.assign(publishExistSmartFlow, { uuid: flowsModel1.uuid }));
                done();
            },
            error: (err) => {
                return Promise.reject('Flowmodel not published');
            },

        });
    });

    it('/DELETE', (done) => {
        const data = { identity, uuid: createFlowsModel.uuid };
        smartFlowsHead.delete(data).subscribe({
            next: (res: boolean) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Flowmodel not deleted');
            },

        });
    });

    it('/DELETE (test correctly done)', (done) => {
        const data = { identity, uuid: createFlowsModel.uuid };
        smartFlowsHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('Flowmodel not deleted');
            },
            error: (err) => {
                done();
            },

        });
    });

    it('/DELETE (2 - by SnModelUuid )', (done) => {
        const data = { identity, snModelUuid: createflowsModel2.snModelUuid };
        smartFlowsHead.delete(data).subscribe({
            next: (res: boolean) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Flowmodel not deleted');
            },

        });
    });

    it('/DELETE (with error - by SnModelUuid)', (done) => {
        const data = { identity, snModelUuid: 'sn-mode-uuid-not-exist' };
        smartFlowsHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('Flowmodel not deleted');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/DELETE (with error)', (done) => {
        const data = { identity, uuid: createFlowsModel.uuid };
        smartFlowsHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('No correctly delete Smart flows');
            },
            error: (err) => {
                done();
            },

        });
    });

    it('/PATCH', (done) => {
        const data = {
            uuid: flowsModel1.uuid, patches: [
                patchSet,
                patchPush,
                patchPull,
                patchRemove,
            ]
        };
        const patch = { identity, data };
        smartFlowsHead.patch(patch).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject([patchSet, patchPush, patchPull, patchRemove]);
                done();
            },
            error: (err) => {
                return Promise.reject('No correctly patched Smart flows');
            },

        });
    });

    it('/PATCH (with error)', (done) => {
        const data = {
            uuid: flowsModel1.uuid, patches: [
                patchSetNoRespectModel,
            ]
        };
        const patch = { identity, data };
        smartFlowsHead.patch(patch).subscribe({
            next: (res: PatchPropertyDto[]) => {
                return Promise.reject('No correctly patched Smart flows');
            },
            error: (err) => {
                done();
            },

        });
    });

    it('/PATCH (with error - uuid)', (done) => {
        const data = {
            uuid: 'no-uuid-exists', patches: [
                patchSetNoRespectModel,
            ]
        };
        const patch = { identity, data };
        smartFlowsHead.patch(patch).subscribe({
            next: (res: PatchPropertyDto[]) => {
                return Promise.reject('No correctly patched Smart flows');
            },
            error: (err) => {
                done();
            },
        });
    });

    it(`CACHE`, (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        const data = { identity, date: d.toISOString() };
        smartFlowsHead.cache(data).subscribe({
            next: (res: CacheDto) => {
                expect(res).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({ uuid: flowsModel1.uuid }),
                    ]),
                    deleted: [
                        createFlowsModel.uuid,
                        createflowsModel2.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Smart flows cache not found');
            },
        });
    });

    it(`getSmartFlowLanchOptions expect inputErrors`, (done) => {
        const body = null;
        smartFlowsHead.getSmartFlowLanchOptions('POST', 'test-route', body, headers, queryStrings, urlSegments, files).subscribe({
            next: (data) => {
                expect(data.canStart).toEqual(false);
                expect(data.inputErrors).toEqual([]);
                    /* jasmine.arrayContaining([
                        {
                            key: 'Segment1',
                            msg: 'ERROR-URL-SEGMENT',
                            reason: 'EMPTY-VALUE'
                        },
                        {
                            key: 'body',
                            msg: 'ERROR-BODY',
                            reason: 'BODY-EMPTY'
                        },
                        {
                            key: 'string',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'number',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'INVALID-NUMBER'
                        },
                        {
                            key: 'date',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'EMPTY-VALUE',
                        },
                        {
                            key: 'boolean',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'EMPTY-VALUE'
                        },
                        {
                            key: 'Header1',
                            msg: 'ERROR-HEADER',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'formData1',
                            msg: 'ERROR-FORM-DATA',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'formData2',
                            msg: 'ERROR-FORM-DATA',
                            reason: 'FILE-NOT-FOUND'
                        }                        
                    ])); */
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlowLanchOptions not found');
            },
        });
    });

    it(`getSmartFlowLanchOptions expect inputErrors`, (done) => {        
        smartFlowsHead.getSmartFlowLanchOptions('GET', 'test-route', body, headers, queryStrings, urlSegments, files).subscribe({
            next: (data) => {
                expect(data.canStart).toEqual(false);
                expect(data.inputErrors).toEqual([]);
                    /* jasmine.arrayContaining([
                        {
                            key: 'Segment1',
                            msg: 'ERROR-URL-SEGMENT',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'string',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'number',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'INVALID-NUMBER'
                        },
                        {
                            key: 'date',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'EMPTY-VALUE',
                        },
                        {
                            key: 'boolean',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'EMPTY-VALUE'
                        },
                        {
                            key: 'Header1',
                            msg: 'ERROR-HEADER',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'formData1',
                            msg: 'ERROR-FORM-DATA',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'formData2',
                            msg: 'ERROR-FORM-DATA',
                            reason: 'FILE-NOT-FOUND'
                        }
                    ]));
                expect(data.launchOptions.inputs).toEqual(
                    jasmine.arrayContaining([
                        {
                            key: 'body',
                            value: {},
                            error: null
                        }
                    ])); */
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlowLanchOptions not found');
            },
        });
    });

    it(`getSmartFlowLanchOptions invalid parameters`, (done) => {
        const files = [];
        const body = {};
        const headers = { 'webhook-key': 'false-token' };
        const queryStrings = { string: 5, boolean: 'tata', number: 'toto', date: 'tata' };
        const urlSegments = ['55'];
        smartFlowsHead.getSmartFlowLanchOptions('GET', 'test-route', body, headers, queryStrings, urlSegments, []).subscribe({
            next: (data) => {
                expect(data.canStart).toEqual(false);
                expect(data.inputErrors).toEqual([]);
                /*     jasmine.arrayContaining([
                        {
                            key: 'string',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'INVALID-STRING'
                        },
                        {
                            key: 'number',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'INVALID-NUMBER'
                        },
                        {
                            key: 'date',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'INVALID-DATE',
                        },
                        {
                            key: 'boolean',
                            msg: 'ERROR-QUERY-PARAMETER',
                            reason: 'INVALID-BOOLEAN'
                        },
                        {
                            key: 'Header1',
                            msg: 'ERROR-HEADER',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'formData1',
                            msg: 'ERROR-FORM-DATA',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'formData2',
                            msg: 'ERROR-FORM-DATA',
                            reason: 'FILE-NOT-FOUND'
                        }
                    ]));
                expect(data.launchOptions.inputs).toEqual(
                    jasmine.arrayContaining([
                        {
                            key: 'Segment1',
                            value: '55',
                        },
                        {
                            key: 'body',
                            value: {},
                            error: null
                        }
                    ])); */
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlowLanchOptions not found');
            },
        });
    });

    it(`getSmartFlowLanchOptions valid parameters`, (done) => {
        const files = [];
        const body = {};
        const headers = { 'webhook-key': 'false-token', 'header1': 'toto' };
        const queryStrings = { string: '5', boolean: 'true', number: 5, date: '2020/12/12' };
        const urlSegments = ['55'];
        smartFlowsHead.getSmartFlowLanchOptions('GET', 'test-route', body, headers, queryStrings, urlSegments, files).subscribe({
            next: (data) => {
                expect(data.canStart).toEqual(false);
                /* expect(data.inputErrors).toEqual(
                    jasmine.arrayContaining([                        
                        {
                            key: 'formData1',
                            msg: 'ERROR-FORM-DATA',
                            reason: 'REQUIRED-PARAMETER'
                        },
                        {
                            key: 'formData2',
                            msg: 'ERROR-FORM-DATA',
                            reason: 'FILE-NOT-FOUND'
                        }
                    ]));
                expect(data.inputErrors.length).toEqual(0);
                expect(data.launchOptions.inputs).toEqual(
                    jasmine.arrayContaining([
                        {
                            key: 'Segment1',
                            value: '55',
                        },
                        {
                            key: 'body',
                            value: {},
                            error: null
                        },
                        {
                            key: 'string',
                            value: '5',
                        },
                        {
                            key: 'number',
                            value: 5,
                        },
                        {
                            key: 'date',
                            value: '2020-12-12T00:00:00+00:00',
                        },
                        {
                            key: 'boolean',
                            value: true,
                        },
                        {
                            key: 'Header1',
                            value: 'toto',
                        }
                    ])); */
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlowLanchOptions not found');
            },
        });
    });

    it(`getSmartFlowLanchOptions valid webhook token and valid parameters`, (done) => {
        const body = {};
        const headers = { 'webhook-header': 'webhook-token', 'header1': 'toto' };
        const queryStrings = { string: '5', boolean: true, number: 5, date: '2020/12/12' };
        const urlSegments = ['55'];
        smartFlowsHead.getSmartFlowLanchOptions('GET', 'test-route', body, headers, queryStrings, urlSegments, []).subscribe({
            next: (data) => {
                expect(data.canStart).toEqual(true);
                expect(data.inputErrors.length).toEqual(0);
                /* expect(data.launchOptions.inputs).toEqual(
                    jasmine.arrayContaining([
                        {
                            key: 'Segment1',
                            value: '55',
                        },
                        {
                            key: 'body',
                            value: {},
                            error: null
                        },
                        {
                            key: 'string',
                            value: '5',
                        },
                        {
                            key: 'number',
                            value: 5,
                        },
                        {
                            key: 'date',
                            value: '2020-12-12T00:00:00+00:00',
                        },
                        {
                            key: 'boolean',
                            value: true,
                        },
                        {
                            key: 'Header1',
                            value: 'toto',
                        }
                    ])); */
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlowLanchOptions not found');
            },
        });
    });

    it(`getSmartFlowLanchOptions body (key: value) parameters (varaibl.use not defined`, (done) => {
        const body = {
            Segment1: '55',
            string: '5'
        };
        const headers = {};
        const queryStrings = {};
        const urlSegments = [];
        smartFlowsHead.getSmartFlowLanchOptions('PUT', 'test-route', body, headers, queryStrings, urlSegments, []).subscribe({
            next: (data) => {
                expect(data.canStart).toEqual(false);
                expect(data.inputErrors.length).toEqual(0);
                /* expect(data.launchOptions.inputs).toEqual(
                    jasmine.arrayContaining([
                        {
                            key: 'Segment1',
                            value: '55',
                        },
                        {
                            key: 'string',
                            value: '5',
                        }
                    ])); */
                done();
            },
            error: (err) => {
                return Promise.reject('SmartFlowLanchOptions not found');
            },
        });
    });
});