import { INestApplication } from '@nestjs/common';
import { group1, group2, group3, group4, group5 } from '../fixtures/groups';
import { TestUtils } from '../utils';
import { GroupDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import request from 'supertest';

declare const describe, jasmine, expect, afterAll, it: any;

describe('GroupsController (e2e)', () => {
    let app: INestApplication;
    const createGroup: GroupDto = {
        key: 'test',
        name: 'Testeur',
        description: 'Groupe des testeurs',
        application: {
            authorized: ['test-page'],
            default: {
                web: 'test-page',
                mobile: '',
            },
        },
    };
    const createWrongGroup = {
        description: 'Groupe des testeurs',
    };
    const createEmptyNameGroup = {
        key: 'admin',
        name: '',
        description: 'Groupe des testeurs',
        application: {
            authorized: [],
            default: {
                web: '',
                mobile: '',
            },
        },
    };
    const modifyGroup: GroupDto = {
        key: 'test',
        name: 'Testeur',
        description: 'Groupe des nobles testeurs',
        application: {
            authorized: ['test-page'],
            default: {
                web: 'test-page',
                mobile: '',
            },
        },
    };
    const utils: TestUtils = new TestUtils();

    let group1Uuid = null;
    let createGroupUuid = null;

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, null, request);
        });
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test de la recuperation de tous les groupes
    it('/groups (GET)', () => {
        return request(app.getHttpServer())
            .get('/groups')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const expected = [group1, group2, group3, group4, group5];
                const groups: object[] = _.compact(response.body.map(g => {
                    g.uuid = _.find(expected, { key: g.key })?.uuid;
                    return g;
                }));
                expect(response.body).toEqual(jasmine.arrayContaining(expected));
            });
    });

    // Test de la recuperation d'un groupe par clé
    it('/groups/key/{key} (GET)', () => {
        return request(app.getHttpServer())
            .get('/groups/key/' + group1.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const group: GroupDto = response.body;
                group1Uuid = group.uuid;
                group.uuid = group1.uuid;
                expect(group).toEqual(group1);
            });
    });

    // Test de la recuperation d'un groupe
    it('/groups/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/groups/' + group1Uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const group: GroupDto = response.body;
                group1.uuid = group.uuid;
                expect(group).toEqual(group1);
            });
    });

    // Test de la recuperation d'un groupe inexistant
    it('/groups/uuid - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/groups/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de l'ajout d'un groupe
    it('/groups/ (POST)', () => {
        return request(app.getHttpServer())
            .post('/groups/')
            .set('Authorization', utils.authorizationJWT)
            .send(createGroup)
            .expect(201)
            .then((response) => {
                const group: any = response.body;
                createGroup.uuid = group.uuid;
                createGroupUuid = group.uuid;
                expect(group).toEqual(createGroup);
            });
    });

    // Test de l'ajout d'un groupe avec nom existant
    it('/groups/ - nom existant (POST)', () => {
        return request(app.getHttpServer())
            .post('/groups/')
            .set('Authorization', utils.authorizationJWT)
            .send(createGroup)
            .expect(400);
    });

    // Test de l'ajout d'un groupe avec nom non renseigne
    it('/groups/ - nom non renseigne (POST)', () => {
        return request(app.getHttpServer())
            .post('/groups/')
            .set('Authorization', utils.authorizationJWT)
            .send(createWrongGroup)
            .set('Content-Type', 'application/json')
            .expect(400);
    });

    // Test de l'ajout d'un groupe avec nom vide
    it('/groups/ - nom vide (POST)', () => {
        return request(app.getHttpServer())
            .post('/groups/')
            .set('Authorization', utils.authorizationJWT)
            .send(createEmptyNameGroup)
            .set('Content-Type', 'application/json')
            .expect(400);
    });

    // Test de la modification d'un groupe
    it('/groups/uuid (PUT)', () => {
        modifyGroup.uuid = createGroupUuid;
        return request(app.getHttpServer())
            .put('/groups')
            .set('Authorization', utils.authorizationJWT)
            .send(modifyGroup)
            .expect(200)
            .then((response) => {
                const group: GroupDto = response.body;
                modifyGroup.uuid = group.uuid;
                expect(group).toEqual(modifyGroup);
            });
    });

    // Test de la suppression d'un groupe
    it('/groups/ (DELETE)', () => {
        return request(app.getHttpServer())
            .delete('/groups')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: createGroupUuid })
            .expect(200);
    });

    // Test si la suppréssion est bien effectuée
    it('/groups/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/groups/' + createGroupUuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'un groupe inexistant
    it('/groups/key/{key} - key inexistante (GET)', () => {
        return request(app.getHttpServer())
            .get('/groups/key/' + createGroup.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

});
