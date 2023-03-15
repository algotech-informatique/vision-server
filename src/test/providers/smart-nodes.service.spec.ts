import { INestApplication } from '@nestjs/common';
import { CustomerInit, CustomerInitResult, IdentityRequest, SnModel } from '../../interfaces';
import { TestUtils } from '../utils';
import { createSnModel, createSnModelService, duplicateNewSnModelService, listSnModel, modifyCreatedSnModel,
    modifyCreatedSnModelService,
    snModelTest1, snModelTest2 } from '../fixtures/smartnodes';
import * as _ from 'lodash';
import { SmartNodesHead } from '../../providers';
import { CacheDto, PatchPropertyDto, SnModelDto } from '@algotech/core';

declare const describe, beforeAll, afterAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

const identityError: IdentityRequest = {
    login: null,
    groups: [''],
    customerKey: '',
};

const customerInit: CustomerInit = {
    customerKey: identity.customerKey,
    name: 'jford',
    login: 'jford',
    email: 'test@test.fr',
    password: '123456',
    languages: [
        {
            lang: 'fr-FR',
            value: 'français',
        },
        {
            lang: 'en-US',
            value: 'anglais',
        },
        {
            lang: 'es-ES',
            value: 'espagnol',
        },
    ],
};

const customerInitError: CustomerInit = {
    customerKey: '',
    name: '',
    login: '',
    email: 'test@test.fr',
    password: '123456',
    languages: [
        {
            lang: 'fr-FR',
            value: 'français',
        },
    ],
};

describe('SmartNodesHead', () => {
    let smartNodesHead: SmartNodesHead;
    const utils: TestUtils = new TestUtils();
    const request = require('supertest');
    let app: INestApplication;
    let initUuid: string;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartNodesHead = app.get<SmartNodesHead>(SmartNodesHead);

        await utils.Before(app, 'snmodels', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(smartNodesHead).toBeDefined();
    });

    it('/INIT', (done) => {
        const data = { customer: customerInit };
        smartNodesHead.init(data).subscribe({
            next: (res: CustomerInitResult) => {
                expect(res.value).toMatchPartialObject('ok');
                done();
            },
            error: (err) => {
                return Promise.reject('No Init Smart Nodes');
            },
        });
    });

    it('/FIND (init by key)', (done) => {
        const data = { identity, key: 'smartmodel' };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                const sModel: SnModel = res as SnModel;
                expect(sModel.key).toMatchPartialObject('smartmodel');
                initUuid = sModel.uuid;
                done();
            },
            error: (err) => {
                return Promise.reject('No Init Smart Nodes');
            },
        });
    });

    it('/FIND (All)', (done) => {
        const data = { identity };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                expect(res).toMatchPartialArray(listSnModel);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find all');
            },
        });
    });

    it('/FIND (uuid)', (done) => {
        const data = { identity, uuid: snModelTest1.uuid };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                expect(res).toMatchPartialObject(snModelTest1);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find by uuid');
            },
        });
    });

    it('/FIND (with error - uuid not exists)', (done) => {
        const data = { identity, uuid: 'uuid-not-exists' };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                return Promise.reject('Get Smart Nodes find by uuid');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (Key)', (done) => {
        const data = { identity, key: snModelTest1.key };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                expect(res).toMatchPartialObject(snModelTest1);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find by key');
            },
        });
    });

    it('/FIND (with error - key not exists)', (done) => {
        const data = { identity, key: 'key-not-exists' };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                return Promise.reject('Get Smart Nodes find by key');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/CREATE', (done) => {
        const data = { identity, data: createSnModelService };
        smartNodesHead.create(data).subscribe({
            next: (res: SnModel) => {
                createSnModel.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSnModel);
                done();
            },
            error: (err) => {
                return Promise.reject('No created Smart Nodes');
            },
        });
    });

    it('/CREATE (with error - duplicate)', (done) => {
        const data = { identity, data: createSnModelService };
        smartNodesHead.create(data).subscribe({
            next: (res: SnModel) => {
                return Promise.reject('created Smart Nodes duplicate');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/CREATE (with error - duplicate)', (done) => {
        const data = { identity, data: duplicateNewSnModelService };
        smartNodesHead.create(data).subscribe({
            next: (res: SnModel) => {
                return Promise.reject('Created Smart Nodes (duplicate)');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/UPDATE', (done) => {
        modifyCreatedSnModel.uuid = createSnModel.uuid;
        const data = { identity, data: modifyCreatedSnModelService };
        smartNodesHead.update(data).subscribe({
            next: (res: SnModel) => {
                expect(res).toMatchPartialObject(modifyCreatedSnModel);
                done();
            },
            error: (err) => {
                return Promise.reject('No Created Smart Nodes (update)');
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
        const data = { identity, data: {uuid: modifyCreatedSnModel.uuid, patches: patch } };
        smartNodesHead.patch(data).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject(patch);
                done();
            },
            error: (err) => {
                return Promise.reject('No Smart Nodes patch');
            },
        });
    });

    it('/PATCH (version)', (done) => {
        const patch: PatchPropertyDto[] = [
            {
                op : 'replace',
                path : '/versions/[uuid:cda86945-7e47-4a81-845b-bfe93acc50c9]/creatorUuid/',
                value : 'workflow-100292-100292-100292',
            },
        ];
        const data = { identity, data: {uuid: modifyCreatedSnModel.uuid, patches: patch } };
        smartNodesHead.patch(data).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject(patch);
                done();
            },
            error: (err) => {
                return Promise.reject('No Smart Nodes patch');
            },
        });
    });

    it('/DELETE ', (done) => {
        const data = { identity, data:  createSnModel.uuid };
        smartNodesHead.delete(data).subscribe({
            next: (res: boolean) => {
                done();
            },
            error: (err) => {
                return Promise.reject('No delete Smart Nodes');
            },
        });
    });

    it('/DELETE (init snmodel)', (done) => {
        const data = { identity, data:  initUuid };
        smartNodesHead.delete(data).subscribe({
            next: (res: boolean) => {
                done();
            },
            error: (err) => {
                return Promise.reject('No deleted Init Smart Nodes');
            },
        });
    });

    it('/DELETE (with error - validate delete)', (done) => {
        const data = { identity, data:  createSnModel.uuid };
        smartNodesHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('No correctly delete Smart Nodes');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/DELETE (with error - no uuid)', (done) => {
        const data = { identity: identityError, data: 'no-uuid-exists' };
        smartNodesHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('No delete Smart Nodes');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND - (version actives)', (done) => {
        const data = { identity, uuid: snModelTest2.uuid };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                done();
            },
            error: (err) => {
                return Promise.reject('Get Smart Nodes find by key');
            },
        });
    });

    it('CACHE', (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        const data = {identity, date: d.toISOString() };
        smartNodesHead.cache(data).subscribe({
            next: (res: CacheDto) => {
                expect(res.deleted).toEqual([
                    initUuid,
                    createSnModel.uuid,
                ]);
                done();
            },
            error: (err) => {
                return Promise.reject('No Cache Smart Nodes');
            },
        });
    });

});