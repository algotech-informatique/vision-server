import { INestApplication } from '@nestjs/common';
import { gList1, gList2, gList3, gList4 } from '../fixtures/genericlists';
import { GenericListDto, PatchPropertyDto } from '@algotech-ce/core';
import { TestUtils } from '../utils';
import { GenericListValue } from '../../interfaces';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe('GenericListsController (e2e)', () => {
    const request = require('supertest');
    const _ = require('lodash');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    const createGenericList: GenericListDto = {
        key: 'new',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'Nouveau',
            },
            {
                lang: 'en-US',
                value: 'New',
            },
            {
                lang: 'es-ES',
                value: ''
            }
        ],
        protected: false,
        values: [
            {
                key: 'value1',
                value: [
                    {
                        lang: 'fr-FR',
                        value: 'Nouvelle valeur 1',
                    },
                    {
                        lang: 'en-US',
                        value: 'New value 1',
                    },
                    {
                        lang: 'es-ES',
                        value: ''
                    }
                ],
                index: 0,
            },
            {
                key: 'value2',
                value: [
                    {
                        lang: 'fr-FR',
                        value: 'Nouvelle valeur 2',
                    },
                    {
                        lang: 'en-US',
                        value: 'New value 2',
                    },
                    {
                        lang: 'es-ES',
                        value: ''
                    }
                ],
                index: 1,
            },
        ],
    };

    const modifyGenericList: GenericListDto = {
        uuid: '71c81d8e-f4cb-41b3-943e-023780c8e972',
        key: 'modif',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'modif',
            },
            {
                lang: 'en-US',
                value: 'modif',
            },
            {
                lang: 'es-ES',
                value: ''
            }
        ],
        protected: false,
        values: [],
    };

    const createEmptyKeyGenericList: GenericListDto = {
        uuid: '440e9579-5b6f-403c-ab7f-06fb33b7aa93',
        key: '',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'gList clé vide',
            },
            {
                lang: 'en-US',
                value: 'Empty key gList',
            },
            {
                lang: 'es-ES',
                value: ''
            }
        ],
        protected: false,
        values: [
            {
                key: 'key1',
                value: [
                    {
                        lang: 'fr-FR',
                        value: 'clé 1',
                    },
                    {
                        lang: 'en-US',
                        value: 'key 1',
                    },
                    {
                        lang: 'es-ES',
                        value: ''
                    }
                ],
                index: 0,
            },
            {
                key: 'key2',
                value: [
                    {
                        lang: 'fr-FR',
                        value: 'clé 2',
                    },
                    {
                        lang: 'en-US',
                        value: 'key 2',
                    },
                    {
                        lang: 'es-ES',
                        value: ''
                    }
                ],
                index: 1,
            },
        ],
    };

    const createExistingKeyGenericList: GenericListDto = {
        key: 'phones',
        displayName: [],
        protected: false,
        values: [],
    };

    const createWrongGenericList = {
        displayName: [],
        protected: false,
        values: [],
    };

    const createEmptyKeyValueGenericList: GenericListDto = {
        uuid: '440e9579-5b6f-403c-ab7f-06fb33b7aa93',
        key: 'glist',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'gList clé vide',
            },
            {
                lang: 'en-US',
                value: 'Empty key gList',
            },
            {
                lang: 'es-ES',
                value: ''
            }
        ],
        protected: false,
        values: [
            {
                key: '',
                value: [
                    {
                        lang: 'fr-FR',
                        value: 'clé 1',
                    },
                    {
                        lang: 'en-US',
                        value: 'key 1',
                    },
                    {
                        lang: 'es-ES',
                        value: ''
                    }
                ],
                index: 0,
            },
        ],
    };

    const modifyGenericListValues: PatchPropertyDto[] = [{
        op: 'add',
        path: '/values/[?]',
        value: {
            key: 'salesman',
            value: [
                {
                    lang: 'fr-FR',
                    value: 'Commercial',
                },
                {
                    lang: 'en-US',
                    value: 'Salesman',
                },
                {
                    lang: 'es-ES',
                    value: ''
                }
            ],
        },
    }];

    /* const modifyGenericListValuesByKey = {
        values: [
            {
                key: 'head',
                value: [
                    {
                        lang: 'fr-FR',
                        value: 'Directeur modif',
                    },
                    {
                        lang: 'en-US',
                        value: 'Head modif',
                    },
                ],
            },
        ],
    }; */

    const value: GenericListValue = {
        key: 'head',
        value: [
            {
                lang: 'fr-FR',
                value: 'Directeur',
            },
            {
                lang: 'en-US',
                value: 'Head',
            },
            {
                lang: 'es-ES',
                value: ''
            }
        ],
        index: 0,
    };

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, 'genericlists', request);
        });
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test de la recuperation de toutes les gLists
    it('/glists (GET)', () => {
        return request(app.getHttpServer())
            .get('/glists')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const gLists: object[] = utils.clearDates(response.body);
                expect(gLists).toEqual(jasmine.arrayContaining([
                    gList1,
                    gList2,
                    gList3,
                    gList4,
                ]));
            });
    });

    // Test de la recuperation d'une gList
    it('/glists/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/glists/' + gList1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const gList: object = utils.clearDates(response.body);
                expect(gList).toEqual(gList1);
            });
    });

    // Test de la recuperation d'une gList par clé
    it('/glists/key/keyList (GET)', () => {
        return request(app.getHttpServer())
            .get('/glists/key/' + gList1.key)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const gList: object = utils.clearDates(response.body);
                expect(gList).toEqual(gList1);
            });
    });

    // Test de la recuperation d'une gListValue par clé
    it('/glists/key/keyList/keyValue (GET)', () => {
        return request(app.getHttpServer())
            .get('/glists/key/' + gList1.key + '/' + gList1.values[0].key)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect((utils.clearDates(response.body) as GenericListValue)).toEqual(value);
            });
    });

    // Test de la recuperation d'une gListValue inexistante
    it('/glists/key/keyList/keyValue (GET)', () => {
        return request(app.getHttpServer())
            .get('/glists/key/' + gList1.key + '/keyFake')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'une gList inexistante
    it('/glists/uuid - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/glists/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'une gList par cle inexistante
    it('/glists/key/keyList - cle inexistante (GET)', () => {
        return request(app.getHttpServer())
            .get('/glists/key/fakekey')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de l'ajout d'une gList
    it('/glists (POST)', () => {
        return request(app.getHttpServer())
            .post('/glists')
            .set('Authorization', utils.authorizationJWT)
            .send(createGenericList)
            .expect(201)
            .then(response => {
                const gList: any = utils.clearDates(response.body);
                createGenericList.uuid = gList.uuid;
                expect(gList).toEqual(createGenericList);
            });
    });

    // Test de l'ajout d'une gList avec cle existante
    it('/glists - cle existante (POST)', () => {
        return request(app.getHttpServer())
            .post('/glists')
            .set('Authorization', utils.authorizationJWT)
            .send(createExistingKeyGenericList)
            .expect(400);
    });

    // Test de l'ajout d'une gList avec cle non renseignee
    it('/glists - cle non renseignee (POST)', () => {
        return request(app.getHttpServer())
            .post('/glists')
            .set('Authorization', utils.authorizationJWT)
            .send(createWrongGenericList)
            .set('Content-Type', 'application/json')
            .expect(400);
    });

    // Test de l'ajout d'une gList avec cle vide
    it('/glists - cle vide (POST)', () => {
        return request(app.getHttpServer())
            .post('/glists')
            .set('Authorization', utils.authorizationJWT)
            .send(createEmptyKeyGenericList)
            .set('Content-Type', 'application/json')
            .expect(400);
    });

    // Test de l'ajout d'une gList avec cle valeur vide
    it('/glists -  cle valeur vide (POST)', () => {
        return request(app.getHttpServer())
            .post('/glists')
            .set('Authorization', utils.authorizationJWT)
            .send(createEmptyKeyValueGenericList)
            .set('Content-Type', 'application/json')
            .expect(400);
    });

    // Test de la modification d'une gList
    it('/glists (PUT)', () => {
        return request(app.getHttpServer())
            .put('/glists')
            .set('Authorization', utils.authorizationJWT)
            .send(modifyGenericList)
            .expect(200)
            .then(response => {
                expect((utils.clearDates(response.body) as object)).toEqual(modifyGenericList);
            });
    });

    // Test de la modification des values d'une gList
    it('/glists/uuid (PATCH)', () => {
        return request(app.getHttpServer())
            .patch('/glists/' + gList1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send(modifyGenericListValues)
            .expect(200)
            .then(response => {
                expect(response.body as PatchPropertyDto).toEqual(modifyGenericListValues);
            });
    });

    // Test de la modification des values d'une gList par cle
    // it('/glists/key/keyList (PATCH)', () => {
    //     return request(app.getHttpServer())
    //         .patch('/glists/key/' + gList2.key)
    //         .set('Authorization', utils.authorizationJWT)
    //         .send(modifyGenericListValuesByKey)
    //         .expect(200)
    //         .then(response => {
    //             expect((response.body as GenericList).values).toEqual(modifyGenericListValuesByKey.values);
    //         });
    // });

    // Test de la suppression d'une gList
    it('/glists (DELETE)', () => {
        return request(app.getHttpServer())
            .delete('/glists')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: gList2.uuid })
            .expect(200);
    });

    // cache
    it('/GET glists/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .get('/glists/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({ uuid: modifyGenericList.uuid }),
                        jasmine.objectContaining({ uuid: createGenericList.uuid }),
                    ]),
                    deleted: [gList2.uuid],
                });
            });
    });

    // Test si la suppression est bien effectuée
    it('/glists/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/gLists/' + gList2.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

});