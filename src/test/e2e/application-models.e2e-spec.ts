import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { ApplicationModelDto, PatchPropertyDto } from '@algotech/core';
import { TestUtils } from '../utils';
import { applicationModel1 } from '../fixtures/applicationmodels';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

const createApplicationModel: ApplicationModelDto = {
    key: 'TEST',
    appId: '209b84e7-9e82-2c0c-e13a-238cf23f5e61',
    appVersion: 1,
    displayName: [],
    description: [],
    environment: 'page-web',
    snApp: {
        environment: 'web',
        icon: '',
        id: 'eb9a30a7-decd-4400-bbae-1fcb6edf43a0',
        pageHeight: 0,
        pageWidth: 0,
        pages: [],
        securityGroups: [],
        description: [],
        shared: [],
    },
};

const publisExistApplication: ApplicationModelDto = {
    uuid: 'b3cd1662-deb7-4a0f-aa24-376c5001ad91',
    key: 'test-page',
    appId: '209b84e7-9e82-2c0c-e13a-238cf23f5e61',
    appVersion: 1,
    snModelUuid: '209b84e7-9e82-2c0c-e13a-238cf23f5e60',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Créer une application',
        },
        {
            lang: 'en-US',
            value: 'Create application',
        },
    ],
    description: [
        {
            lang: 'fr-FR',
            value: 'sur equipement géolocalisé',
        },
        {
            lang: 'en-US',
            value: 'on geolocalised equipment',
        },
    ],
    environment: 'page-web',
    snApp: {
        environment: 'web',
        icon: '',
        id: 'eb9a30a7-decd-4400-bbae-1fcb6edf43a0',
        pageHeight: 0,
        pageWidth: 0,
        pages: [],
        securityGroups: [],
        description: [],
        shared: [],
    },
};

const publisNewApplication: ApplicationModelDto = {
    uuid: '4e3a79f4-5f38-46e9-8523-24e6c6b3844f',
    key: 'test-page',
    appId: '309b84e7-9e82-2c0c-e13a-238cf23f5e61',
    appVersion: 1,
    snModelUuid: '0ecb730d-bda1-4246-b1c5-cd6c17d3d401',
    displayName: [],
    description: [],
    environment: 'page-web',
    snApp: {
        environment: 'web',
        icon: '',
        id: 'eb9a30a7-decd-4400-bbae-1fcb6edf43a2',
        pageHeight: 0,
        pageWidth: 0,
        pages: [],
        securityGroups: [],
        description: [],
        shared: [],
    },
};

const patchSet: PatchPropertyDto = {
    op: 'replace',
	path: '/snApp/pages/[0]/widgets/[id:d10c7ed1-797b-6233-e057-6815f91e13cd]/box/x/',
	value: 10,
};

const patchSetError: PatchPropertyDto = {
    op: 'add',
    path: '/snApp/pageeee/[0]/widgets/66fc4312-1b2d-11e9-ab14-d663bd873d93/css',
    value: 'Error',
};

const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/appId',
};

describe('ApplicationModels', () => {
    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
        app = nestApp;
        return utils.Before(app, 'applicationmodels', request);});
    });

    afterAll(() => {
        return utils.After();
    });

    // Test la récupération de l'ensemble des application-models
    it(`/GET application-models`, () => {
      return request(app.getHttpServer())
        .get('/application-models')
        .set('Authorization', utils.authorizationJWT)
        .expect(200)
        .then(response => {
            const applicationModels: object[] = utils.clearDates(response.body);

            expect(applicationModels).toEqual(
                jasmine.arrayContaining([applicationModel1]),
            );
        });
    });

    // Test la récupération d'une application model par id
    it('/GET application-models/id', () => {
        return request(app.getHttpServer())
            .get('/application-models/' + applicationModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(utils.clearDates(response.body) as ApplicationModelDto).toEqual(
                    applicationModel1,
                );
            });
    });

    // Test l'échec de la récupération d'une application model par id
    it('/GET application-models/id  - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/application-models/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test la récupération d'une application model par clé
    it('/GET application-models/key', () => {
        return request(app.getHttpServer())
            .get('/application-models/key/' + applicationModel1.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(utils.clearDates(response.body) as object).toEqual(
                    applicationModel1,
                );
            });
    });

    // Test la création d'une application model
    it('/POST application-models', () => {
        return request(app.getHttpServer())
            .post('/application-models/')
            .set('Authorization', utils.authorizationJWT)
            .send(createApplicationModel)
            .expect(201)
            .then(response => {
                const res: ApplicationModelDto = utils.clearDates(response.body);
                createApplicationModel.uuid = res.uuid;

                expect(res).toEqual(createApplicationModel);
            });
    });

    // Test les patchs
    it('/PATCH application-models', () => {
        return request(app.getHttpServer())
            .patch('/application-models/' + applicationModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSet,
                patchRemove])

            .expect(200)
            .then(response => {

                expect(response.body).toEqual([
                    patchSet,
                    patchRemove,
                ]);
            });
    });

    // cache after post/patch
    it('/GET application-models/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .get('/application-models/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({uuid: createApplicationModel.uuid}),
                        jasmine.objectContaining({uuid: applicationModel1.uuid}),
                    ]),
                    deleted: [],
                });
            });
    });

    // Tests la supppression d'une application model
    it('/DELETE application-models', () => {
        return request(app.getHttpServer())
            .delete('/application-models/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: createApplicationModel.uuid })
            .expect(200);
    });

    // cache
    it('/GET application-models/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .get('/application-models/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({uuid: applicationModel1.uuid}),
                    ]),
                    deleted: [createApplicationModel.uuid],
                });
            });
    });

    // Test l'échec de la récupération d'une application model par clé
    it('/GET application-models/key - key inexistante (GET)', () => {
        return request(app.getHttpServer())
            .get('/application-models/key/' + createApplicationModel.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la publication d'une application model (écrase l'ancien)
    it('/application-models (PUBLISH) ecrase the last one', () => {
        return request(app.getHttpServer())
            .put('/application-models')
            .set('Authorization', utils.authorizationJWT)
            .send(publisExistApplication)
            .expect(200)
            .then((response) => {
                const model: object = utils.clearDates(response.body);
                expect(model).toEqual(_.assign(publisExistApplication, { uuid: applicationModel1.uuid }));
            });
    });

    // Test de la publication d'une application model (ajoute un nouveau)
    it('/application (PUBLISH) add a new one', () => {
        return request(app.getHttpServer())
            .put('/application-models')
            .set('Authorization', utils.authorizationJWT)
            .send(publisNewApplication)
            .expect(200)
            .then((response) => {
                const model: object = utils.clearDates(response.body);
                expect(model).toEqual(publisNewApplication);
            });
    });
});
