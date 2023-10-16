import { INestApplication } from '@nestjs/common';
import { listSnModel, createSnModel } from '../fixtures/snmodels';
import { TestUtils } from '../utils';
import { SnModelDto } from '@algotech-ce/core';
import { SnModel } from '../../interfaces';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

const snModelTest1: SnModelDto = {
    uuid: 'bfd4aaff-e4d0-c7ff-70b5-d1fb8b4c1a00',
    key: 'testModel01',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Test Model-01',
        },
        {
            lang: 'en-US',
            value: 'test model-01',
        },
        {
            lang: 'es-ES',
            value: 'test model-01'
        }
    ],
    type: 'workflow',
    versions: [],
};

const snModelTest2: SnModelDto = {
    uuid: '3b01859b-d9cf-f650-8187-aa46ac487663',
    key: 'testModel02',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Test Model-02',
        },
        {
            lang: 'en-US',
            value: 'test model en-02',
        },
        {
            lang: 'es-ES',
            value: 'test model es-02'
        }
    ],
    type: 'workflow',
    versions: [
        {
            createdDate: '2020-05-19T11:13:45.511Z',
            deleted: false,
            uuid: 'e8dfa860-01ff-11ea-8d71-362b9e155661',
            creatorUuid: 'd36b26dd-1bcc-4b67-b632-9edd0b312bca',
            view: {
                box: [
                    {
                        id: '80e08d5a-790c-48ca-a152-02a29f134008',
                        displayName: 'box - 11',
                        canvas: {
                            x: 200,
                            y: 400,
                        },
                        open: true,
                    },
                ],
                groups: [],
                nodes: [],
                comments: [],
                drawing: {
                    lines: [],
                    elements: [],
                },
                options: {
                    variables: [
                        {
                            key: 'varKey1',
                            value: 'val1',
                            type: 'so:varType1'
                        }
                    ]
                },
                id: '727fce50-cd9d-d57b-168c-006846f20fa1',
            },
        },
    ],
};

const NewSnModel: SnModelDto = {
    uuid: '60227e1a-4506-428f-a02d-11c549adfe8d',
    key: 'New-test-001',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
        {
            lang: 'en-US',
            value: 'test model en-02',
        },
        {
            lang: 'es-ES',
            value: 'test model es-02'
        },
    ],
    type: 'workflow',
    versions: [],
};

const duplicateNewSnModel: SnModelDto = {
    uuid: '8f3eba64-9e6f-11ea-bb37-0242ac130002',
    key: 'testModel02',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel Test',
        },
        {
            lang: 'en-US',
            value: 'test model en-02',
        },
        {
            lang: 'es-ES',
            value: 'test model es-02'
        },
    ],
    type: 'workflow',
    versions: [],
};

const modifySnModel: SnModelDto = {
    uuid: 'c0a9e078-7a48-4a05-8a90-a382226fc636',
    key: 'New-test-001-MODIFY',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Nouveau SnModel (Test) - Fr',
        },
        {
            lang: 'en-US',
            value: 'New SnModel (Test) - En',
        },
    ],
    type: 'workflow',
    versions: [],
};

