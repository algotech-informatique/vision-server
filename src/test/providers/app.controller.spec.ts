import { INestApplication } from '@nestjs/common';
import { AppController } from '../../app.controller';
import { TestUtils } from '../utils';

declare const describe, beforeAll, afterAll, expect, it: any;

describe('AppController', () => {
    let appController: AppController;
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();
    const request = require('supertest');

    beforeAll(async () => {
        app = await utils.InitializeApp();
        appController = app.get<AppController>(AppController);

        await utils.Before(app, '', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    describe('/ROOT', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });

        it('should return true', () => {
            expect(appController.apiAlive()).toBe(true);
        });

        /* it('should return false (elastic not up in ci', () => {
            expect(appController.apiReady()).toBe(false);
        }); */
    });
});
