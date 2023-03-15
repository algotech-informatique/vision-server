import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { TestUtils } from '../utils';
import {
    equipmentnoLink, documentNoLink, restoredUser1, restoredUser2, restoredUser3,
    child1, child2, child3, child4, child5, child6, child7, nature, documentNoLinkNature
} from '../fixtures/database';
import { empty } from 'rxjs';
import { SearchSODto, SysQueryDto } from '@algotech/core';

declare const describe, expect, beforeAll, afterAll, it: any;

describe('database', () => {

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
        return Promise.all([
            utils.After('smartobjects'),
            utils.After('monitoring'),
        ]).then(() => {
            done();
        });
    });

    it('/DELETE smart-objects/sos by modelKey', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/sos?modelKey=USER')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send({
                uuid: 'DB',
                empty: true
            })
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual('5');
            });
    });

    it('/GET smart-objects/:uuid get object with link deleted prop USER multiple = false', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + documentNoLink.uuid)
            .set('Authorization', utils.sadminauthorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(documentNoLink);
            });
    });

    it('/DELETE smart-objects/sos by uuids object nature linked to Document', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/sos')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send({
                uuid: 'DB',
                uuids: [nature.uuid]
            })
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual('1');
            });
    });

    it('/POST search smart-objects/s modelKey = DOCUMENT with Nature link deleted', () => {
        const search: SearchSODto = {
            modelKey: 'DOCUMENT',
            searchParameters: {
                filter: [{
                    key: 'NATURE',
                    value: {
                        value: '',
                        type: 'so:NATURE',
                        criteria: 'isNull',
                    }
                }]
            }
        }
        return request(app.getHttpServer())
            .post('/search/smart-objects/')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(jasmine.arrayContaining([documentNoLinkNature]));
            });
    });

    it('/GET smart-objects/:uuid get object with link deleted prop NATURE multiple = false', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + documentNoLinkNature.uuid)
            .set('Authorization', utils.sadminauthorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(documentNoLinkNature);
            });
    });

    it('/DELETE smart-objects/sos by uuids', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/sos')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send({
                uuid: 'DB',
                uuids: [documentNoLink.uuid]
            })
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual('1');
            });
    });

    it('/GET smart-objects/:uuid get object with link deleted prop DOCUMENt multiple = true', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + equipmentnoLink.uuid)
            .set('Authorization', utils.sadminauthorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(equipmentnoLink);
            });
    });

    it('/POST search smart-objects/s deleted modelKey = DOCUMENT', () => {
        return request(app.getHttpServer())
            .post('/search/smart-objects/')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send({
                modelKey: 'DOCUMENT',
                deleted: true
            })
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual([documentNoLinkNature]);
            });
    });

    it('/POST restore smart-objects/so/restore by uuids', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/so/restore')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send(['d36b26dd-1bcc-4b67-b632-9edd0b312bca'])
            .expect(201)
            .then((response) => {
                expect(response.text).toEqual('true');
            });
    });

    it('/GET smart-objects/:uuid get object with link deleted prop DOCUMENt multiple = true', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + restoredUser1.uuid)
            .set('Authorization', utils.sadminauthorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object).toEqual(restoredUser1);
            });
    });

    it('/POST restore smart-objects/so/restore by modelKey', () => {
        return request(app.getHttpServer())
            .post('/smart-objects/so/restore?modelKey=USER')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send([])
            .expect(201)
            .then((response) => {
                expect(response.text).toEqual('true');
            });
    });

    it('/GET smart-objects/:modelKey get object by modelKey', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/USER')
            .set('Authorization', utils.sadminauthorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual(jasmine.arrayContaining([restoredUser1, restoredUser2, restoredUser3]));
            });
    });

    it('/DELETE smart-objects/sos real delete deleted only modelKey =  child', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/sos?modelKey=child&deleted=true')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send({
                uuid: 'DB',
                uuids: [],
                real: true,
                empty: true
            })
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual('1');
            });
    });

    it('/GET smart-objects/:modelKey get object by modelKey', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/child')
            .set('Authorization', utils.sadminauthorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual(jasmine.arrayContaining([
                    child1, child2, child3, child4, child5, child6, child7
                ]));
            });
    });

    //Count
    it('/POST count updateDate < 2023-01-12T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                {
                    "key": "sys:updateDate",
                    "value": {
                        "criteria": "lt",
                        "value": "2023-01-12T11:17",
                        "type": "DATE"
                    }
                }],
            order: [{
                key: 'sys:createdDate',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/smart-objects/count')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                expect(response.text).toEqual('1');
            });
    });

    it('/POST count createdDate > 2020-01-11T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                {
                    "key": "sys:createdDate",
                    "value": {
                        "criteria": "gt",
                        "value": "2020-01-11T11:17",
                        "type": "DATE"
                    }
                }],
            order: [{
                key: 'sys:createdDate',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/smart-objects/count')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                expect(response.text).toEqual('1');
            });
    });

    it('/POST count search o', () => {
        const search: SearchSODto = {
            modelKey: 'USER',
            filter: [],
            order: []
        }

        return request(app.getHttpServer())
            .post('/smart-objects/count?search=o')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                expect(response.text).toEqual('3');
            });
    });

    it('/DELETE smart-objects/sos real delete by modelKey = child & deleted = true', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/sos?modelKey=child&deleted=true')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send({
                uuid: 'DB',
                uuids: [],
                empty: true,
                real: true
            })
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual('0');
            });
    });

    it('/DELETE smart-objects/sos delete all DB', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/sos')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send({
                uuid: 'empty',
                uuids: [],
                real: true,
                empty: true
            })
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual('39');
            });
    });

    it('/POST search smart-objects/s deleted all Models', () => {
        return request(app.getHttpServer())
            .post('/search/smart-objects/')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send({
                allModels: true,
            })
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual([]);
            });
    });

    it('/POST search smart-objects/s deleted all deleted Models', () => {
        return request(app.getHttpServer())
            .post('/search/smart-objects/')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send({
                allModels: true,
                deleted: true
            })
            .expect(201)
            .then((response) => {
                expect(utils.clearDates(response.body) as object[]).toEqual([]);
            });
    });

    //Count
    it('/POST count', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                {
                    "key": "sys:updateDate",
                    "value": {
                        "criteria": "lt",
                        "value": "2030-01-11T11:17",
                        "type": "DATE"
                    }
                }],
            order: [{
                key: 'sys:createdDate',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/smart-objects/count')
            .set('Authorization', utils.sadminauthorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                expect(response.text).toEqual('0');
            });
    });

});