import { INestApplication } from '@nestjs/common';
import { IdentityRequest, SmartModel } from '../../interfaces';
import { SmartModelsHead } from '../../providers';
import { TestUtils } from '../utils';
import {
    createsmartModel, findSmartModel, patchPull, patchPush, patchRemove, patchSet, patchSetError,
    patchSetNoRespectModel, recursiveModel, smartModel1, smartModelPermR, smartModulePatched
} from '../fixtures/smartmodels';
import * as _ from 'lodash';
import { CacheDto, PatchPropertyDto, QuerySearchDto, SmartModelDto } from '@algotech-ce/core';

declare const describe, jasmine, beforeAll, afterAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: ['sadmin'],
    customerKey: 'algotech',
};

const identityNoAdmin: IdentityRequest = {
    login: 'jford',
    groups: ['admin'],
    customerKey: 'algotech',
};

const identityError: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'any-customer',
};

describe('SmartModelsHead', () => {
    let smartModelsHead: SmartModelsHead;
    const utils: TestUtils = new TestUtils();
    const request = require('supertest');
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartModelsHead = app.get<SmartModelsHead>(SmartModelsHead);

        await utils.Before(app, 'smartmodels', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(smartModelsHead).toBeDefined();
    });

    it(`/FIND (all)`, (done) => {
        const data = { identity };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                expect(res).toMatchPartialArray([findSmartModel]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart models not found');
            },
        });
    });

    it(`/FIND (system)`, (done) => {
        const data = { identity, system: true };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                const smartModels: SmartModelDto[] = utils.clearDates(res);
                expect(smartModels.find((sm) => sm.key === smartModelPermR.key)).not.toBeUndefined();
                expect(smartModels).not.toEqual(jasmine.arrayContaining([smartModel1]));
                done();
            },
            error: (err) => {
                return Promise.reject('Smart models not found');
            },
        });
    });

    it('/FIND (uuid)', (done) => {
        const data = { identity, uuid: smartModel1.uuid };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                expect(res).toMatchPartialObject(smartModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model not found');
            },
        });
    });

    it('/FIND (with error - no uuid)', (done) => {
        const data = { identity, uuid: 'no-uuid' };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                return Promise.reject('Smart model found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (key)', (done) => {
        const data = { identity, key: smartModel1.key };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                expect(res).toMatchPartialObject(smartModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model key found');
            },
        });
    });

    it('/FIND (with error - no key)', (done) => {
        const data = { identity, key: 'key-not-found' };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                return Promise.reject('Smart model key found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (with submodel)', (done) => {
        const data = { identity, key: 'parent', subModel: true };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                expect(res).toMatchPartialObject(recursiveModel);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model key found');
            },
        });
    });

    it('/FIND (with submodel / recursive)', (done) => {
        const data = { identity, key: 'EQUIPMENT', submodel: true };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                expect(utils.clearDates(res) as object).toEqual(
                    jasmine.arrayContaining([
                        jasmine.objectContaining({ key: 'EQUIPMENT' }),
                        jasmine.objectContaining({ key: 'DOCUMENT' }),
                        jasmine.objectContaining({ key: 'USER' }),
                    ],
                    ),
                );
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model key found');
            },
        });
    });

    it('/FIND (by skills)', (done) => {
        const data = { identity, skills: 'atDocument' };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                expect(res).toMatchPartialArray([smartModel1]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model key found');
            },
        });
    });

    it('/FIND (by exact key)', (done) => {
        const data = { identity, key: smartModel1.key };
        smartModelsHead.findOneByExactKey(data).subscribe({
            next: (res: SmartModel) => {
                expect(res).toMatchPartialObject(smartModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model key found');
            },
        });
    });

    it('/FIND (with error - exact key)', (done) => {
        const data = { identity, key: null };
        smartModelsHead.findOneByExactKey(data).subscribe({
            next: (res: SmartModel) => {
                return Promise.reject('Smart model key found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (with error - exact service)', (done) => {
        const data = { identity: identityError, key: smartModel1.key };
        smartModelsHead.findOneByExactKey(data).subscribe({
            next: (res: SmartModel) => {
                return Promise.reject('Smart model key found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/CREATE', (done) => {
        const data = { identity, data: createsmartModel };
        smartModelsHead.create(data).subscribe({
            next: (res: SmartModel) => {
                const so = res as SmartModelDto;
                createsmartModel.uuid = so.uuid;
                expect(so).toMatchPartialObject(createsmartModel);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model key found');
            },
        });
    });

    it('/CREATE (with error - already exists)', (done) => {
        const data = { identity, data: createsmartModel };
        smartModelsHead.create(data).subscribe({
            next: (res: SmartModel) => {
                return Promise.reject('Smart model key found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/PATCH', (done) => {
        const data = {
            identity, uuid: smartModel1.uuid, patches: [
                patchSet,
                patchPush,
                patchPull,
                patchRemove,
            ]
        };
        smartModelsHead.patch(data).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject([
                    patchSet,
                    patchPush,
                    patchPull,
                    patchRemove]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model key found');
            },
        });
    });

    it('/PATCH (with error)', (done) => {
        const data = {
            identity, uuid: smartModel1.uuid, patches: [
                patchSetError,
            ]
        };
        smartModelsHead.patch(data).subscribe({
            next: (res: PatchPropertyDto[]) => {
                return Promise.reject('Smart model key found');
            },
            error: (err) => {
                done();
            },
        });

    });

    it('/PATCH (with error 2)', (done) => {
        const data = {
            identity, uuid: smartModel1.uuid, patches: [
                patchSetNoRespectModel,
            ]
        };
        smartModelsHead.patch(data).subscribe({
            next: (res: PatchPropertyDto[]) => {
                return Promise.reject('Smart model key found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (correctly modified)', (done) => {
        const data = { identity, uuid: smartModel1.uuid };
        smartModelsHead.find(data).subscribe({
            next: (res: SmartModel | SmartModel[]) => {
                const so: SmartModelDto = res as SmartModelDto;
                const properties = so.properties;
                expect(properties[0]).not.toMatchPartialObject(smartModulePatched);
                expect(properties[1]).toMatchPartialObject(smartModulePatched);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model key found');
            },
        });
    });

    it('/UPDATE', (done) => {
        const data = { identity, changes: smartModel1 as SmartModel };
        smartModelsHead.update(data).subscribe({
            next: (res: SmartModel) => {
                expect(res).toMatchPartialObject(smartModel1);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model not correctly updated');
            },
        });
    });

    it('/PERMISSIONS', (done) => {
        const query: QuerySearchDto = {
            tags: [],
            so: [],
            layers: [],
            texts: [],
            metadatas: [],
        };
        const data = { identity, query, target: '' };
        smartModelsHead.smartObjectsPermissions(data).subscribe({
            next: (res: { modelKey: string, properties: string }[]) => {
                expect(res).toMatchPartialObject([]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model permissions not correctly updated');
            },
        });
    });

    it('/PERMISSIONS (no admin)', (done) => {
        const query: QuerySearchDto = {
            tags: [],
            so: [],
            layers: [],
            texts: [],
            metadatas: [],
        };
        const data = { identity: identityNoAdmin, query, target: '' };
        smartModelsHead.smartObjectsPermissions(data).subscribe({
            next: (res: { modelKey: string, properties: string }[]) => {
                expect(res).toMatchPartialObject([]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model permissions not correctly updated');
            },
        });
    });

    it('/PERMISSIONS (with target)', (done) => {
        const query: QuerySearchDto = {
            tags: [],
            so: [],
            layers: [],
            texts: [],
            metadatas: [],
        };
        const data = { identity, query, target: 'so:EQUIPMENT' };
        smartModelsHead.smartObjectsPermissions(data).subscribe({
            next: (res: { modelKey: string, properties: string }[]) => {
                expect(res).toMatchPartialObject([]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model permissions not correctly updated');
            },
        });
    });

    it('/PERMISSIONS (with so)', (done) => {
        const query: QuerySearchDto = {
            tags: [],
            so: [
                {
                    modelKey: 'EQUIPEMENT',
                    props: [{
                        key: 'uuid',
                        value: ['a14dc702-9a0e-46ec-bc1f-5adfd3ff7e4a']
                    }],
                }
                ,
            ],
            layers: [],
            texts: [],
            metadatas: [],
        };
        const data = { identity, query, target: '' };
        smartModelsHead.smartObjectsPermissions(data).subscribe({
            next: (res: { modelKey: string, properties: string }[]) => {
                expect(res).toMatchPartialObject([]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model permissions not correctly updated');
            },
        });
    });


    it('/DELETE', (done) => {
        const data = { identity, data: createsmartModel.uuid };
        smartModelsHead.delete(data).subscribe({
            next: (res: boolean) => {
                done();
            },
            error: (err) => {
                return Promise.reject('Smart model uuid not found');
            },
        });
    });

    it('/DELETE (with error)', (done) => {
        const data = { identity: identityError, data: createsmartModel.uuid };
        smartModelsHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('Smart model uuid not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/DELETE (with error - no uuid)', (done) => {
        const data = { identity, data: createsmartModel.uuid };
        smartModelsHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('Smart model key found');
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
        smartModelsHead.cache(data).subscribe({
            next: (res: CacheDto) => {
                expect(res).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({ uuid: smartModel1.uuid }),
                    ]),
                    deleted: [
                        createsmartModel.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Smart models cache not found');
            },
        });
    });
});
