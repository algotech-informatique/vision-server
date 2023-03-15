import { GenericListsController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { createGList, gList1, gList2, gList3, gList4, patchPush, patchSet, updateGList } from '../fixtures/glist';
import { CacheDto, GenericListDto, GenericListValueDto, PatchPropertyDto } from '@algotech/core';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('GListsController', () => {
    let glistsController: GenericListsController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        glistsController = app.get<GenericListsController>(GenericListsController);

        await utils.Before(app, 'genericlists', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(glistsController).toBeDefined();
    });

    it ('/FINDALL', (done) => {
        glistsController.findAll( identity).subscribe({
            next: (res: GenericListDto[]) => {
                expect(res).toMatchPartialArray([gList1, gList2, gList3, gList4 ]);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not found');
            },
        });
    });

    it ('/FIND', (done) => {
        glistsController.findOne(identity, gList1.uuid ).subscribe({
            next: (res: GenericListDto) => {
                expect(res).toMatchPartialObject(gList1);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not found');
            },
        });
    });

    it ('/FIND (by key)', (done) => {
        glistsController.findByKey(identity, gList1.key).subscribe({
            next: (res: GenericListDto ) => {
                expect(res).toMatchPartialObject(gList1);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not found');
            },
        });
    });

    it ('/FIND (by key - value)', (done) => {
        glistsController.findByKeyValue(identity, gList1.key, 'head').subscribe({
            next: (res: GenericListValueDto ) => {
                expect(res).toMatchPartialObject(gList1.values[0]);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not found');
            },
        });
    });

    it ('/CREATE', (done) => {
        glistsController.create(identity, createGList).subscribe({
            next: (res: GenericListDto) => {
                createGList.uuid = res.uuid;
                expect(res).toMatchPartialObject(createGList);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not created');
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateGList.uuid = createGList.uuid;
        glistsController.update(identity, updateGList).subscribe({
            next: (res: GenericListDto) => {
                expect(res).toMatchPartialObject(updateGList);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not updated');
            },
        });
    });

    it ('/PATCH', (done) => {
        glistsController.patchProperty(identity, createGList.uuid, [patchSet, patchPush] ).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject([patchSet, patchPush]);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not updated');
            },
        });
    });

    it ('/DELETE', (done) => {
        glistsController.delete(identity, {uuid: createGList.uuid}).subscribe({
            next: (res: boolean) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not created');
            },
        });
    });

    it(`/CACHE`, (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        glistsController.cache(identity, d.toISOString() ).subscribe({
            next: (res: CacheDto) => {
                expect(res).toEqual({
                    updated: [],
                    deleted: [
                        createGList.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Generic List cache not found');
            },
        });
    });

});