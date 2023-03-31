import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { createSettings, patchPull, patchPush, patchRemove, patchSet, settings, updateSettings } from '../fixtures/settings';
import { PatchPropertyDto, SettingsDto } from '@algotech-ce/core';
import { SettingsController } from '../../controllers';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

const identityCreate: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'new-customer',
};

describe('SettingsController', () => {
    let settingsController: SettingsController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        settingsController = app.get<SettingsController>(SettingsController);

        await utils.Before(app, 'settings', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(settingsController).toBeDefined();
    });

    it ('/FINDONE', (done) => {
        settingsController.findOne(identity, '').subscribe({
            next: (res: SettingsDto) => {
                expect(res).toMatchPartialObject(settings);
                done();
            },
            error: (err) => {
                return Promise.reject('Settings not found');
            },
        });
    });    

    it ('/CREATE', (done) => {
        settingsController.create(identityCreate, createSettings ).subscribe({
            next: (res: SettingsDto) => {
                createSettings.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSettings );
                done();
            },
            error: (err) => {
                return Promise.reject('Settings found');
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateSettings.uuid = createSettings.uuid;
        settingsController.update(identityCreate, updateSettings ).subscribe({
            next: (res: SettingsDto) => {
                expect(res).toMatchPartialObject( updateSettings );
                done();
            },
            error: (err) => {
                return Promise.reject('Settings found');
            },
        });
    });

    it ('/PATCH', (done) => {
        const patches = [
            patchSet,
            patchPush,
            patchPull,
            patchRemove,
        ];
        settingsController.patchProperty(identity, settings.uuid, patches).subscribe({
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
/* 
    it ('/UPDATE', (done) => {
        const data = { 
            identity,
            uuid: settings.uuid,
            patches: [
                patchSetError,
            ],
        };
        settingsController.update).subscribe({
            next: (res: PatchPropertyDto[]) => {
                return Promise.reject('patch settings error');
            },
            error: (err) => {
                done();
            },
        });
    }); */

});