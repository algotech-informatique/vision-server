import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { GroupHead } from '../../providers';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('GroupsHead', () => {
    let groupsHead: GroupHead;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        groupsHead = app.get<GroupHead>(GroupHead);

        await utils.Before(app, 'groups', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(groupsHead).toBeDefined();
    });

   /*  it ('/FINDALL', (done) => {
        const data = { identity };
        groupsHead.findAll(data).subscribe({
            next: (res: Group[]) => {
                expect(res).toMatchPartialObject([group1, group2, group3]);
                done();
            },
            error: (err) => {
                return Promise.reject('Groups list not found');
            },
        });
    });

    it ('/FIND (by uuid)', (done) => {
        const data = { identity, uuid: group1.uuid };
        groupsHead.findOne(data).subscribe({
            next: (res: Group) => {
                expect(res).toMatchPartialObject(group1);
                done();
            },
            error: (err) => {
                return Promise.reject('Groups not found');
            },
        });
    });

    it ('/FIND (with error - by uuid)', (done) => {
        const data = { identity, uuid: 'no-uuid-exists' };
        groupsHead.findOne(data).subscribe({
            next: (res: Group) => {
                return Promise.reject('Group found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/FIND (by key)', (done) => {
        const data = { identity, key: group2.key };
        groupsHead.findOne(data).subscribe({
            next: (res: Group) => {
                expect(res).toMatchPartialObject(group2);
                done();
            },
            error: (err) => {
                return Promise.reject('Groups not found');
            },
        });
    });

    it ('/FIND (with error - by key)', (done) => {
        const data = { identity, key: 'no-key-exists' };
        groupsHead.findOne(data).subscribe({
            next: (res: Group) => {
                return Promise.reject('Group found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/CREATE', (done) => {
        const data = { identity, group: createGroup as Group };
        groupsHead.create(data).subscribe({
            next: (res: Group) => {
                createGroup.uuid = res.uuid;
                expect(res).toMatchPartialObject(createGroup);
                done();
            },
            error: (err) => {
                return Promise.reject('Group not created');
            },
        });
    });

    it ('/CREATE (with error', (done) => {
        const data = { identity, group: createGroup as Group };
        groupsHead.create(data).subscribe({
            next: (res: Group) => {
                return Promise.reject('Group already created');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateGroup.uuid = createGroup.uuid;
        const data = { identity, group: updateGroup as Group };
        groupsHead.update(data).subscribe({
            next: (res: Group) => {
                expect(res).toMatchPartialObject(updateGroup);
                done();
            },
            error: (err) => {
                return Promise.reject('Group not updated');
            },
        });
    });

    it ('/DELETE', (done) => {
        const data = { identity, uuid: createGroup.uuid };
        groupsHead.delete(data).subscribe({
            next: (res: boolean) => {
                expect(res).toBe(true);
                done();
            },
            error: (err) => {
                return Promise.reject('Group not deleted');
            },
        });
    });

    it ('/DELETE (with error)', (done) => {
        const data = { identity, uuid: 'no-uuid-exists' };
        groupsHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('Group not deleted');
            },
            error: (err) => {
                done();
            },
        });
    });

    it(`/CACHE`, (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        groupsHead.cache({identity, date: d}).subscribe({
            next: (res: CacheDto) => {
                expect(res).toEqual({
                    updated: [],
                    deleted: [
                        createGroup.uuid,
                    ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Groups cache not found');
            },
        });
    });

    it(`/INIT`, (done) => {
        groupsHead.init({ customer }).subscribe({
            next: (res: CustomerInitResult) => {
                expect(res).toMatchPartialObject({
                    key: 'groups',
                    value: 'ok',
                });
                done();
            },
            error: (err) => {
                return Promise.reject('Groups init error');
            },
        });
    }); */

});