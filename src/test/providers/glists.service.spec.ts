import { GenericList, GenericListValue, IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { createGList, gList1, gList2, gList3, gList4, patchPush, patchSet, updateGList } from '../fixtures/glist';
import { GenericListsHead } from '../../providers';
import { CacheDto, PatchPropertyDto } from '@algotech-ce/core';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('GListsHead', () => {
    let glistsHead: GenericListsHead
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        glistsHead = app.get<GenericListsHead>(GenericListsHead);

        await utils.Before(app, 'genericlists', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(glistsHead).toBeDefined();
    });

    it ('/FINDALL', (done) => {
        glistsHead.getAll( { identity }).subscribe({
            next: (res: GenericList[]) => {
                expect(res).toMatchPartialArray([gList1, gList2, gList3, gList4 ]);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not found');
            },
        });
    });

    it ('/FIND', (done) => {
        const data = { identity, uuid: gList1.uuid };
        glistsHead.get(data).subscribe({
            next: (res: GenericList) => {
                expect(res).toMatchPartialObject(gList1);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not found');
            },
        });
    });

    it ('/FIND (with error)', (done) => {
        const data = { identity, uuid: 'no-uuid-exists' };
        glistsHead.get(data).subscribe({
            next: (res: GenericList) => {
                return Promise.reject('Generic lists not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/FIND (by key)', (done) => {
        const data = { identity, keyList: gList1.key };
        glistsHead.getByKey(data).subscribe({
            next: (res: GenericList | GenericListValue ) => {
                expect(res).toMatchPartialObject(gList1);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not found');
            },
        });
    });

    it ('/FIND (with error - nokey)', (done) => {
        const data = { identity, keyList: 'no-key-exists' };
        glistsHead.getByKey(data).subscribe({
            next: (res: GenericList | GenericListValue) => {
                return Promise.reject('Generic lists not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/FIND (by key - value)', (done) => {
        const data = { identity, keyList: gList1.key, keyValue: 'head' };
        glistsHead.getByKey(data).subscribe({
            next: (res: GenericList | GenericListValue ) => {
                expect(res).toMatchPartialObject(gList1.values[0]);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not found');
            },
        });
    });

    it ('/FIND (with error - no key)', (done) => {
        const data = { identity, keyList:  gList1.key, keyValue: 'no-value-exists' };
        glistsHead.getByKey(data).subscribe({
            next: (res: GenericList | GenericListValue) => {
                return Promise.reject('Generic lists not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/FIND (with error - nokey / no value)', (done) => {
        const data = { identity, keyList: 'no-key-exists', keyValue: 'no-value-exists' };
        glistsHead.getByKey(data).subscribe({
            next: (res: GenericList | GenericListValue) => {
                return Promise.reject('Generic lists not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/CREATE', (done) => {
        const data = { identity, gList: createGList as GenericList };
        glistsHead.create(data).subscribe({
            next: (res: GenericList) => {
                createGList.uuid = res.uuid;
                expect(res).toMatchPartialObject(createGList);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not created');
            },
        });
    });

    it ('/CREATE (with error)', (done) => {
        const data = { identity, gList: createGList as GenericList };
        glistsHead.create(data).subscribe({
            next: (res: GenericList) => {
                return Promise.reject('Generic lists already created');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateGList.uuid = createGList.uuid;
        const data = { identity, updateGenericList: updateGList as GenericList };
        glistsHead.update(data).subscribe({
            next: (res: GenericList) => {
                expect(res).toMatchPartialObject(updateGList);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not updated');
            },
        });
    });

    it ('/PATCH', (done) => {
        const data = { uuid: createGList.uuid, patches: [
            patchSet,
            patchPush,
        ] };
        glistsHead.patch({identity, data }).subscribe({
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
        const data = { identity, uuid: createGList.uuid };
        glistsHead.delete(data).subscribe({
            next: (res: boolean) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Generic lists not created');
            },
        });
    });

    it ('/DELETE (with error)', (done) => {
        const data = { identity, uuid: createGList.uuid };
        glistsHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('Generic lists already deleted');
            },
            error: (err) => {
                done();
            },
        });
    });

    it(`/CACHE`, (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        glistsHead.cache({identity, date: d.toISOString() }).subscribe({
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