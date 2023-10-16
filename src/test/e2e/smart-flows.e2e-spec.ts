import { INestApplication } from '@nestjs/common';
import { listFlowsModel } from '../fixtures/flowsmodels';
import { TestUtils } from '../utils';
import { PatchPropertyDto, WorkflowModelDto, SmartObjectDto } from '@algotech-ce/core';
import * as _ from 'lodash';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

const createSmartObject: SmartObjectDto = {
    uuid: '435cd785-6345-f5c7-b5de-0ebc17f8816d',
    modelKey: 'EQUIPMENT',
    properties: [
        {
            key: 'NAME',
            value: 'TEST-E2E-SMARTFLOWS',
        },
        {
            key: 'DOCUMENTS',
            value: [],
        },
    ],
    skills: {
        atDocument: {
            documents: [],
        },
        atGeolocation: {
            geo: [],
        },
        atMagnet: {
            zones: [],
        },
        atSignature: null,
        atTag: {
            tags: [],
        },
    },
};

const createFlowsModel: WorkflowModelDto = {
    key: 'new_smartflow',
    viewId: 'dc2a68f5-fe05-4f5b-863c-a885dc13b8f5',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'new smartflow',
        },
    ],
    description: [],
    tags: [],
    parameters: [],
    variables: [],
    profiles: [],
    steps: [],
};

const duplicatedKeyFlowsModel: WorkflowModelDto = {
    uuid: 'e224dfc4-cfd4-484e-b90e-535b6b5d2a66',
    key: 'premier_smartflow',
    viewId: '80e56b05-458a-43d8-8f5e-85da5f274381',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'duplicated key smartflow',
        },
    ],
    description: [],
    tags: [],
    parameters: [],
    variables: [],
    profiles: [],
    steps: [],
};

const publishExistSmartFlow: WorkflowModelDto = {
    uuid: '461af32e-9332-44f1-ba2d-665c74c84d99',
    key: 'premier_smartflow',
    snModelUuid: '4796b237-c90a-48c4-8409-2299c4d4c8d8',
    viewId: 'dc2a68f5-fe05-4f5b-863c-a885dc13b8f5',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'modified smartflow',
        },
        {
            lang: 'en-US',
            value: 'smartflow modified',
        },
    ],
    description: [],
    tags: [],
    iconName: 'new icon',
    parameters: [],
    variables: [],
    profiles: [
        {
            uuid: '3bc38746-7723-4585-a3c7-54a8420c7c19',
            name: 'profile1',
        },
    ],
    steps: [],
};

const publishNewSmartFlow: WorkflowModelDto = {
    uuid: '2f28e203-7ad9-4a00-bc79-a425b58dac7d',
    key: 'publish_new_smartflow',
    snModelUuid: '2dd15312-8a7a-42a0-b0f5-8d0d72f35f17',
    viewId: '088cf4a3-3e0f-4fb1-986d-c010e3423553',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'nouveau smartflow',
        },
        {
            lang: 'en-US',
            value: 'new smartflow',
        },
    ],
    description: [],
    tags: [],
    iconName: 'new icon',
    parameters: [],
    variables: [],
    profiles: [
        {
            uuid: '3bc38746-7723-4585-a3c7-54a8420c7c19',
            name: 'profile1',
        },
    ],
    steps: [],
};

const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/displayName/[lang:fr-FR]/value',
    value: 'premier smartflow patch',
};

const patchPush: PatchPropertyDto = {
    op: 'add',
    path: '/profiles/[?]',
    value:
    {
        uuid: 'f0931661-6d7f-40a0-85a9-a227be005d22',
        name: 'profile',
    },
};

const patchSetNoRespectModel: PatchPropertyDto = {
    op: 'add',
    path: '/displayName/[lang:fr-FR]/test',
    value: 'test error',
};

const patchPull: PatchPropertyDto = {
    op: 'remove',
    path: '/displayName/[lang:fr-FR]',
};

const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/iconName',
};

const flowsPatched = {
    profiles: [
        {
            uuid: '3bc38746-7723-4585-a3c7-54a8420c7c19',
            name: 'profile1',
        },
        {
            uuid: 'f0931661-6d7f-40a0-85a9-a227be005d22',
            name: 'profile',
        },
    ],
};

