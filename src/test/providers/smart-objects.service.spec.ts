import { INestApplication } from '@nestjs/common';
import { IdentityRequest } from '../../interfaces';
import { SmartObjectsBaseService, SmartObjectsHead } from '../../providers';
import { TestUtils } from '../utils';
import { createSmartObectGeo, createSmartObject, createSOProperties, receiveSmartModel, removeSmartObectGeoLayer, searchByDoc, smartObject1,
    smartObject3, smartObject4, smartObject5, smartObject6, smartObject7, smartObject8, smartObject9,
    smartObjectMultiple, smartObjectMultipleUpdate, smartObjectR, smartObjectRecursiveDeleted,
    smartObjectsRecursive, smartObjectsTree} from '../fixtures/smartobjects';
import { SmartObject } from '../../interfaces';
import { GeoSettingsDto, PatchPropertyDto, SmartObjectDto, SmartObjectSearchDto,
    SmartObjectTreeQuery } from '@algotech-ce/core';
import * as _ from 'lodash';

declare const describe, jasmine, beforeAll, afterAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

const identityError: IdentityRequest = {
    login: null,
    groups: [''],
    customerKey: null,
};

describe('SmartObjectsHead', () => {
    let smartObjectsHead: SmartObjectsHead;
    const utils: TestUtils = new TestUtils();
    const request = require('supertest');
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartObjectsHead = app.get<SmartObjectsHead>(SmartObjectsHead);

        await utils.Before(app, 'smartobjects', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(smartObjectsHead).toBeDefined();
    });

    // FIND //

    it('/FIND (with error - no uuid)', done => {
        const data = {identity, uuid: 'no-uuid-found' };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                return Promise.reject('Smart Object find');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (all)', done => {
        const data = {identity };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                const sos: SmartObjectDto[] = utils.clearDates(res) as SmartObjectDto[];
                expect(sos.length).toMatchPartialObject(31);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not correctly total ');
            },
        });
    });

    it('/FIND (uuid)', done => {
        const data = {identity, uuid: smartObject1.uuid };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject(smartObject1);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not found');
            },
        });
    });

    it('/FIND (by Uuids - include)', (done) => {
        const type: 'include' | 'exclude' = 'include';
        const data = {identity, uuids: [smartObject3.uuid, smartObject4.uuid], skip: 0, limit: 2, type };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialArray([smartObject4, smartObject3]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find by uuids');
            },
        });
    });

    it('/FIND (by Uuids - exclude)', (done) => {
        const type: 'include' | 'exclude' = 'exclude';
        const data = {identity, uuids: [smartObject3.uuid, smartObject4.uuid], skip: 0, limit: 1, type };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialArray([]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find by uuids');
            },
        });
    });

    it('/FIND (subDoc - deep)', done => {
        const data = {identity, subdoc: true, uuid: smartObjectsRecursive[0].uuid, deep: true };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject(
                    [
                        smartObjectsRecursive[0],
                        smartObjectsRecursive[1],
                    ],
                );
                expect(utils.clearDates(res) as object).not.toEqual(jasmine.arrayContaining([smartObjectRecursiveDeleted]));
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('/FIND (subdoc)', done => {
        const data = {identity, subdoc: true, uuid: smartObjectsRecursive[0].uuid };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([smartObjectsRecursive[0]]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it(`/FIND  (smart-objects/model/modelKey?skip=2&limit=2&sort=APP_KEY&order=desc)`, (done) => {
        const data = {identity, modelKey: smartObject3.modelKey, skip: 2, limit: 2, order: 'desc', sort: 'APP_KEY' };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([smartObject3, smartObject4]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it(`/FIND (smart-objects/model/modelKey?skip=2&limit=2&sort=APP_KEY&order=asc)`, (done) => {
        const data = {identity, modelKey: smartObject3.modelKey, skip: 2, limit: 2, order: 'asc', sort: 'APP_KEY' };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([smartObject8, smartObject5]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it(`/FIND (smart-objects/model/modelKey?skip=2&limit=2)`, (done) => {
        const data = {identity, modelKey: smartObject3.modelKey, skip: 1, limit: 4 };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                const sos: SmartObjectDto[] = _.isArray(res) ? _.map(res, (rs) => rs as SmartObjectDto) : [];
                expect(sos.length).toBe(3);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it(`/FIND (smart-objects/model/modelKey?skip=0&sort=NAME)`, (done) => {
        const data = {identity, modelKey: smartObject3.modelKey, skip: 0, sort: 'NAME' };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialArray([
                    smartObject9,
                    smartObject8,
                    smartObject7,
                    smartObject6,
                    smartObject5,
                    smartObject4,
                    smartObject3,
                ]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it(`/FIND (smart-objects/model/modelKey?limit=1)`, (done) => {
        const data = {identity, modelKey: smartObject3.modelKey, limit: 1 };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                const sos: SmartObjectDto[] = _.isArray(res) ? _.map(res, (rs) => rs as SmartObjectDto) : [];
                expect(sos.length).toBe(1);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it(`/FIND (smart-objects/model/modelKey?sort=NAME&order=asc)`, (done) => {
        const data = {identity, modelKey: smartObject3.modelKey, sort: 'NAME', order: 'asc' };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialArray([smartObject7,
                    smartObject4,
                    smartObject3,
                    smartObject9,
                    smartObject8,
                    smartObject5,
                    smartObject6,
                ]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('/FIND (smart-objects/search/PERMISSION_TEST_R?property=PROP_R1&value=PROP_R1_VALUE - Permissions R)', (done) => {
        const data = {identity, modelKey: 'PERMISSION_TEST_R', property: 'PROP_R1', value: 'PROP_R1_VALUE' };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([smartObjectR]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('/FIND (by doc)', (done) => {
        const data = { identity,  docUuid: 'ca48c07e-06c5-11ea-9a9f-362b9e155667' };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([searchByDoc]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('Distinc by Uuid', done => {
        const data = {identity, docUuid: '3c731aa0-025c-4d70-8587-be8371194d0b' };
        smartObjectsHead.distinc(data).subscribe({
            next: (res: string[]) => {
                expect(res).toMatchPartialObject(['EQUIPMENT']);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    // TREE SEARCH //

    it('/TREESEARCH', (done) => {
        const query: SmartObjectTreeQuery = {
            inputUuids: [
                '698658de-789a-4b01-80e9-f1ecd8898500',
            ],
            depth: 1000,
            navigationStrategy: [
                {
                    modelKey: 'parent',
                    propertyKey: 'CHILDS',
                },
                {
                    modelKey: 'child',
                    propertyKey: 'CHILDS',
                },
            ],
        };
        const data = { identity, query };
        smartObjectsHead.treeSearch(data).subscribe({
            next: (res: SmartObject[]) => {
                expect(res).toMatchPartialObject(smartObjectsTree);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not found');
            },
        });
    });

    it('/TREESEARCH (with error)', (done) => {
        const query: SmartObjectTreeQuery = {
            inputUuids: [
            ],
            depth: 1000,
            navigationStrategy: [
                {
                    modelKey: 'parent',
                    propertyKey: 'CHILDS',
                },
            ],
        };
        const data = { identity, query };
        smartObjectsHead.treeSearch(data).subscribe({
            next: (res: SmartObject[]) => {
                expect(res).toMatchPartialObject([]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not found');
            },
        });
    });

    // CREATE //
    it('/CREATE', done => {
        const data = {identity, smartObject: _.cloneDeep(createSmartObject) as SmartObject };
        smartObjectsHead.create(data).subscribe({
            next: (res: SmartObject) => {
                createSmartObject.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSmartObject);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not correctly created');
            },
        });
    });

    it('/ISUNIQUE', done => {
        const data = {identity, smartObject: createSmartObject as SmartObject };
        smartObjectsHead.isUnique(data).subscribe({
            next: (res: {unique: boolean}) => {
                expect(res.unique).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not is unique');
            },
        });
    });

    it('/CREATE (with error)', (done) => {
        const data = {identity, smartObject: _.cloneDeep(createSmartObject) as SmartObject };
        smartObjectsHead.create(data).subscribe({
            next: (res: SmartObject) => {
                return Promise.reject('Smart Object created with duplicity');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/SEARCHBYFILTER', (done) => {
        const data = {identity, query: { modelKey: createSmartObject.modelKey}, skip: 0, limit: 3, sort: 'NAME', order: 'desc'  };
        smartObjectsHead.searchByFilter(data).subscribe({
            next: (res: SmartObject[]) => {
                expect(res).toMatchPartialObject([receiveSmartModel]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object search');
            },
        });
    });

    it('/FIND (model)', done => {
        const data = {identity, modelKey: createSmartObject.modelKey };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([receiveSmartModel]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('/CREATE (with so properties)', done => {
        const data = {identity, smartObject: _.cloneDeep(createSOProperties) as SmartObject };
        smartObjectsHead.create(data).subscribe({
            next: (res: SmartObject) => {
                createSOProperties.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSOProperties);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not correctly created');
            },
        });
    });

    it('/CREATE (with so properties multiple)', done => {
        const data = {identity, smartObject: _.cloneDeep(smartObjectMultiple) as SmartObject };
        smartObjectsHead.create(data).subscribe({
            next: (res: SmartObject) => {
                smartObjectMultiple.uuid = res.uuid;
                expect(res).toMatchPartialObject(smartObjectMultiple);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not correctly created');
            },
        });
    });

    it('/UPDATE (with so properties multiple)', (done) => {
        smartObjectMultipleUpdate.uuid = smartObjectMultiple.uuid;
        const data = {identity, changes: _.cloneDeep(smartObjectMultipleUpdate) as SmartObject};
        smartObjectsHead.update(data).subscribe({
            next: (res: SmartObject) => {
                const so = res as SmartObjectDto;
                expect(so).toMatchPartialObject(smartObjectMultipleUpdate);
                done();
            },
            error: (err) => {
                return Promise.reject('update unique so');
            },
        });
    });

    it('/PATCH  (with so properties multiple)', (done) => {
        const patches: PatchPropertyDto[] = [{
            op: 'replace',
            path: '/properties/[key:NAME]/value',
            value: 'PATCHED-3019-MFG-LO2-FLR',
        }];
        const data = {uuid: smartObjectMultiple.uuid, patches };
        const ws = {identity, data};
        smartObjectsHead.patch(ws).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject(patches);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not patch');
            },
        });
    });

    it('/CREATE (with so geo)', done => {
        const data = {identity, smartObject: _.cloneDeep(createSmartObectGeo) as SmartObject };
        smartObjectsHead.create(data).subscribe({
            next: (res: SmartObject) => {
                createSmartObectGeo.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSmartObectGeo);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not correctly created');
            },
        });
    });

    it('/FIND (geo)', done => {
        const data = {identity, skill: 'geolocation', modelKey: createSmartObectGeo.modelKey,
            layersKey: 'layer-key-1', property: 'NAME', value: 'test-local-1', skip: 0, limit: 3, set: 1 };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([createSmartObectGeo]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('/FIND (geo - no layer)', done => {
        const data = {identity, skill: 'geolocation', modelKey: createSmartObectGeo.modelKey,
            property: 'NAME', value: 'test-local-1', skip: 0, limit: 3, set: 1 };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([createSmartObectGeo]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('/FIND (geo - no set)', done => {
        const data = {identity, skill: 'geolocation', modelKey: createSmartObectGeo.modelKey,
            layersKey: 'layer-key-1', property: 'NAME', value: 'test-local-1', skip: 0, limit: 3, set: 0 };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('/GEOSETTINGS', (done) => {
        const poiSetting: GeoSettingsDto = {
            modelKey: createSmartObectGeo.modelKey,
            propKeyFilter: 'NAME',
            propValueFilter: 'test-local-1',
        };
        const data = { identity, layerKey: 'layer-key-1', poiSetting };
        smartObjectsHead.geoSettings(data).subscribe({
            next: (res: SmartObjectDto) => {
                expect(res).toMatchPartialObject(createSmartObectGeo);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object geoSettings poi not found');
            },
        });
    });

    it('/REMOVEFROMLAYER', (done) => {
        const data = { identity, layerKey: 'layer-key-1' };
        smartObjectsHead.removeFromLayer(data).subscribe({
            next: (res: {}) => {
                expect(res).toMatchPartialObject( {
                    acknowledged: true,
                    modifiedCount: 1,
                    upsertedId: null,
                    upsertedCount: 0,
                    matchedCount: 1
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object geoSettings poi not found');
            },
        });
    });

    it('/FIND (uuid - remove layer()', (done) => {
        removeSmartObectGeoLayer.uuid = createSmartObectGeo.uuid;
        const data = { identity, uuid: createSmartObectGeo.uuid };
        smartObjectsHead.find(data).subscribe({
            next: (res: SmartObject | SmartObject[] | SmartObjectDto[]) => {
                expect(res).toMatchPartialObject(removeSmartObectGeoLayer);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object geo not correctly removed layer');
            },
        });
    });

    it('/DELETE', done => {
        const data = {identity, uuid: createSmartObject.uuid };
        smartObjectsHead.delete(data).subscribe({
            next: (res: boolean) => {
                expect(res).toEqual(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not deleted');
            },
        });
    });

    it('/DELETE (with so properties)', done => {
        const data = {identity, uuid: createSOProperties.uuid };
        smartObjectsHead.delete(data).subscribe({
            next: (res: boolean) => {
                expect(res).toEqual(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not deleted');
            },
        });
    });

    it('/DELETE (with so properties multiple)', done => {
        const data = {identity, uuid: smartObjectMultiple.uuid };
        smartObjectsHead.delete(data).subscribe({
            next: (res: boolean) => {
                expect(res).toEqual(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not deleted');
            },
        });
    });

    it('/DELETE (with so geo)', (done) => {
        const data = {identity, uuid: createSmartObectGeo.uuid };
        smartObjectsHead.delete(data).subscribe({
            next: (res: boolean) => {
                expect(res).toEqual(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not deleted');
            },
        });
    });

    it('/CACHE', (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        const data = {identity, date: d.toISOString() };
        smartObjectsHead.cache(data).subscribe({
            next: (res: any) => {
                expect(res).toEqual({
                    updated: [],
                    deleted: [
                        createSmartObject.uuid,
                        createSOProperties.uuid,
                        smartObjectMultiple.uuid,
                        createSmartObectGeo.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('No Cache ');
            },
        });
    });

});