import { GroupsController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('GroupsController', () => {
    let groupsController: GroupsController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        groupsController = app.get<GroupsController>(GroupsController);

        await utils.Before(app, 'groups', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(groupsController).toBeDefined();
    });

    /* it ('/FINDALL', (done) => {
        groupsController.findAll(identity).subscribe({
            next: (res: GroupDto[]) => {
                expect(res).toMatchPartialObject([group1, group2, group3]);
                done();
            },
            error: (err) => {
                return Promise.reject('Groups list not found');
            },
        });
    });

    it ('/FIND (by uuid)', (done) => {
        groupsController.findOne( identity, group1.uuid ).subscribe({
            next: (res: GroupDto) => {
                expect(res).toMatchPartialObject(group1);
                done();
            },
            error: (err) => {
                return Promise.reject('Groups not found');
            },
        });
    });

    it ('/FIND (with error - by uuid)', (done) => {
        groupsController.findOne(identity, 'no-uuid-exists').subscribe({
            next: (res: GroupDto) => {
                return Promise.reject('Group found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/FIND (by key)', (done) => {
        groupsController.findByKey(identity, group2.key ).subscribe({
            next: (res: GroupDto) => {
                expect(res).toMatchPartialArray(group2);
                done();
            },
            error: (err) => {
                return Promise.reject('Groups not found');
            },
        });
    });

    it ('/FIND (with error - by key)', (done) => {
        groupsController.findByKey(identity, 'no-key-exists').subscribe({
            next: (res: GroupDto) => {
                return Promise.reject('Group found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/CREATE', (done) => {
        groupsController.create(identity, createGroup).subscribe({
            next: (res: GroupDto) => {
                createGroup.uuid = res.uuid;
                expect(res).toMatchPartialObject(createGroup);
                done();
            },
            error: (err) => {
                return Promise.reject('Group not created');
            },
        });
    });

    it ('/CREATE (with error)', (done) => {
        groupsController.create(identity, createGroup).subscribe({
            next: (res: GroupDto) => {
                return Promise.reject('Group already created');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE', (done) => {
        updateGroup.uuid = createGroup.uuid;
        groupsController.update(identity, updateGroup).subscribe({
            next: (res: GroupDto) => {
                expect(res).toMatchPartialObject(updateGroup);
                done();
            },
            error: (err) => {
                return Promise.reject('Group not updated');
            },
        });
    });

    it ('/DELETE', (done) => {
        groupsController.delete(identity, {uuid: createGroup.uuid}).subscribe({
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
        groupsController.delete(identity, { uuid: 'no-uuid-exists' }).subscribe({
            next: (res: boolean) => {
                return Promise.reject('Group not deleted');
            },
            error: (err) => {
                done();
            },
        });
    }); */

    /* it(`/CACHE`, (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        groupsController.cache(identity, d.toIsoString() ).subscribe({
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
    }); */

});