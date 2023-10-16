import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import {
    smartObject1,
    smartObject3,
    smartObject4,
    smartObject8,
    smartObject7,
    smartObject9,
    smartObject5,
    smartObject6,
    smartObjectR,
    smartObjectRW,
    smartObjectX,
    smartObjectsRecursive,
    smartObjectRecursiveDeleted,
    smartObject2,
    receiveSmartModel,
    natureType,
    user,
    smartObjectAllTypes,
} from '../fixtures/smartobjects';
import { SmartObjectDto, SmartObjectSearchDto, PatchPropertyDto, SmartPropertyObjectDto, ProcessMonitoringSearchDto, SearchSODto } from '@algotech-ce/core';
import { TestUtils } from '../utils';
import * as path from 'path';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

const createSmartObject: SmartObjectDto =
{
    modelKey: 'NATURE',
    properties: [
        {
            key: 'name',
            value: 'MAINT/PROD',
        }, {
            key: 'type',
            value: null,
        },
    ],
    skills: {},
};

const createUser: SmartObjectDto =
{
    modelKey: 'USER',
    properties: [
        {
            key: 'FIRSTNAME',
            value: 'Jean',
        },
        {
            key: 'LASTNAME',
            value: 'Dupon',
        },
        {
            key: 'EMAIL',
            value: 'jean.dupon@mail.fr',
        },
        {
            key: 'LOGIN',
            value: 'jean.dupon',
        },
        {
            key: 'PASSWORD',
            value: '123456',
        },
        {
            key: 'CREDENTIALS_TYPE',
            value: null,
        },
        {
            key: 'CREDENTIALS_TOKEN',
            value: null,
        },
        {
            key: 'EXPIRATION_DATE',
            value: null,
        },
    ],
    skills: {},
};

export const createSmartObjectR: SmartObjectDto = {
    modelKey: 'PERMISSION_TEST_R',
    properties: [
        {
            key: 'PROP_R1',
            value: 'PROP_R1_VALUE',
        }, {
            key: 'PROP_R2',
            value: 'PROP_R2_VALUE',
        },
    ],
    skills: {},
};

export const createSmartObjectRW: SmartObjectDto = {
    modelKey: 'PERMISSION_TEST_RW',
    properties: [
        {
            key: 'PROP_RW1',
            value: 'PROP_RW1_VALUE_R_PERMISSION',
        }, {
            key: 'PROP_RW2',
            value: 'PROP_RW2_VALUE',
        },
    ],
    skills: {},
};

export const createSmartObjectX: SmartObjectDto = {
    modelKey: 'PERMISSION_TEST_X',
    properties: [
        {
            key: 'PROP_X1',
            value: 'PROP_X1_VALUE',
        }, {
            key: 'PROP_X2',
            value: 'PROP_X2_VALUE',
        },
    ],
    skills: {},
};