describe('SmartFlowsModels', () => {
    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
        app = nestApp;
        return utils.Before(app, 'smartflowmodels', request);});
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test recuperation FlowsModels
    it('/smartflows (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartflows')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const list: object[] = utils.clearDates(response.body);
                expect(list).toEqual(jasmine.arrayContaining(listFlowsModel));
            });
    });

    // Test recuperation FlowsModels by uuid
    it('/smartflows/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartflows/' + listFlowsModel[0].uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const list: object[] = utils.clearDates(response.body);
                expect(list).toEqual(listFlowsModel[0]);
            });
    });

    // Test de la recuperation d'un FlowsModel inexistant
    it('/smartflows/uuid - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartflows/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'un FlowsModel par clé
    it('/smartflows/key/{key} (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartflows/key/' + listFlowsModel[1].key)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const model: object = utils.clearDates(response.body);
                expect(model).toEqual(listFlowsModel[1]);
            });
    });

    // Test de l'ajout d'un FlowsModel
    it('/smartflows/ (POST)', () => {
        return request(app.getHttpServer())
            .post('/smartflows/')
            .set('Authorization', utils.authorizationJWT)
            .send(createFlowsModel)
            .expect(201)
            .then((response) => {
                const model: any = utils.clearDates(response.body);
                createFlowsModel.uuid = model.uuid;
                expect(model).toEqual(createFlowsModel);
            });
    });

    // Test de l'ajout d'un FlowsModel avec key existante
    it('/smartflows/ - key existant (POST)', () => {
        return request(app.getHttpServer())
            .post('/smartflows/')
            .set('Authorization', utils.authorizationJWT)
            .send(duplicatedKeyFlowsModel)
            .expect(400);
    });

    // Test de la publication d'un smartflow (écrase l'ancien)
    it('/smartflows (PUBLISH) ecrase the last one', () => {
        return request(app.getHttpServer())
            .put('/smartflows')
            .set('Authorization', utils.authorizationJWT)
            .send(publishExistSmartFlow)
            .expect(200)
            .then((response) => {
                const model: object = utils.clearDates(response.body);
                expect(model).toEqual(_.assign(publishExistSmartFlow, { uuid: listFlowsModel[0].uuid }));
            });
    });

    // Test de la publication d'un smartflow (ajoute un nouveau)
    it('/smartflows (PUBLISH) add a new one', () => {
        return request(app.getHttpServer())
            .put('/smartflows')
            .set('Authorization', utils.authorizationJWT)
            .send(publishNewSmartFlow)
            .expect(200)
            .then((response) => {
                const model: object = utils.clearDates(response.body);
                expect(model).toEqual(publishNewSmartFlow);
            });
    });

    // Test de la suppression d'un FlowsModel
    it('/smartflows/ (DELETE)', () => {
        return request(app.getHttpServer())
            .delete('/smartflows')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: createFlowsModel.uuid })
            .expect(200);
    });

    // cache
    it('/GET smartflows/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .get('/smartflows/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({uuid: publishNewSmartFlow.uuid}),
                        jasmine.objectContaining({uuid: listFlowsModel[0].uuid}),
                    ]),
                    deleted: [createFlowsModel.uuid],
                });
            });
    });

    // Test si la suppréssion est bien effectuée
    it('/smartflows/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartflows/' + createFlowsModel.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'un SmartFlows inexistant
    it('/smartflows/key/{key} - key inexistante (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartflows/key/NOKEY')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test des patchs
    it('/smartflows PATCH', () => {
        return request(app.getHttpServer())
            .patch('/smartflows/' + listFlowsModel[0].uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSet,
                patchPush,
                patchPull,
                patchRemove,
            ])
            .expect(200)
            .then(response => {
                expect(utils.clearDates(response.body)).toEqual(
                    [
                        patchSet,
                        patchPush,
                        patchPull,
                        patchRemove,
                    ],
                );
            });
    });

    // Test l'échec des patchs
    it('/smartflows - echec PATCH non respect modele', () => {
        return request(app.getHttpServer())
            .patch('/smartflows/' + listFlowsModel[0].uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetNoRespectModel,
            ])
            .expect(400);
    });

    // Vérifie que l'objet a bien été modifié
    it('/smartflows (modified)', () => {
        return request(app.getHttpServer())
            .get('/smartflows/' + listFlowsModel[0].uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const smartflows = utils.clearDates(response.body);
                expect(smartflows).toEqual(jasmine.objectContaining(flowsPatched));
            });
    });

    // startsmartflows
    it('/smartflows/startsmartflows should return 200', () => {
        return request(app.getHttpServer())
            .post('/smartflows/startsmartflows')
            .set('authorization', utils.authorizationJWT)
            .send({
                key: 'dynamicStatusRoot',
                inputs: [{
                    key: 'error',
                    value: 200
                }]
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    success: true,
                    value: {
                        success: true
                    }
                });
            });
    });

    // startsmartflows
    it('/smartflows/startsmartflows should return 400', () => {
        return request(app.getHttpServer())
            .post('/smartflows/startsmartflows')
            .set('authorization', utils.authorizationJWT)
            .send({
                key: 'dynamicStatusRoot',
                inputs: [{
                    key: 'error',
                    value: 400
                }]
            })
            .expect(400)
            .then(response => {
                expect(response.body).toEqual({
                    success: false,
                    status: 400,
                    error: 'an error occured',
                });
            });
    });

    // startsmartflows
    it('/smartflows/startsmartflows should inject parameters', () => {
        return request(app.getHttpServer())
            .post('/smartflows/startsmartflows')
            .set('authorization', utils.authorizationJWT)
            .send({
                key: 'test_parameters',
                inputs: []
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual('toto');
            });
    });

    // startsmartflows
    it('/smartflows/startsmartflows should return password', () => {
        
        return request(app.getHttpServer())
        .post('/smartflows/startsmartflows')
        .set('authorization', utils.authorizationJWT)
        .send({
            key: 'test_password',
            inputs: []
        })
        .expect(200)
        .then(response => {
            expect(response.body).toEqual({
                login: 'algotech',
                password: 'motdepasse'
            });
        });
    });
});
