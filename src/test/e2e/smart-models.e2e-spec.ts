import { INestApplication } from '@nestjs/common';
import { smartModel1, smartModelPermR } from '../fixtures/smartmodels';
import { SmartModelDto, PatchPropertyDto } from '@algotech/core';
import { TestUtils } from '../utils';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

const createsmartModel: SmartModelDto = {
    key: 'CI-KEY',
    system: false,
    uniqueKeys: [],
    domainKey: 'GED',
    displayName: [
        {
            lang: 'en-US',
            value: 'Nature',
        },
        {
            lang: 'fr-FR',
            value: 'Nature',
        },
    ],
    properties: [
        {
            uuid: '10a5971c-30f2-4581-a680-606c37013fac',
            key: 'name',
            displayName: [
                {
                    lang: 'en-US',
                    value: 'Name',
                },
                {
                    lang: 'fr-FR',
                    value: 'Nom',
                },
            ],
            keyType: 'string',
            multiple: false,
            required: true,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'technician',
                ],
            },
        },
    ],
    skills: {
        atGeolocation: false,
        atDocument: false,
    },
    permissions: {
        R: [],
        RW: [
            'admin',
            'technician',
        ],
    },
};

const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/properties/[key:VERSION]/displayName/[lang:fr-FR]/value',
    value: 'Une Version',
};

const patchPush: PatchPropertyDto = {
    op: 'add',
    path: '/properties/[key:VERSION]/displayName/[?]',
    value:
    {
        lang: 'es-ES',
        value: 'Versión',
    },
};

const patchSetError: PatchPropertyDto = {
    op: 'add',
    path: '/ppppppproperties/[key:VERSION]/displayName/[lang:en-US]/caption',
    value: 'Version',
};

const patchSetNoRespectModel: PatchPropertyDto = {
    op: 'add',
    path: '/properties/[key:VERSION]/displayName/[lang:en-US]/caption',
    value: 'Version',
};

const patchPull: PatchPropertyDto = {
    op: 'remove',
    path: '/properties/[key:NAME]/displayName/[lang:fr-FR]',
};

const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/key',
};

const smartModulePatched = {
    displayName: [
        {
            lang: 'en-US',
            value: 'Version',
        },
        {
            lang: 'fr-FR',
            value: 'Une Version',
        },
        {
            lang: 'es-ES',
            value: 'Versión',
        },
    ],
};

describe('SmartModels', () => {
    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
        app = nestApp;
        return utils.Before(app, 'smartmodels', request);});
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test la récupération de l'ensemble des smart-models
    it(`/GET smart-models`, () => {
      return request(app.getHttpServer())
        .get('/smart-models')
        .set('Authorization', utils.authorizationJWT)
        .expect(200)
        .then(response => {
          const smartModels: object[] = utils.clearDates(response.body);

          expect(smartModels).toEqual(
            jasmine.arrayContaining([smartModel1]),
          );
        });
    });

    // Test la récupération de l'ensemble des smart-models système
    it(`/GET smart-models SYSTEM`, () => {
      return request(app.getHttpServer())
        .get('/smart-models/?system=true')
        .set('Authorization', utils.authorizationJWT)
        .expect(200)
        .then(response => {
          const smartModels: SmartModelDto[] = utils.clearDates(response.body);

          expect(smartModels.find((sm) => sm.key === smartModelPermR.key)).not.toBeUndefined();

          expect(smartModels).not.toEqual(
            jasmine.arrayContaining([smartModel1]),
          );
        });
    });

    // Test la récupération d'un smart model par id
    it('/GET smart-models/id', () => {
        return request(app.getHttpServer())
            .get('/smart-models/' + smartModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(utils.clearDates(response.body) as SmartModelDto).toEqual(
                    smartModel1,
                );
            });
    });

    // Test l'échec de la récupération d'un smart model par id
    it('/GET smart-models/id  - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/smart-models/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test la récupération d'un smart model par clé
    it('/GET smart-models/key', () => {
        return request(app.getHttpServer())
            .get('/smart-models/key/' + smartModel1.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(utils.clearDates(response.body) as object).toEqual(
                    smartModel1,
                );
            });
    });

    // Test la récupération d'un smart model par clé (with submodel)
    it('/GET smart-models/key?submodel=1 recursive', () => {
        return request(app.getHttpServer())
            .get('/smart-models/key/parent?submodel=1')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(utils.clearDates(response.body) as object).toEqual(
                    jasmine.arrayContaining([
                        jasmine.objectContaining({key: 'parent'}),
                        jasmine.objectContaining({key: 'child',
                        })],
                    ),
                );
            });
    });

    // Test la récupération d'un smart model par clé (recursive with submodel)
    it('/GET smart-models/key?submodel=1 recursive', () => {
        return request(app.getHttpServer())
            .get('/smart-models/key/EQUIPMENT?submodel=1')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(utils.clearDates(response.body) as object).toEqual(
                    jasmine.arrayContaining([
                        jasmine.objectContaining({key: 'EQUIPMENT'}),
                        jasmine.objectContaining({key: 'DOCUMENT'}),
                        jasmine.objectContaining({key: 'USER'}),
                        ],
                    ),
                );
            });
    });

    // Test la création d'un smart model
    it('/POST smart-models', () => {
        return request(app.getHttpServer())
            .post('/smart-models/')
            .set('Authorization', utils.authorizationJWT)
            .send(createsmartModel)
            .expect(201)
            .then(response => {
                const res: SmartModelDto = utils.clearDates(response.body);
                createsmartModel.uuid = res.uuid;
                expect(res).toEqual(createsmartModel);
            });
    });

    // Test les patchs
    it('/PATCH smart-models', () => {
        return request(app.getHttpServer())
            .patch('/smart-models/' + smartModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSet,
                patchPush,
                patchPull,
                patchRemove])

            .expect(200)
            .then(response => {

                expect(utils.clearDates(response.body)).toEqual(
                    [
                        patchSet,
                        patchPush,
                        patchPull,
                        patchRemove]);
            });
    });

    // Test l'échec des patchs
    it('/PATCH smart-models', () => {
        return request(app.getHttpServer())
            .patch('/smart-models/' + smartModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetError])
            .expect(400);
    });

    // Test l'échec des patchs
    it('/PATCH smart-models', () => {
        return request(app.getHttpServer())
            .patch('/smart-models/' + smartModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetNoRespectModel])
            .expect(400);
    });

    // Vérifie que l'objet a bien été modifié
    it('/GET smart-models/key (modified)', () => {
        return request(app.getHttpServer())
            .get('/smart-models/' + smartModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const properties = utils.clearDates(response.body).properties;

                expect(properties[0]).not.toEqual(jasmine.objectContaining(smartModulePatched));
                expect(properties[1]).toEqual(jasmine.objectContaining(smartModulePatched));
            });
    });

    // Tests la supppression d'un smart-model
    it('/DELETE smart-models', () => {
        return request(app.getHttpServer())
            .delete('/smart-models/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: createsmartModel.uuid })
            .expect(200);
    });

    // cache
    it('/GET smart-models/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .get('/smart-models/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({uuid: smartModel1.uuid}),
                    ]),
                    deleted: [createsmartModel.uuid],
                });
            });
    });

    // Test l'échec de la récupération d'un smart model par clé
    it('/GET smart-models/key - key inexistante (GET)', () => {
        return request(app.getHttpServer())
            .get('/smart-models/key/' + createsmartModel.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Unique
});
