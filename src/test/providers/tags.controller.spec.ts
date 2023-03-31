import { TagsController } from '../../controllers';
import { IdentityRequest } from '../../interfaces';
import { TagListDto } from '@algotech-ce/core';
import { addTag, createTagListController, ExistingList, tagsListWithTags } from '../fixtures/tags';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';

declare const describe, afterAll, beforeAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('TagsController', () => {

    let tagsController: TagsController;
    const request = require('supertest');
    const utils: TestUtils = new TestUtils();
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        tagsController = app.get<TagsController>(TagsController);

        await utils.Before(app, 'tags', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('CREATE INSTANCE', () => {
        expect(tagsController).toBeDefined();
    });

    it('/FIND (uuid)', done => {
        tagsController.findOne(identity, tagsListWithTags[0].uuid).subscribe({
            next: (res: TagListDto) => {
                expect(res).toMatchPartialObject(tagsListWithTags[0]);
                done();
            },
            error: (err) => {
                return Promise.reject('Tag by uuid not found');
            },
        });
    });

    it('/FIND (with error - no uuid)', done => {
        tagsController.findOne(identity, 'no-Existing-uuid').subscribe({
            next: (res: TagListDto) => {
                return Promise.reject('Tag by uuid not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (key)', done => {
        tagsController.findByKey(identity, tagsListWithTags[0].key).subscribe({
            next: (res: TagListDto) => {
                expect(res).toMatchPartialObject(tagsListWithTags[0]);
                done();
            },
            error: (err) => {
                return Promise.reject('Tag by key not found');
            },
        });
    });

    it('/FIND (with error - no key)', done => {
        tagsController.findByKey(identity, 'no-ExistingList-key').subscribe({
            next: (res: TagListDto) => {
                return Promise.reject('Tag by key not found');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (all)', done => {
        tagsController.findAll(identity).subscribe({
            next: (res: TagListDto[]) => {
                expect(res).toMatchPartialArray(tagsListWithTags, ExistingList );
                done();
            },
            error: (err) => {
                return Promise.reject('Taglist list not found');
            },
        });
    });

    it('/CREATE', done => {
        tagsController.create(identity, createTagListController).subscribe({
            next: (res: TagListDto) => {
                createTagListController.uuid = res.uuid;
                expect(res).toMatchPartialObject(createTagListController);
                done();
            },
            error: (err) => {
                return Promise.reject('TagList not created');
            },
        });
    });

    it('/UPDATE', done => {
        createTagListController.tags.push(addTag);
        tagsController.update(identity, createTagListController).subscribe({
            next: (res: TagListDto) => {
                expect(res).toMatchPartialObject(createTagListController);
                done();
            },
            error: (err) => {
                return Promise.reject('TagList not updated');
            },
        });
    });

    it('/DELETE', done => {
        tagsController.delete(identity, {uuid: createTagListController.uuid}).subscribe({
            next: (res: any) => {
                if (res) {
                    done();
                } else {
                    return Promise.reject('TagList not correctly deleted');
                }
            },
            error: (err) => {
                return Promise.reject('TagList not deleted');
            },
        });
    });

    it('/CACHE', (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        tagsController.cache(identity, d.toISOString() ).subscribe({
            next: (res: any) => {
                expect(res).toEqual({
                    updated: [],
                    deleted: [  createTagListController.uuid ],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('No Cache TagList');
            },
        });
    });
});