describe('SmartObjects', () => {

    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll((done) => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, ['smartobjects', 'monitoring'], request).then(() => {
                done();
            });
        });
    });

    // Finalisation
    afterAll((done) => {
        return utils.AfterArray(['smartobjects', 'monitoring']).then(() => {
            done();
        })
    });

    it('/GET unique values of a property with skip 1 and limit 1 order asc', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/values/USER?property=LASTNAME&skip=1&limit=2&order=1')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(['Smith'])
            })
    });

    it('/GET unique values of a property with skip 0 and limit 3 order desc', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/values/USER?property=LASTNAME&skip=0&limit=3&order=-1')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(['Smith', 'Ford', 'Bonaldi'])
            })
    });

    it('/GET unique values of a property that stats with b', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/values/USER?property=LASTNAME&skip=0&limit=5&order=1&startwith=b')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(['Bonaldi'])
            })
    });

    // Test la récupération d'un smart object par id
    it('/GET smart-objects/id - id existant (GET)', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObject1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(smartObject1);
            });
    });

    // Test la récupération d'un smart object par id + subdoc (test récursivité et so supprimé) (deep)
    it(`/GET smart-objects/subdoc&deep`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/subdoc/' + smartObjectsRecursive[0].uuid + '?deep=1')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining(
                    [
                        smartObjectsRecursive[0],
                        smartObjectsRecursive[1],
                    ],
                ));
                expect(utils.clearDates(response.body) as object).not.toEqual(jasmine.arrayContaining([smartObjectRecursiveDeleted]));
            });
    });

    // Test la récupération d'un smart object par id + subdoc !deep
    it(`/GET smart-objects/subdoc`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/subdoc/' + smartObjectsRecursive[0].uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining([smartObjectsRecursive[1]]));
            });
    });

    // Test l'échec de la récupération d'un smart objects par id
    it('/GET smart-objects/id  - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test la récupération de plusieurs smart object (uuid)
    it(`/POST smart-objects/subdoc?deep=1`, () => {
        return request(app.getHttpServer())
            .post('/smart-objects/subdoc?deep=1')
            .set('Authorization', utils.authorizationJWT)
            .send([
                smartObject1.uuid,
                smartObjectsRecursive[0].uuid,
            ])
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(
                    jasmine.arrayContaining([
                        smartObject1,
                        _.assign(_.cloneDeep(receiveSmartModel), { properties: [] }), // reject properties (not allow for group)
                        natureType,
                        user,
                        smartObjectsRecursive[0],
                        smartObjectsRecursive[1],
                    ]
                    ));
            });
    });

    // Test la récupération de plusieurs smart object (uuid)
    it(`/POST smart-objects/subdoc?deep=0`, () => {
        return request(app.getHttpServer())
            .post('/smart-objects/subdoc?deep=0')
            .set('Authorization', utils.authorizationJWT)
            .send([
                smartObject1.uuid,
            ])
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual([
                    smartObject1,
                    _.assign(_.cloneDeep(receiveSmartModel), { properties: [] }), // reject properties (not allow for group)
                    user
                ]
                );
            });
    });

    // Test la récupération de plusieurs smart object (uuid)
    it(`/POST smart-objects/subdoc?deep=1&excludeRoot=1`, () => {
        return request(app.getHttpServer())
            .post('/smart-objects/subdoc?deep=1&excludeRoot=1')
            .set('Authorization', utils.authorizationJWT)
            .send([
                smartObjectsRecursive[0].uuid,
            ])
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual([
                    smartObjectsRecursive[1],
                ]);
            });
    });

    // Test la création d'un smart object
    it('/POST smart-objects', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(createSmartObject)
            .expect(201)
            .then((response) => {
                const smartObject: SmartObjectDto = utils.clearDates(response.body);
                createSmartObject.uuid = smartObject.uuid;
                expect(smartObject).toEqual(createSmartObject);
            },
            );
    });

    // Test la création d'un smart object
    it('/POST smart-objects', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(smartObject2)
            .expect(201)
            .then((response) => {
                const smartObject: SmartObjectDto = utils.clearDates(response.body);
                smartObject2.uuid = smartObject.uuid;
                expect(smartObject).toEqual(smartObject2);
            },
            );
    });

    // Test la récupération des smart-objects par modelKey
    it(`/GET smart-objects/model`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/NATURE')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual(jasmine.arrayContaining([
                    createSmartObject,
                ]));
            });
    });



    // Tests la supppression d'un smart-object
    it('/DELETE smart-objects', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: smartObject1.uuid })
            .expect(200);
    });

    // Test que le smart object supprimé a été retiré de l'équipement
    it('/GET smart-objects/id - Test que le smart object supprimé a été retiré de l\'équipement', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObject2.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const soResult: SmartObjectDto = utils.clearDates(response.body) as SmartObjectDto;
                const findProperty = _.find(soResult.properties, (prop: SmartPropertyObjectDto) => prop.key === 'DOCUMENTS');
                expect(findProperty.value).toEqual([]);
            });
    });

    // Test que le smart object composé a été supprimé
    it('/GET smart-objects/id - Test que le smart object composé a été supprimé', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/5594b3cf-8d93-4da2-a3f0-e65277a9afhh')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test que le smart object composé (deep) a été supprimé
    it('/GET smart-objects/id - Test que le smart object composé (deep) a été supprimé', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/5594b3cf-8d93-4da2-a3f0-e65277a9accc')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test que le smart object associé n'a pas été supprimé
    it('/GET smart-objects/id - Test que le smart object associé n\'est pas supprimé', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/d36b26dd-1bcc-4b67-b632-9edd0b312bca')
            .set('Authorization', utils.authorizationJWT)
            .expect(200);
    });

    // Test l'échec de la récupération d'un smart object supprimmé par uuid
    it('/GET smart-objects/uuid - uuid inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObject1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test la récupération des smart-objects avec la pagination + tri (descendant)
    it(`/GET smart-objects/model/modelKey?skip=2&limit=2&sort=APP_KEY&order=desc`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/' + smartObject3.modelKey + '?skip=2&limit=2&sort=APP_KEY&order=desc')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual(jasmine.arrayContaining([
                    smartObject3,
                    smartObject4,
                ]));
            },
            );
    });

    // Test la récupération des smart-objects avec la pagination + tri (ascendant)
    it(`/GET smart-objects/model/modelKey?skip=2&limit=2&sort=APP_KEY&order=asc`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/' + smartObject3.modelKey + '?skip=2&limit=2&sort=APP_KEY&order=asc')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual(jasmine.arrayContaining([
                    smartObject5,
                    smartObject8,
                ]));
            },
            );
    });

    // Test la récupération des smart-objects avec la pagination sans tri
    it(`/GET smart-objects/model/modelKey?skip=2&limit=2`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/' + smartObject3.modelKey + '?skip=1&limit=4')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect((utils.clearDates(response.body) as object[]).length).toEqual(3);
            },
            );
    });

    // Test la récupération des smart-objects avec la pagination + tri (limit = 100 et order = 1 : valeur par défaut)
    it(`/GET smart-objects/model/modelKey?skip=0&sort=NAME`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/' + smartObject3.modelKey + '?skip=0&sort=NAME')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual(jasmine.arrayContaining([
                    smartObject7,
                    smartObject4,
                    smartObject3,
                    smartObject9,
                    smartObject8,
                    smartObject5,
                    smartObject6,
                ]));
            },
            );
    });

    // Test la récupération des smart-objects avec la pagination sans tri (skip = 0 : valeur par défault )
    it(`/GET smart-objects/model/modelKey?limit=1`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/' + smartObject3.modelKey + '?limit=1')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect((utils.clearDates(response.body) as object[]).length).toEqual(1);
            },
            );
    });

    // Test la récupération des smart-objects avec la pagination + tri (skip = 0 et limit = 100 : valeur par défaut)
    it(`/GET smart-objects/model/modelKey?sort=NAME&order=asc`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/' + smartObject3.modelKey + '?sort=NAME&order=asc')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual(jasmine.arrayContaining([
                    smartObject7,
                    smartObject4,
                    smartObject3,
                    smartObject9,
                    smartObject8,
                    smartObject5,
                    smartObject6,
                ]));
            },
            );
    });

    // Test d'erreur quand skip n'est pas un number
    it(`/GET smart-objects/model/modelKey?skip=aze&limit=1&sort=appKey&order=asc`, () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/' + smartObject3.modelKey + '?skip=aze&limit=1&sort=appKey&order=asc')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    //
    // Tests sur les permissions des SOs
    //

    /*
    Tests GET
    */

    // Test la récupération d'un smart object en R => R
    it('/GET smart-objects/id - Permissions R', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObjectR.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(smartObjectR);
            });
    });

    // Test la récupération d'un smart object en RW => R
    it('/GET smart-objects/id - Permissions RW', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObjectRW.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(smartObjectRW);
            });
    });

    // Test la récupération d'un smart object en X
    it('/GET smart-objects/id - Permissions X', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObjectX.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(403);
    });

    // Test la récupération d'un smart object en R => R
    it('/GET smart-objects/id - Permissions R', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObjectR.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(smartObjectR);
            });
    });

    // Test la récupération d'un smart object en RW => R
    it('/GET smart-objects/id - Permissions RW', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObjectRW.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(smartObjectRW);
            });
    });

    // Test la récupération d'un smart object en X
    it('/GET smart-objects/id - Permissions X', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObjectX.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(403);
    });


    /*
        Test route search
     */

    // Test de recherche d'un smart object en RW
    it('/GET smart-objects/search/APPLICATION?property=APP_KEY&value=preferences - Permissions RW', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/search/APPLICATION?property=APP_KEY&value=preferences')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult).toEqual(jasmine.arrayContaining([
                    smartObject9,
                ]));
            });
    });

    // Test de recherche d'un smart object en R
    it('/GET smart-objects/search/PERMISSION_TEST_R?property=PROP_R1&value=PROP_R1_VALUE - Permissions R', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/search/PERMISSION_TEST_R?property=PROP_R1&value=PROP_R1_VALUE')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult).toEqual(jasmine.arrayContaining([
                    smartObjectR,
                ]));
            });
    });

    // Test de recherche d'un smart object en X
    it('/GET smart-objects/search/PERMISSION_TEST_X?property=PROP_X1&value=PROP_X1_VALUE - Permissions X', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/search/PERMISSION_TEST_X?property=PROP_X1&value=PROP_X1_VALUE')
            .set('Authorization', utils.authorizationJWT)
            .expect(403);
    });

    /*
    Test POST
    */

    // Test la création d'un smart object en RW - propriete manquante remplacée par default value
    it('/POST smart-objects - RW (propriete manquante remplacée par defaultValue)', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(createSmartObjectRW)
            .expect(201)
            .then((response) => {
                const smartObject: SmartObjectDto = utils.clearDates(response.body);
                createSmartObjectRW.uuid = smartObject.uuid;
                createSmartObjectRW.properties = [
                    {
                        key: 'PROP_RW1',
                        value: 'PROP_RW1_VALUE',
                    },
                    {
                        key: 'PROP_RW2',
                        value: 'PROP_RW2_VALUE',
                    },
                ];
                expect(smartObject).toEqual(createSmartObjectRW);
            });
    });

    //à migrer sur studio
    // Test la création d'un smart object en RW - propriete obligatoire non renseignée et defaultValue non renseignée
    /* it('/POST smart-objects - Permission RW (propriete obligatoire non renseignée et defaultValue non renseignée)', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(_.assign(createSmartObjectRW, { properties: [] }))
            .expect(403);
    }); */

    // Test la création d'un smart object en R
    it('/POST smart-objects - Permission R', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(createSmartObjectR)
            .expect(403);
    });

    // Test la création d'un smart object en X
    it('/POST smart-objects - Permission X', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(createSmartObjectX)
            .expect(403);
    });

    // cache
    it('/GET smart-objects/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .get('/smart-objects/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    updated: jasmine.arrayContaining([
                        jasmine.objectContaining({ uuid: 'a14dc702-9a0e-46ec-bc1f-5adfd3ff7e4a' }), // object containing smartObject1
                        jasmine.objectContaining({ uuid: 'a14dc702-9a0e-46ec-bc1f-5adfd3ff7e4e' }), // object containing smartObject1
                    ]),
                    deleted: jasmine.arrayContaining([smartObject1.uuid]),
                });
            });
    });

    /*
    Test PATCH
    */

    /* // Test du PATCH d'une property de smart-object en RW => R (property)
    it('/PATCH smart-objects - permission R', () => {
        return request(app.getHttpServer())
            .patch('/smart-objects/' + smartObjectRW.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                {
                    op: 'replace',
                    path: '/properties/[key:PROP_R1]/value',
                    value: 'PROP_R1_VALUE2',
                },
            ])
            .expect(403);
    }); */

    // Test du PATCH d'une property de smart-object en R
    it('/PATCH smart-objects - permission R', () => {
        return request(app.getHttpServer())
            .patch('/smart-objects/' + smartObjectR.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                {
                    op: 'replace',
                    path: '/skills/',
                    value: 'PROP_R1_VALUE2',
                },
            ])
            .expect(403);
    });

    // Test du PATCH d'un smart-object en R
    it('/PATCH smart-objects - permission R', () => {
        return request(app.getHttpServer())
            .patch('/smart-objects/' + smartObjectR.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                {
                    op: 'replace',
                    path: '/properties/[key:PROP_R1]/value',
                    value: 'PROP_R1_VALUE2',
                },
            ])
            .expect(403);
    });

    // Test du PATCH d'un smart-object en RW
    it('/PATCH smart-objects - permission RW', () => {
        return request(app.getHttpServer())
            .patch('/smart-objects/' + smartObject2.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                {
                    op: 'replace',
                    path: '/properties/[key:NAME]/value',
                    value: '3019-MFG-LO3',
                },
            ])
            .expect(200);
    });

    // Test du PATCH d'un smart-object en X
    it('/PATCH smart-objects - permission X', () => {
        return request(app.getHttpServer())
            .patch('/smart-objects/' + smartObjectX.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                {
                    op: 'replace',
                    path: '/skills/',
                    value: 'PROP_X1_VALUE2',
                },
            ])
            .expect(403);
    });
    // Test du PATCH d'une property de smart-object en X
    it('/PATCH smart-objects - permission X', () => {
        return request(app.getHttpServer())
            .patch('/smart-objects/' + smartObjectX.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                {
                    op: 'replace',
                    path: '/properties/[key:PROP_X1]/value',
                    value: 'PROP_X1_VALUE2',
                },
            ])
            .expect(403);
    });

    /* // Test l'échec des patchs
    it('/PATCH smart-objects', () => {
        return request(app.getHttpServer())
            .patch('/smart-objects/' + smartModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetError])
            .expect(400);
    });

    // Test l'échec des patchs
    it('/PATCH smart-objects', () => {
        return request(app.getHttpServer())
            .patch('/smart-objects/' + smartModel1.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetNoRespectModel])
            .expect(400);
    }); */

    /*
    Test DELETE
    */

    // Tests la supppression d'un smart-object en RW
    it('/DELETE smart-objects - Permission RW', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: smartObjectRW.uuid })
            .expect(200);
    });

    // Test l'échec de la récupération d'un smart object supprimmé par uuid
    it('/GET smart-objects/uuid - uuid inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + smartObjectRW.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Tests la supppression d'un smart-object en R
    it('/DELETE smart-objects - Permission R', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: smartObjectR.uuid })
            .expect(403);
    });

    // Tests la supppression d'un smart-object en X
    it('/DELETE smart-objects - Permission X', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: smartObjectX.uuid })
            .expect(403);
    });

    // Unique
    it('/POST new user: check unique', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/unique')
            .set('Authorization', utils.authorizationJWT)
            .send(createUser)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({ unique: true });
            });
    });

    it('/POST new user (unique): success', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(createUser)
            .expect(201);
    });

    it('/POST dupplicate user: check not unique', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/unique')
            .set('Authorization', utils.authorizationJWT)
            .send(createUser)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({ unique: false });
            });
    });

    it('/POST dupplicate user (not unique): failed', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(createUser)
            .expect(400);
    });

    it('/POST dupplicate user, change one part of unique key (unique): success', () => {
        createUser.uuid = '0eeeccbd-3620-42b8-91c2-2dc574db7178';
        _.find(createUser.properties, (p) => p.key === 'LOGIN').value = 'jean.dupon2';
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(createUser)
            .expect(201);
    });

    it('/PATCH user (unique): success', () => {
        const patch: PatchPropertyDto[] = [{
            op: 'replace',
            path: '/properties/[key:PASSWORD]/value',
            value: '123457',
        }];
        return request(app.getHttpServer())
            .patch('/smart-objects/' + createUser.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send(patch)
            .expect(200);
    });

    it('/PATCH user (not unique): failed', () => {
        const patch: PatchPropertyDto[] = [{
            op: 'replace',
            path: '/properties/[key:LOGIN]/value',
            value: 'jean.dupon',
        }];
        return request(app.getHttpServer())
            .patch('/smart-objects/' + createUser.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send(patch)
            .expect(400);
    });

    it('/GET check previous transaction was cancelled', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + createUser.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const login = _.find(response.body.properties, (p) => p.key === 'LOGIN').value;
                expect(login).toEqual('jean.dupon2');
            });
    });

    it('/UPDATE user (unique): success', () => {
        return request(app.getHttpServer())
            .put('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(createUser)
            .expect(200);
    });

    it('/UPDATE', () => {
        return request(app.getHttpServer())
            .put('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(smartObject7)
            .expect(200);
    });

    it('/UPDATE', () => {
        return request(app.getHttpServer())
            .put('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(smartObject8)
            .expect(200);
    });

    // cache after delete
    it('/POST smart-objects/cache', () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return request(app.getHttpServer())
            .post('/smart-objects/cache/' + d.toISOString())
            .set('Authorization', utils.authorizationJWT)
            .send({
                uuid: [smartObject7.uuid],
            })
            .expect(201)
            .then(response => {
                expect(response.body).toEqual({
                    updated: [jasmine.objectContaining({ uuid: smartObject7.uuid })],
                    deleted: [],
                });
            });
    });

    it('/UPDATE user (not unique): failed', () => {
        _.find(createUser.properties, (p) => p.key === 'LOGIN').value = 'jean.dupon';
        return request(app.getHttpServer())
            .put('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(createUser)
            .expect(400);
    });

    it('/POST smart-objects/import (file empty)', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/import')
            .set('Authorization', utils.authorizationJWT)
            .field('uuid', 'abbfcb18-3dcd-469b-83c7-db97a2bfe820')
            .field('replaceExisting', 'true')
            .field('modelKey', 'USER')
            .field('options', '{}')
            .expect(400);
    });

    it('/POST smart-objects/import (field missing)', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/import')
            .set('Authorization', utils.authorizationJWT)
            .field('uuid', 'abbfcb18-3dcd-469b-83c7-db97a2bfe820')
            .field('replaceExisting', 'true')
            .field('options', '{}')
            .expect(400);
    });

    it('/POST smart-objects/import (model unknown)', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/import')
            .set('Authorization', utils.authorizationJWT)
            .field('uuid', 'abbfcb18-3dcd-469b-83c7-db97a2bfe820')
            .field('replaceExisting', 'true')
            .field('modelKey', 'USERRRR')
            .field('options', '{}')
            .attach('file', path.join(__dirname, '../files/import_empty.csv'))
            .expect(400);
    });

    it('/POST smart-objects/import (empty)', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/import')
            .set('Authorization', utils.authorizationJWT)
            .field('uuid', 'abbfcb18-3dcd-469b-83c7-db97a2bfe820')
            .field('replaceExisting', 'true')
            .field('modelKey', 'USER')
            .field('options', '{}')
            .attach('file', path.join(__dirname, '../files/import_empty.csv'))
            .expect(201)
            .then(response => {
                expect(response.body).toEqual({ success: true });
            });
    });

    it('/POST monitoring check empty', () => {
        const processSearch: ProcessMonitoringSearchDto = {
            byUuids: [
                'abbfcb18-3dcd-469b-83c7-db97a2bfe820'
            ],
        }
        return timer(500).pipe(
            mergeMap(() => request(app.getHttpServer())
                .post('/monitoring/import/so')
                .set('Authorization', utils.sadminauthorizationJWT)
                .send(processSearch)
                .expect(201)
                .then((response) => {
                    expect(response.body[0].result).toEqual({
                        nbUpdated: 0,
                        nbInserted: 0,
                        nbIgnored: 0
                    })
                })
            )
        ).toPromise();
    });

    it('/POST smart-objects/import (insert + update)', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/import')
            .set('Authorization', utils.authorizationJWT)
            .field('uuid', 'ebbcb17b-5596-46e9-8cdb-a468300befe9')
            .field('replaceExisting', 'true')
            .field('modelKey', 'USER')
            .field('options', '{}')
            .attach('file', path.join(__dirname, '../files/import.csv'))
            .expect(201)
            .then(response => {
                expect(response.body).toEqual({ success: true });
            });
    });

    it('/POST monitoring check insert + update', () => {
        const processSearch: ProcessMonitoringSearchDto = {
            byUuids: [
                'ebbcb17b-5596-46e9-8cdb-a468300befe9'
            ],
        }
        return timer(500).pipe(
            mergeMap(() => request(app.getHttpServer())
                .post('/monitoring/import/so')
                .set('Authorization', utils.sadminauthorizationJWT)
                .send(processSearch)
                .expect(201)
                .then((response) => {
                    expect(response.body[0].result).toEqual({
                        nbUpdated: 1,
                        nbInserted: 1,
                        nbIgnored: 0
                    })
                })
            )
        ).toPromise();
    });

    it('/POST smart-objects/import (update)', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/import')
            .set('Authorization', utils.authorizationJWT)
            .field('uuid', '8eabbd6c-8737-47eb-9724-23415849b3f9')
            .field('replaceExisting', 'true')
            .field('modelKey', 'USER')
            .field('options', '{}')
            .attach('file', path.join(__dirname, '../files/import.csv'))
            .expect(201)
            .then(response => {
                expect(response.body).toEqual({ success: true });
            });
    });

    it('/POST monitoring check update', () => {
        const processSearch: ProcessMonitoringSearchDto = {
            byUuids: [
                '8eabbd6c-8737-47eb-9724-23415849b3f9'
            ],
        }
        return timer(500).pipe(
            mergeMap(() => request(app.getHttpServer())
                .post('/monitoring/import/so')
                .set('Authorization', utils.sadminauthorizationJWT)
                .send(processSearch)
                .expect(201)
                .then((response) => {
                    expect(response.body[0].result).toEqual({
                        nbUpdated: 2,
                        nbInserted: 0,
                        nbIgnored: 0
                    })
                })
            )
        ).toPromise();
    });

    it('/POST smart-objects/import (nothing)', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/import')
            .set('Authorization', utils.authorizationJWT)
            .field('uuid', '4aed2b43-ee8c-4f02-97cb-b8f9f89147f9')
            .field('replaceExisting', 'false')
            .field('modelKey', 'USER')
            .field('options', '{}')
            .attach('file', path.join(__dirname, '../files/import.csv'))
            .expect(201)
            .then(response => {
                expect(response.body).toEqual({ success: true });
            });
    });

    it('/POST monitoring check nothing', () => {
        const processSearch: ProcessMonitoringSearchDto = {
            byUuids: [
                '4aed2b43-ee8c-4f02-97cb-b8f9f89147f9'
            ],
        }
        return timer(500).pipe(
            mergeMap(() => request(app.getHttpServer())
                .post('/monitoring/import/so')
                .set('Authorization', utils.sadminauthorizationJWT)
                .send(processSearch)
                .expect(201)
                .then((response) => {
                    expect(response.body[0].result).toEqual({
                        nbUpdated: 0,
                        nbInserted: 0,
                        nbIgnored: 2
                    })
                })
            )
        ).toPromise();
    });

    it('/POST smart-object with date', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send(smartObjectAllTypes)
            .expect(201);
    });

    // check
    it('/POST search SO - criteria gte datetime & search', () => {
        const sos: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'gte', value: '2029-01-01T00:00:00Z', type: 'date' } },
            ],
            order: [],
            searchParameters: {
                search: '2032-01-01'
            }
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(sos)
            .expect(201)
            .then((response) => {
                expect(response.body.length).toBe(1);
            });
    });

    // patch all types
    it('/PATCH smart-object with date', () => {
        return request(app.getHttpServer())
            .patch('/smart-objects/' + smartObjectAllTypes.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([{
                'op': 'replace',
                'path': '/properties/[key:DATE]/value',
                'value': '2022-01-01T00:00:00Z'
            }, {
                'op': 'replace',
                'path': '/properties/[key:STRING_M]/value',
                'value': [
                    'text', 
                    'forsearch ~\ (:-)) test'
                ]
            }])
            .expect(200);
    });

    // check
    it('/POST search SO - criteria gte date & search (special car)', () => {
        const sos: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'lte', value: '2023-01-01T00:00:00Z', type: 'date' } },
            ],
            order: [],
            searchParameters: {
                search: 'forsearch ~\ (:-)) test'
            }
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(sos)
            .expect(201)
            .then((response) => {
                expect(response.body.length).toBe(1);
            });
    });
});