describe('SnModels', () => {
    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, ['snsynoticsearches', 'monitoring', 'snmodels'], request);
        });
    });

    // Finalisation
    afterAll(() => {
        return utils.AfterArray(['snsynoticsearches', 'monitoring', 'snmodels']);
    });

    // recherche fullText
    it('/smartnodes/search fullText (POST)', () => {
        return request(app.getHttpServer())
            .post('/smartnodes/search?skip=0&limit=10')
            .set('Authorization', utils.authorizationJWT)
            .send({
                search: 'Model en-'
            })
            .expect(201)
            .then((response) => {
                const results: any = utils.clearDates(response.body);
               
                expect(results[0]).toMatchObject({
                    key: 'testModel02',
                    snModelUuid: '3b01859b-d9cf-f650-8187-aa46ac487663',
                    snViewUuid: '727fce50-cd9d-d57b-168c-006846f20fa1',
                    snVersionUuid: 'e8dfa860-01ff-11ea-8d71-362b9e155661',
                    elementUuid: '',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Test Model-02'
                        },
                        {
                            lang: 'en-US',
                            value: 'test model en-02'
                        },
                        {
                            lang: 'es-ES',
                            value: 'test model es-02'
                        }
                    ],
                    type: 'view',
                    connectedTo:[
                             'so:varType1',
                        ],
                    texts: '¤testModel02¤Test Model-02¤test model en-02¤test model es-02¤varKey1¤so:varType1¤'
                });
            });
    });

    // recherche fullText
    it('/smartnodes/search fullText exactValue: true and caseSensitive = true (POST)', () => {
        return request(app.getHttpServer())
            .post('/smartnodes/search?skip=0&limit=10')
            .set('Authorization', utils.authorizationJWT)
            .send({
                search: 'Test Model-02',
                exactValue: true,
                caseSensitive: true
            })
            .expect(201)
            .then((response) => {
                const results: any = utils.clearDates(response.body);
               
                expect(results[0]).toMatchObject({
                    key: 'testModel02',
                    snModelUuid: '3b01859b-d9cf-f650-8187-aa46ac487663',
                    snViewUuid: '727fce50-cd9d-d57b-168c-006846f20fa1',
                    snVersionUuid: 'e8dfa860-01ff-11ea-8d71-362b9e155661',
                    elementUuid: '',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Test Model-02'
                        },
                        {
                            lang: 'en-US',
                            value: 'test model en-02'
                        },
                        {
                            lang: 'es-ES',
                            value: 'test model es-02'
                        }
                    ],
                    type: 'view',
                    connectedTo:[
                             'so:varType1',
                        ],
                    texts: '¤testModel02¤Test Model-02¤test model en-02¤test model es-02¤varKey1¤so:varType1¤'
                });
            });
    });

    // recherche fullText
    it('/smartnodes/search fullText exactValue: true and caseSensitive = true no results (POST)', () => {
        return request(app.getHttpServer())
            .post('/smartnodes/search?skip=0&limit=10')
            .set('Authorization', utils.authorizationJWT)
            .send({
                search: 'Model en-',
                exactValue: true,
                caseSensitive: true
            })
            .expect(201)
            .then((response) => {
                const results: any = utils.clearDates(response.body);
               
                expect(results.length).toEqual(0);
            });
    });

    // recherche par référence
    it('/smartnodes/search référence (POST)', () => {
        return request(app.getHttpServer())
            .post('/smartnodes/search?skip=0&limit=10')
            .set('Authorization', utils.authorizationJWT)
            .send({
                refrence: ['so:varType1']
            })
            .expect(201)
            .then((response) => {
                const results: any = utils.clearDates(response.body);
                
                expect(results[0]).toMatchObject({
                    key: 'testModel02',
                    snModelUuid: '3b01859b-d9cf-f650-8187-aa46ac487663',
                    snViewUuid: '727fce50-cd9d-d57b-168c-006846f20fa1',
                    snVersionUuid: 'e8dfa860-01ff-11ea-8d71-362b9e155661',
                    elementUuid: '',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Test Model-02'
                        },
                        {
                            lang: 'en-US',
                            value: 'test model en-02'
                        },
                        {
                            lang: 'es-ES',
                            value: 'test model es-02'
                        }
                    ],
                    type: 'view',
                    connectedTo:[
                        'so:varType1',
                   ],
                    texts: '¤testModel02¤Test Model-02¤test model en-02¤test model es-02¤varKey1¤so:varType1¤'
                });
            });
    });

    // Test recuperation SnModels
    it('/smartnodes (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartnodes')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const list: object[] = utils.clearDates(response.body);
                expect(list).toEqual(jasmine.arrayContaining(listSnModel));
            });
    });

    // Test recuperation SnModels
    // it('/smartnodes (GET) skip/limit', () => {
    //     return request(app.getHttpServer())
    //         .get('/smartnodes?skip=1&limit=2')
    //         .set('Authorization', utils.authorizationJWT)
    //         .expect(200)
    //         .then((response) => {
    //             expect(utils.clearDates(response.body[0])).toEqual(
    //                 listSnModel[listSnModel.length - 1]);
    //         });
    // });

    // Test recuperation SnModels by uuid
    it('/smartnodes/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartnodes/' + snModelTest1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const list: object[] = utils.clearDates(response.body);
                expect(list).toEqual(snModelTest1);
            });
    });

    // Test de la recuperation d'un SnModel inexistant
    it('/smartnodes/uuid - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartnodes/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'un snModel par clé
    it('/smartnodes/key/{key} (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartnodes/key/' + snModelTest2.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const model: object = utils.clearDates(response.body);
                expect(model).toEqual(snModelTest2);
            });
    });

    // Test de l'ajout d'un SnModel
    it('/smartnodes/ (POST)', () => {
        return request(app.getHttpServer())
            .post('/smartnodes/')
            .set('Authorization', utils.authorizationJWT)
            .send(NewSnModel)
            .expect(201)
            .then((response) => {
                const model: any = utils.clearDates(response.body);
                NewSnModel.uuid = model.uuid;
                expect(model).toEqual(NewSnModel);
            });
    });

    

    // Test de l'ajout d'un SnModel avec key existante
    it('/smartnodes/ - key existant (POST)', () => {
        return request(app.getHttpServer())
            .post('/smartnodes/')
            .set('Authorization', utils.authorizationJWT)
            .send(duplicateNewSnModel)
            .expect(400);
    });

    // Test de la modification d'un SnModel
    it('/smartnodes/uuid (PUT)', () => {
        return request(app.getHttpServer())
            .put('/smartnodes')
            .set('Authorization', utils.authorizationJWT)
            .send(modifySnModel)
            .expect(200)
            .then((response) => {
                const model: object = utils.clearDates(response.body);
                expect(model).toEqual(modifySnModel);
            });
    });

    // Test de la suppression d'un SnModel
    it('/smartnodes/ (DELETE)', () => {
        return request(app.getHttpServer())
            .delete('/smartnodes')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: createSnModel.uuid })
            .expect(200);
    });

    // cache
    it('/GET smartnodes/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .get('/smartnodes/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({ uuid: NewSnModel.uuid }),
                    ]),
                    deleted: [createSnModel.uuid],
                });
            });
    });

    // Test si la suppréssion est bien effectuée
    it('/smartnodes/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartnodes/' + createSnModel.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'un SnModel inexistant
    it('/smartnodes/key/{key} - key inexistante (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartnodes/key/NOKEY')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de recuperation uniquement des versions actives
    it('/smartnodes/{uuid} - version actives (GET)', () => {
        return request(app.getHttpServer())
            .get('/smartnodes/' + snModelTest2.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const model: SnModel = utils.clearDates(response.body);
                expect(model.versions.length).toEqual(1);
            });
    });

});
