import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';

import { workflowModel1 } from '../fixtures/workflowmodels';
import { PatchPropertyDto, WorkflowModelDto } from '@algotech-ce/core';
import { TestUtils } from '../utils';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

const createWorkflowModel: WorkflowModelDto = {
    key: 'TEST',
    displayName: [],
    description: [],
    profiles: [],
    tags: [],
    variables: [],
    parameters: [],
    steps: [],
};

const publishExistWorkflow: WorkflowModelDto = {
    uuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
    key: 'create-document',
    snModelUuid: '66131b59-ebc8-4f31-ab1c-1134f1caf967',
    viewId: 'dc2a68f5-fe05-4f5b-863c-a885dc13b8aa',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'modified workflow',
        },
        {
            lang: 'en-US',
            value: 'workflow modified',
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

const publishNewWorkflow: WorkflowModelDto = {
    uuid: '8c7496e6-d01b-4e82-853f-5b1c82756e6b',
    key: 'publish_new_workflow',
    snModelUuid: '1c6078b8-acbc-4c93-a5e6-c79dd64937b0',
    viewId: 'c8d963ab-5f6e-4a09-8310-6488e424d6b2',
    viewVersion: 0,
    displayName: [
        {
            lang: 'fr-FR',
            value: 'nouveau workflow',
        },
        {
            lang: 'en-US',
            value: 'new workflow',
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
    path: '/steps/[uuid:66fc4312-1b2d-11e9-ab14-d663bd873d93]/tasks/[uuid:6b443bbe-1b2d-11e9-ab14-d663bd873d93]/general/displayName/0/value',
    value: 'Sélection EQPT',
};

const patchPush: PatchPropertyDto = {
    op: 'add',
    path: '/steps/[uuid:66fc4312-1b2d-11e9-ab14-d663bd873d93]/tasks/[uuid:6b443bbe-1b2d-11e9-ab14-d663bd873d93]/general/displayName/[?]',
    value: {
        lang: 'es-ES',
        value: 'Selección de equipos',
    },
};

const patchSetError: PatchPropertyDto = {
    op: 'add',
    path: '/steppppps/[uuid:66fc4312-1b2d-11e9-ab14-d663bd873d93]/caption',
    value: 'Error',
};

const patchSetNoRespectModel: PatchPropertyDto = {
    op: 'add',
    path: '/steps/[uuid:66fc4312-1b2d-11e9-ab14-d663bd873d93]/tasks/[uuid:6b443bbe-1b2d-11e9-ab14-d663bd873d93]/general/displayName/[0]/caption',
    value: 'Caption',
};

const patchPull: PatchPropertyDto = {
    op: 'remove',
    path: '/steps/[uuid:66fc4312-1b2d-11e9-ab14-d663bd873d93]/tasks/[uuid:6b443bbe-1b2d-11e9-ab14-d663bd873d93]/general/displayName/[1]',
};

const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/iconName',
};

const workflowModelPatched = [
        {
            lang: 'fr-FR',
            value: 'Sélection EQPT',
        },
        {
            lang: 'es-ES',
            value: 'Selección de equipos',
        },
    ];

describe('WorkflowModels', () => {
    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, 'workflowmodels', request);
        });
    });

    afterAll(() => {
        return utils.After();
    });

    // Test la récupération de l'ensemble des workflow-models
    it(`/GET workflow-models`, () => {
      return request(app.getHttpServer())
        .get('/workflow-models')
        .set('Authorization', utils.authorizationJWT)
        .expect(200)
        .then(response => {
          const workflowModels: object[] = utils.clearDates(response.body);

          expect(workflowModels).toEqual(
            jasmine.arrayContaining([workflowModel1]),
          );
        });
    });

    // Test la récupération d'un workflow model par id
    it('/GET workflow-models/id', () => {
        return request(app.getHttpServer())
            .get('/workflow-models/' + workflowModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(utils.clearDates(response.body) as WorkflowModelDto).toEqual(
                    workflowModel1,
                );
            });
    });

    // Test l'échec de la récupération d'un workflow model par id
    it('/GET workflow-models/id  - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/workflow-models/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test la récupération d'un workflow model par clé
    it('/GET workflow-models/key', () => {
        return request(app.getHttpServer())
            .get('/workflow-models/key/' + workflowModel1.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(utils.clearDates(response.body) as object).toEqual(
                    workflowModel1,
                );
            });
    });

    // Test la création d'un workflow model
    it('/POST workflow-models', () => {
        return request(app.getHttpServer())
            .post('/workflow-models/')
            .set('Authorization', utils.authorizationJWT)
            .send(createWorkflowModel)
            .expect(201)
            .then(response => {
                const res: WorkflowModelDto = utils.clearDates(response.body);
                createWorkflowModel.uuid = res.uuid;

                expect(res).toEqual(createWorkflowModel);
            });
    });

    // Test les patchs
    it('/PATCH workflow-models', () => {
        return request(app.getHttpServer())
            .patch('/workflow-models/' + workflowModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSet,
                patchPush,
                patchPull,
                patchRemove])

            .expect(200)
            .then(response => {

                expect(response.body).toEqual(
                    [
                        patchSet,
                        patchPush,
                        patchPull,
                        patchRemove]);
            });
    });

    // Test l'échec des patchs
    it('/PATCH workflow-models', () => {
        return request(app.getHttpServer())
            .patch('/workflow-models/' + workflowModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetError])
            .expect(400);
    });

    // Test l'échec des patchs
    it('/PATCH workflow-models', () => {
        return request(app.getHttpServer())
            .patch('/workflow-models/' + workflowModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetNoRespectModel])
            .expect(400);
    });

    // Vérifie que l'objet a bien été modifié
    it('/GET workflow-models/key (modified)', () => {
        return request(app.getHttpServer())
            .get('/workflow-models/' + workflowModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const workflow: WorkflowModelDto = utils.clearDates(response.body);
                const displayName = workflow.steps.find(step => step.uuid === '66fc4312-1b2d-11e9-ab14-d663bd873d93').tasks.find(
                    task => task.uuid === '6b443bbe-1b2d-11e9-ab14-d663bd873d93').general.displayName;

                expect(displayName).toEqual(workflowModelPatched);
            });
    });

    // Tests la supppression d'un workflow-model
    it('/DELETE workflow-models', () => {
        return request(app.getHttpServer())
            .delete('/workflow-models/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: createWorkflowModel.uuid })
            .expect(200);
    });

    // cache
    it('/GET workflow-models/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .get('/workflow-models/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({uuid: workflowModel1.uuid}),
                    ]),
                    deleted: [createWorkflowModel.uuid],
                });
            });
    });

    // Test l'échec de la récupération d'un workflow model par clé
    it('/GET workflow-models/key - key inexistante (GET)', () => {
        return request(app.getHttpServer())
            .get('/workflow-models/key/' + createWorkflowModel.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la publication d'un workflow (écrase l'ancien)
    it('/workflows (PUBLISH) ecrase the last one', () => {
        return request(app.getHttpServer())
            .put('/workflow-models')
            .set('Authorization', utils.authorizationJWT)
            .send(publishExistWorkflow)
            .expect(200)
            .then((response) => {
                const model: object = utils.clearDates(response.body);
                expect(model).toEqual(_.assign(publishExistWorkflow, { uuid: workflowModel1.uuid }));
            });
    });

    // Test de la publication d'un workflow (ajoute un nouveau)
    it('/workflows (PUBLISH) add a new one', () => {
        return request(app.getHttpServer())
            .put('/workflow-models')
            .set('Authorization', utils.authorizationJWT)
            .send(publishNewWorkflow)
            .expect(200)
            .then((response) => {
                const model: object = utils.clearDates(response.body);
                expect(model).toEqual(publishNewWorkflow);
            });
    });
});
