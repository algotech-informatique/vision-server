import { CustomerInit, CustomerInitResult, Environment, IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { createEnvironment, environment, patchPush, patchSet, patchPull,
    patchRemove, patchSetNoRespectModel, updateEnvironment } from '../fixtures/environment';
import { EnvironmentHead } from '../../providers';
import { PatchPropertyDto } from '@algotech/core';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

const identityNew: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'nouveau',
};

const identityError: IdentityRequest = {
    login: '',
    groups: [''],
    customerKey: 'no-customer-exists',
};

describe('EnvironmentHead', () => {
    let environmentHead: EnvironmentHead;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        environmentHead = app.get<EnvironmentHead>(EnvironmentHead);

        await utils.Before(app, 'environment', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(environmentHead).toBeDefined();
    });

    it ('/FIND', (done) => {
        environmentHead.findOne({identity}).subscribe({
            next: (res: Environment) => {
                expect(res).toMatchPartialObject(environment);
                done();
            },
            error: (err) => {
                return Promise.reject('Environment not found');
            },
        });
    });

    it ('/FIND (with error)', (done) => {
        environmentHead.findOne({identity: identityError}).subscribe({
            next: (res: Environment) => {
                return Promise.reject('Environment not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/CREATE', (done) => {
        environmentHead.create({identity: identityNew, data: createEnvironment as Environment }).subscribe({
            next: (res: Environment) => {
                createEnvironment.uuid = res.uuid;
                expect(res).toMatchPartialObject(createEnvironment);
                done();
            },
            error: (err) => {
                return Promise.reject('Environment not created');
            },
        });
    });

    it ('/CREATE (with error)', (done) => {
        environmentHead.create({identity, data: createEnvironment as Environment }).subscribe({
            next: (res: Environment) => {
                return Promise.reject('Environment already created');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateEnvironment.uuid = createEnvironment.uuid;
        environmentHead.update({identity: identityNew, data: updateEnvironment as Environment }).subscribe({
            next: (res: Environment) => {
                expect(res).toMatchPartialObject(updateEnvironment);
                done();
            },
            error: (err) => {
                return Promise.reject('Environment not created');
            },
        });
    });

    it ('/PATCH', (done) => {
        const data = {
            uuid: createEnvironment.uuid,
            patches: [
                patchSet,
                patchPush,
                patchPull,
                patchRemove,
            ],
        };
        environmentHead.patch({identity: identityNew, data }).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject([
                    patchSet,
                    patchPush,
                    patchPull,
                    patchRemove,
                ]);
                done();
            },
            error: (err) => {
                return Promise.reject('Environment patched');
            },
        });
    });

    it ('/PATCH (with error)', (done) => {
        const data = {
            uuid: createEnvironment.uuid,
            patches: [
                patchSetNoRespectModel,
            ],
        };
        environmentHead.patch({identity: identityNew, data }).subscribe({
            next: (res: PatchPropertyDto[]) => {
                return Promise.reject('Environment patched');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/INIT', (done) => {
        const customer: CustomerInit = {
            customerKey: 'new-customer',
            email: 'abc@abc.com',
            languages: [ {lang: 'fr', value: 'fr-FR'}],
            login: 'newlogin',
            name: 'New Login',
            password: '123456',
        };
        environmentHead.init({ customer }).subscribe({
            next: (res: CustomerInitResult) => {
                expect(res).toMatchPartialObject({
                    key: 'environment', value: 'ok' },
                );
                done();
            },
            error: (err) => {
                return Promise.reject('Environment not init');
            },
        });
    });
});