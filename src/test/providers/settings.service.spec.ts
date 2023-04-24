import { CustomerInit, CustomerInitResult, IdentityRequest, Settings } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { SettingsHead } from '../../providers';
import { createSettings, patchPull, patchPush, patchRemove, patchSet, patchSetError, settings, updateSettings } from '../fixtures/settings';
import { PatchPropertyDto } from '@algotech-ce/core';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

const initCustomer: CustomerInit = {
    customerKey: 'nouveau',
    firstName: 'John',
    lastName: 'Doe',
    login: 'sadmin-nouveaux',
    email: 'abc@abc.com',
    password: '123456',
    languages: [{ lang: 'fr-FR', value: 'français' }, { lang: 'en-US', value: 'English' }],
    defaultapplications: []
};

const identityCreate: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'new-customer',
};

const identityNoExists: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'no-customer-exists',
};

describe('SettingsHead', () => {
    let settingsHead: SettingsHead;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        settingsHead = app.get<SettingsHead>(SettingsHead);

        await utils.Before(app, 'settings', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(settingsHead).toBeDefined();
    });

    it ('/FINDALL', (done) => {
        const data = { identity };
        settingsHead.findAll().subscribe({
            next: (res: Settings[]) => {
                expect(res).toMatchPartialObject([settings]);
                done();
            },
            error: (err) => {
                return Promise.reject('Settings list not found');
            },
        });
    });    

    it ('/FINDONE', (done) => {
        const data = { identity };
        settingsHead.findOne(data).subscribe({
            next: (res: Settings) => {
                expect(res).toMatchPartialObject(settings);
                done();
            },
            error: (err) => {
                return Promise.reject('Settings not found');
            },
        });
    });
    
    it ('/FINDONE (with error)', (done) => {
        const data = { identity: identityNoExists };
        settingsHead.findOne(data).subscribe({
            next: (res: Settings) => {
                return Promise.reject('Settings found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/INIT', (done) => {
        const data = { customer: initCustomer };
        settingsHead.init(data).subscribe({
            next: (res: CustomerInitResult) => {
                expect(res).toMatchPartialObject({ key: 'settings', value: 'ok' } );
                done();
            },
            error: (err) => {
                return Promise.reject('Settings not found');
            },
        });
    });

    it ('/INIT (with error)', (done) => {
        const data = { customer: initCustomer };
        settingsHead.init(data).subscribe({
            next: (res: CustomerInitResult) => {
                return Promise.reject('Settings not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/CREATE', (done) => {
        const data = { identity: identityCreate, settings: (createSettings as unknown) as Settings };
        settingsHead.create(data).subscribe({
            next: (res: Settings) => {
                createSettings.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSettings );
                done();
            },
            error: (err) => {
                return Promise.reject('Settings found');
            },
        });
    });

    it ('/CREATE (with error)', (done) => {
        const data = { identity: identityCreate, settings: (createSettings as unknown) as Settings };
        settingsHead.create(data).subscribe({
            next: (res: Settings) => {
                return Promise.reject('Settings found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateSettings.uuid = createSettings.uuid;
        const data = { identity: identityCreate, settings: (updateSettings as unknown) as Settings };
        settingsHead.update(data).subscribe({
            next: (res: Settings) => {
                expect(res).toMatchPartialObject(updateSettings);
                done();
            },
            error: (err) => {
                return Promise.reject('Settings not found');
            },
        });
    });

    it ('/PATCH', (done) => {
        const data = { 
            identity,
            uuid: settings.uuid,
            patches: [
                patchSet,
                patchPush,
                patchPull,
                patchRemove,
            ],
        };
        settingsHead.patch(data).subscribe({
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
                return Promise.reject('Settings not found');
            },
        });
    });

    it ('/PATCH (with error)', (done) => {
        const data = { 
            identity,
            uuid: settings.uuid,
            patches: [
                patchSetError,
            ],
        };
        settingsHead.patch(data).subscribe({
            next: (res: PatchPropertyDto[]) => {
                return Promise.reject('patch settings error');
            },
            error: (err) => {
                done();
            },
        });
    });
});
