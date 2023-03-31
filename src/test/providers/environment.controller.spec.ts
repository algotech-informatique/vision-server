import { EnvironmentController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { createEnvironment, environment, patchPull, patchPush, patchRemove, patchSet, updateEnvironment } from '../fixtures/environment';
import { EnvironmentDto, PatchPropertyDto } from '@algotech-ce/core';

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

describe('EnvironmentController', () => {
    let environmentController: EnvironmentController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        environmentController = app.get<EnvironmentController>(EnvironmentController);

        await utils.Before(app, 'environment', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(environmentController).toBeDefined();
    });

    it ('/FIND', (done) => {
        environmentController.findOne( identity ).subscribe({
            next: (res: EnvironmentDto) => {
                expect(res).toMatchPartialObject(environment);
                done();
            },
            error: (err) => {
                return Promise.reject('Environment not found');
            },
        });
    });

    it ('/CREATE', (done) => {
        environmentController.create( identityNew, createEnvironment ).subscribe({
            next: (res: EnvironmentDto) => {
                createEnvironment.uuid = res.uuid;
                expect(res).toMatchPartialObject(createEnvironment);
                done();
            },
            error: (err) => {
                return Promise.reject('Environment not created');
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateEnvironment.uuid = createEnvironment.uuid;
        environmentController.update( identityNew, updateEnvironment ).subscribe({
            next: (res: EnvironmentDto) => {
                expect(res).toMatchPartialObject(updateEnvironment);
                done();
            },
            error: (err) => {
                return Promise.reject('Environment not created');
            },
        });
    });

    it ('/PATCHPROPERTY', (done) => {
        environmentController.patchProperty( identityNew, createEnvironment.uuid, [patchSet, patchPull, patchPush, patchRemove] ).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject(
                    [
                        patchSet,
                        patchPull,
                        patchPush,
                        patchRemove,
                    ]);
                done();
            },
            error: (err) => {
                return Promise.reject('Environment not created');
            },
        });
    });

});