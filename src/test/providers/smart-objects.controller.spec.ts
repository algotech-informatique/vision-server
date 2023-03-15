import { SmartObjectsController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { CacheDto, DeleteDto, GeoSettingsDto, PatchPropertyDto,
    SmartObjectDto, SmartObjectTreeQuery } from '@algotech/core';
import { createSmartObectGeo, createSmartObject, receiveSmartModel, removeSmartObectGeoLayer,
    searchByDoc, smartObject1, smartObject3, smartObject4, smartObjectMultiple,
    smartObjectMultipleUpdate, smartObjectsRecursive, smartObjectsTree } from '../fixtures/smartobjects';
import * as _ from 'lodash';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('SmartObjectsController', () => {

    let smartObjectsController: SmartObjectsController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartObjectsController = app.get<SmartObjectsController>(SmartObjectsController);

        await utils.Before(app, 'smartobjects', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(smartObjectsController).toBeDefined();
    });

    // FIND //

    it('/FIND (uuid)', (done) => {
        smartObjectsController.find(identity, smartObject1.uuid).subscribe({
            next: (res: SmartObjectDto | {}) => {
                expect(res).toMatchPartialObject(smartObject1);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object list not loaded');
            },
        });
    });

    it('/FIND (by Uuids)', (done) => {
        const type: 'include' | 'exclude' = 'include';
        const uuids = {uuids: [smartObject3.uuid, smartObject4.uuid], type };
        smartObjectsController.findByUuids(identity, 0, 2, uuids ).subscribe({
            next: (res: SmartObjectDto[]) => {
                expect(res).toMatchPartialArray([smartObject4, smartObject3]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find by uuids');
            },
        });
    });

    it('/FIND (subdoc - deep)', done => {
        smartObjectsController.findWithSubdoc(identity, smartObjectsRecursive[0].uuid, '1', '').subscribe({
            next: (res: SmartObjectDto[]) => {
                expect(res).toMatchPartialObject(
                    [
                        smartObjectsRecursive[0],
                        smartObjectsRecursive[1],
                    ],
                );
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not found');
            },
        });
    });

    it('/FIND (subdoc)', done => {
        smartObjectsController.findByDoc(identity, 'ca48c07e-06c5-11ea-9a9f-362b9e155667').subscribe({
            next: (res: SmartObjectDto[]) => {
                expect(res).toMatchPartialObject([searchByDoc]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not found');
            },
        });
    });

    it('/FIND (all)', done => {
        smartObjectsController.findAll(identity).subscribe({
            next: (res: SmartObjectDto[] | {}) => {
                expect((res as SmartObjectDto[]).length).toEqual(39);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Objects not found');
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
        smartObjectsController.treeSearch(identity, query ).subscribe({
            next: (res: SmartObjectDto[]) => {
                expect(res).toMatchPartialObject(smartObjectsTree);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not found');
            },
        });
    });

    // CREATE //

    it('/CREATE', done => {
        smartObjectsController.create(identity, _.cloneDeep(createSmartObject)).subscribe({
            next: (res: SmartObjectDto) => {
                createSmartObject.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSmartObject);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not correctly created');
            },
        });
    });

    it('/FIND (model)', (done) => {
        smartObjectsController.findByModel(identity, createSmartObject.modelKey, null, null, '', '').subscribe({
            next: (res: SmartObjectDto[] | {}) => {
                expect(res).toMatchPartialObject([receiveSmartModel]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('/ISUNIQUE', done => {
        smartObjectsController.unique(identity, createSmartObject).subscribe({
            next: (res: {}) => {
                expect(res).toStrictEqual({ unique: true});
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not is unique');
            },
        });
    });

    it('/CREATE (with so properties multiple)', done => {
        smartObjectsController.create(identity, _.cloneDeep(smartObjectMultiple)).subscribe({
            next: (res: SmartObjectDto) => {
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
        smartObjectsController.update(identity, _.cloneDeep(smartObjectMultipleUpdate)).subscribe({
            next: (res: SmartObjectDto[]) => {
                expect(res).toMatchPartialObject(smartObjectMultipleUpdate);
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
        smartObjectsController.patchProperty(identity, smartObjectMultiple.uuid, patches).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject(patches);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not patch');
            },
        });
    });

    it('/CREATE (with so geo)', (done) => {
        smartObjectsController.create(identity, _.cloneDeep(createSmartObectGeo)).subscribe({
            next: (res: SmartObjectDto) => {
                createSmartObectGeo.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSmartObectGeo);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not correctly created');
            },
        });
    });

    it('/FINDBYGEOLOCATION (geo)', (done) => {
        smartObjectsController.findByGeolocation(identity, 'geolocation', createSmartObectGeo.modelKey, 'layer-key-1', 'NAME',
            'test-local-1', 1, 0, 3, '', '' ).subscribe({
            next: (res: SmartObjectDto[] | {}) => {
                expect(res).toMatchPartialObject([createSmartObectGeo]);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not find');
            },
        });
    });

    it('/FINDBYGEOLOCATION (with error - geo)', () => {
        expect (() => smartObjectsController.findByGeolocation(identity, 'geolocation', createSmartObectGeo.modelKey, 'layer-key-1', 'NAME',
            'test-local-1', 1, 'a', 3, '', '' ),
        ).toThrowError(new BadRequestException('skip or limit is not a number!'));
    });

    it('/GEOSETTINGS', (done) => {
        const poiSetting: GeoSettingsDto = {
            modelKey: createSmartObectGeo.modelKey,
            propKeyFilter: 'NAME',
            propValueFilter: 'test-local-1',
        };
        smartObjectsController.geoSettings(identity, 'layer-key-1', poiSetting).subscribe({
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
        smartObjectsController.removeFromLayer(identity, 'layer-key-1').subscribe({
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
        smartObjectsController.find(identity, createSmartObectGeo.uuid).subscribe({
            next: (res: SmartObjectDto | {}) => {
                expect(res).toMatchPartialObject(removeSmartObectGeoLayer);
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object geo not correctly removed layer');
            },
        });
    });

    it('/DELETE', (done) => {
        const data: DeleteDto = {
            uuid: createSmartObject.uuid,
        };
        smartObjectsController.deleteSM(identity, data).subscribe({
            next: (res: boolean) => {
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not correctly created');
            },
        });
    });

    it('/DELETE (with so properties multiple)', (done) => {
        const data: DeleteDto = {
            uuid: smartObjectMultiple.uuid,
        };
        smartObjectsController.deleteSM(identity, data).subscribe({
            next: (res: boolean) => {
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not correctly deleted');
            },
        });
    });

    it('/DELETE (with so geo)', (done) => {
        const data: DeleteDto = {
            uuid: createSmartObectGeo.uuid,
        };
        smartObjectsController.deleteSM(identity, data).subscribe({
            next: (res: boolean) => {
                done();
            },
            error: (err) => {
                return Promise.reject('Smart Object not deleted');
            },
        });
    });

    it(`/CACHE`, (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        smartObjectsController.cache(identity, d.toISOString() ).subscribe({
            next: (res: CacheDto) => {
                expect(res).toEqual({
                    updated: [],
                    deleted: [
                        createSmartObject.uuid,
                        smartObjectMultiple.uuid,
                        createSmartObectGeo.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Smart models cache not found');
            },
        });
    });

    it(`/CACHE  (with uuid)`, (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        const data = { uuid: [createSmartObject.uuid] };
        smartObjectsController.cacheWithId(identity, data, d.toISOString() ).subscribe({
            next: (res: CacheDto) => {
                expect(res).toEqual({
                    updated: [],
                    deleted: [
                        createSmartObject.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Smart models cache not found');
            },
        });
    });

});