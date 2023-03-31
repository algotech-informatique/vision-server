import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { PatchPropertyDto } from '@algotech-ce/core';
import { connectorsParameters, connectorsParametersUpdate, environment } from '../fixtures/environment';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/smartflows/[0]/name',
    value: 'New smartflow name',
};

const patchPush: PatchPropertyDto = {
    op: 'add',
    path: '/smartflows/[0]/subDirectories/[?]',
    value:
    {
        uuid: '2524f346-c154-4d26-800d-fb7a54168b00',
        name: 'sub smartflow',
        subDirectories: [],
    },
};

const patchSetNoRespectModel: PatchPropertyDto = {
    op: 'add',
    path: '/workflows/[0]/test',
    value: 'erreur model',
};

const patchPull: PatchPropertyDto = {
    op: 'remove',
    path: '/smartmodels/[1]/subDirectories/[1]',
};

const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/workflows',
};

const environmentPatched = {
    uuid: '2524f346-c154-4d26-800d-fb7a54168b00',
    name: 'sub smartflow',
    subDirectories: [],
};

describe('EnvironmentController (e2e)', () => {
    const request = require('supertest');
    let app: INestApplication;

    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp; 
            return utils.Before(app, 'environment', request);
        });
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test de la recuperation d'un environment global
    it('/environment (GET)', () => {
      return request(app.getHttpServer())
        .get('/environment')
        .set('Authorization', utils.authorizationJWT)
        .expect(200)
        .then((response) => {
          const retourEnvironment: object[] = utils.clearDates(response.body);
          expect(retourEnvironment).toEqual(environment);
        });
    });

    // Test de l'ajout d'environment avec environment déja en base
    it('/environment - nom existant (POST)', () => {
        return request(app.getHttpServer())
            .post('/environment')
            .set('Authorization', utils.authorizationJWT)
            .send(environment)
            .expect(400);
    });

    // Test des patchs
    it('/environment PATCH', () => {
        return request(app.getHttpServer())
            .patch('/environment/' + environment.uuid)
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
    it('/environment - echec PATCH non respect modele', () => {
        return request(app.getHttpServer())
            .patch('/environment/' + environment.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetNoRespectModel,
            ])
            .expect(400);
    });

    // Vérifie que l'objet a bien été modifié
    it('/environment (smartflow modified)', () => {
        return request(app.getHttpServer())
            .get('/environment/')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const smartflows = utils.clearDates(response.body).smartflows;
                expect(smartflows[0].subDirectories[0]).toEqual(jasmine.objectContaining(environmentPatched));
            });
    });

    it('/environment/parameters should return connectors parameters', () => {
        return request(app.getHttpServer())
            .get('/environment/parameters')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const parameters = utils.clearDates(response.body);
                expect(parameters).toEqual(connectorsParameters);
            });
    });

    it('/environment/parameters should update connectors parameters', () => {
        return request(app.getHttpServer())
            .put('/environment/parameters')
            .set('Authorization', utils.authorizationJWT)
            .send(connectorsParametersUpdate)
            .expect(200)
            .then((response) => {
                const parameters = utils.clearDates(response.body);
                expect(parameters).toEqual(connectorsParametersUpdate);
            });
    });

    // Vérifie que l'objet a bien été modifié
    it('/environment (smartflow modified)', () => {
        return request(app.getHttpServer())
            .get('/environment/')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const smartflows = utils.clearDates(response.body).smartflows;
                expect(smartflows.length).toEqual(2);
                expect(smartflows[0].custom).toEqual(connectorsParametersUpdate[0].parameters);
                expect(smartflows[1].custom).toEqual(connectorsParametersUpdate[1].parameters);
            });
    });
});
