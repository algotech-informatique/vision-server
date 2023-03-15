import { INestApplication } from '@nestjs/common';
import { listTag, createListTag, modifyDuplicateTagKey } from '../fixtures/tags';
import { TestUtils } from '../utils';
import { TagListDto } from '@algotech/core';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe('TagsController (e2e)', () => {
    const request = require('supertest');
    let app: INestApplication;

    const modifyTagList: TagListDto = {
        uuid: 'e8dfa860-01ff-11ea-8d71-362b9e155667',
        key: 'liste-1',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'Liste 1',
            },
            {
                lang: 'en-US',
                value: 'List 1',
            },
            {
                lang: 'es-ES',
                value: 'Lista 1',
            },
        ],
        modelKeyApplication: ['armoire', 'machine'],
        applyToDocuments: false,
        applyToImages: false,
        tags: [],
    };

    const createEmptyKeyTagList: any = {
        uuid: 'e8dfa860-01ff-11ea-8d71-362b9e155667',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'Liste 1',
            },
            {
                lang: 'en-US',
                value: 'List 1',
            },
            {
                lang: 'es-ES',
                value: 'Lista 1',
            },
        ],
        modelKeyApplication: ['armoire', 'machine'],
        applyToDocuments: false,
        applyToImages: false,
        tags: [],
    };

    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
        app = nestApp;
        return utils.Before(app, 'tags', request);});
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test de la recuperation de toutes les listes
    it('/tags (GET)', () => {
        return request(app.getHttpServer())
            .get('/tags')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const list: object[] = utils.clearDates(response.body);
                expect(list).toEqual(jasmine.arrayContaining([listTag]));
            });
    });

    // Test de la recuperation d'une liste de tags
    it('/tags/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/tags/' + listTag.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const list: object = utils.clearDates(response.body);
                expect(list).toEqual(listTag);
            });
    });

    // Test de la recuperation d'une liste inexistant
    it('/tags/uuid - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/tags/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'une liste par clé
    it('/tags/key/{key} (GET)', () => {
        return request(app.getHttpServer())
            .get('/tags/key/' + listTag.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const group: object = utils.clearDates(response.body);
                expect(group).toEqual(listTag);
            });
    });

    // Test de l'ajout d'une liste
    it('/tags/ (POST)', () => {
        return request(app.getHttpServer())
            .post('/tags/')
            .set('Authorization', utils.authorizationJWT)
            .send(createListTag)
            .expect(201)
            .then((response) => {
                const list: any = utils.clearDates(response.body);
                createListTag.uuid = list.uuid;
                expect(list).toEqual(createListTag);
            });
    });

    // Test de l'ajout d'une liste de tags avec key existante
    it('/tags/ - nom existant (POST)', () => {
        return request(app.getHttpServer())
            .post('/tags/')
            .set('Authorization', utils.authorizationJWT)
            .send(createListTag)
            .expect(400);
    });

    // Test de l'ajout d'une liste de tags avec key vide
    it('/tags/ - nom vide (POST)', () => {
        return request(app.getHttpServer())
            .post('/tags/')
            .set('Authorization', utils.authorizationJWT)
            .send(createEmptyKeyTagList)
            .set('Content-Type', 'application/json')
            .expect(400);
    });

    // Test de la modification d'une liste de tags
    it('/tags/uuid (PUT)', () => {
        return request(app.getHttpServer())
            .put('/tags')
            .set('Authorization', utils.authorizationJWT)
            .send(modifyTagList)
            .expect(200)
            .then((response) => {
                const group: object = utils.clearDates(response.body);
                expect(group).toEqual(modifyTagList);
            });
    });

    // Test de la modification d'une liste de tags contenant une key dupliquée et présente dans une autre liste
    it('/tags/uuid (PUT duplicate key)', () => {
        return request(app.getHttpServer())
            .put('/tags')
            .set('Authorization', utils.authorizationJWT)
            .send(modifyDuplicateTagKey)
            .expect(400);
    });

    // Test de la suppression d'une liste de tag
    it('/tags/ (DELETE)', () => {
        return request(app.getHttpServer())
            .delete('/tags')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: listTag.uuid })
            .expect(200);
    });

    // cache
    it('/GET tags/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .get('/tags/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({uuid: createListTag.uuid}),
                    ]),
                    deleted: [listTag.uuid],
                });
            });
    });

    // Test si la suppréssion est bien effectuée
    it('/tags/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/tags/' + listTag.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'une liste de tag inexistant
    it('/tags/key/{key} - key inexistante (GET)', () => {
        return request(app.getHttpServer())
            .get('/tags/key/' + listTag.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

});
