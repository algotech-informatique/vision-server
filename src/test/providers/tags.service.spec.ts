import { TagListDto } from '@algotech/core';
import { INestApplication } from '@nestjs/common';
import { IdentityRequest, TagList } from '../../interfaces';
import { TagsHead } from '../../providers';
import { TestUtils } from '../utils';
import { addTag, createTagList, createTagListDuplicate,
    createTagListNullTag, ExistingList, tagDuplicate, tagsListWithTags } from '../fixtures/tags';
import * as _ from 'lodash';

declare const describe, beforeAll, afterAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

describe('TagsHead', () => {
    let tagsHead: TagsHead;
    const utils: TestUtils = new TestUtils();
    const request = require('supertest');
    let app: INestApplication;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        tagsHead = app.get<TagsHead>(TagsHead);

        await utils.Before(app, 'tags', request);
    });

    afterAll(async () => {
        await utils.After();
    });

    it('/CREATE INSTANCE', () => {
        expect(tagsHead).toBeDefined();
    });

    it ('/GET (by uuid)', (done) => {
        const data = {identity, uuid: tagsListWithTags[0].uuid};
        tagsHead.findOne(data).subscribe({
            next: (res: TagList) => {
                expect(res).toMatchPartialObject(tagsListWithTags[0]);
                done();
            },
            error: (err) => {
                return Promise.reject('TagList by uuid not found');
            },

        });
    });

    it ('/GET (by key)', (done) => {
        const data = {identity, key: tagsListWithTags[0].key};
        tagsHead.findOne(data).subscribe({
            next: (res: TagList) => {
                expect(res).toMatchPartialObject(tagsListWithTags[0]);
                done();
            },
            error: (err) => {
                return Promise.reject('Tag by key not found');
            },

        });
    });

    it ('/GET (with error - no uuid)', (done) => {
        const data = {identity, uuid: 'Err-uuid'};
        tagsHead.findOne(data).subscribe({
            next: (res: TagList) => {
                return Promise.reject('Tag Err-uuid found');
            },
            error: (err) => {
                done();
            },

        });
    });

    it ('/GET (with error - no key)', (done) => {
        const data = {identity, key: 'no-exist-key'};
        tagsHead.findOne(data).subscribe({
            next: (res: TagList) => {
                return Promise.reject('Tag no-exist-key');
            },
            error: (err) => {
                done();
            },

        });
    });

    it ('/CREATE', (done) => {
        const data = {identity, tagList: createTagList as TagList};
        tagsHead.create(data).subscribe({
            next: (res: TagList) => {
                createTagList.uuid = res.uuid;
                expect(res as TagListDto).toMatchPartialObject(createTagList);
                done();
            },
            error: (err) => {
                return Promise.reject('Tag has not been created');
            },
        });
    });

    it ('/CREATE (with error - already exists)', (done) => {
        const data = {identity, tagList: createTagList as TagList};
        tagsHead.create(data).subscribe({
            next: (res: TagList) => {
                return Promise.reject('Tag has been created yet');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/CREATE (with error - any tag)', () => {
        const data = {identity, tagList: null};
        expect(() => { tagsHead.create(data); })
            .toThrowError(TypeError);
    });

    it('/CREATE (with error - null tags)', () => {
        const data = {identity, tagList: createTagListNullTag as TagList};
        expect(() => { tagsHead.create(data); })
            .toThrowError(TypeError);
    });

    it ('/UPDATE', (done) => {
        createTagList.modelKeyApplication.push('mobile');
        const data = {identity, tagList: createTagList as TagList};
        tagsHead.update(data).subscribe({
            next: (res: TagList) => {
                expect(res as TagListDto).toMatchPartialObject(createTagList);
                done();
            },
            error: (err) => {
                return Promise.reject(err);
            },

        });
    });

    it ('/UPDATE (add Tag)', (done) => {
        createTagList.tags.push(addTag);
        const data = {identity, tagList: createTagList as TagList};
        tagsHead.update(data).subscribe({
            next: (res: TagList) => {
                expect(res as TagListDto).toMatchPartialObject(createTagList);
                done();
            },
            error: (err) => {
                return Promise.reject(err);
            },

        });
    });

    it ('/UPDATE (with error - duplicate tag)', (done) => {
        createTagList.tags.push(tagDuplicate);
        const data = {identity, tagList: createTagList as TagList};
        tagsHead.update(data).subscribe({
            next: (res: TagList) => {
                return Promise.reject('TagList has not been update by duplicate tag key');
            },
            error: (err) => {
                done();
            },

        });
    });

    it ('/CREATE (with error - duplicate elements)', (done) => {
        createTagList.key = ExistingList.key;
        const data = {identity, tagList: createTagList as TagList};
        tagsHead.create(data).subscribe({
            next: (res: TagList) => {
                return Promise.reject('TagList has not been created by duplicate values');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE (with error - key exists another tag)', (done) => {
        createTagList.key = ExistingList.key;
        const data = {identity, tagList: createTagList as TagList};
        tagsHead.update(data).subscribe({
            next: (res: TagList) => {
                return Promise.reject('TagList has not been update with a duplicate key');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE (with error - key not exist)', (done) => {
        createTagList.key = 'TAG-NOT-EXISTS';
        const data = {identity, tagList: createTagList as TagList};
        tagsHead.update(data).subscribe({
            next: (res: TagList) => {
                return Promise.reject('TagList has not been update key doesnt exist');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/UPDATE (with error - tags -exists)', (done) => {
        const data = {identity, tagList: createTagListDuplicate as TagList};
        tagsHead.update(data).subscribe({
            next: (res: TagList) => {
                return Promise.reject('Tag has not been created by duplicate values');
            },
            error: (err) => {
                done();
            },
        });
    });

    it ('/DELETE', (done) => {
        const data = {identity, uuid: createTagList.uuid};
        tagsHead.delete(data).subscribe({
            next: (res) => {
                if (res === true) {
                    done();
                } else {
                    return Promise.reject('CreatedTag has not been found');
                }
            },
            error: (err) => {
                return Promise.reject(err);
            },
        });
    });

    it ('/FIND (All)', (done) => {
        tagsHead.findAll({identity}).subscribe({
            next: (res: TagList[]) => {
                const lst: TagListDto[] = _.map(res, (rs: TagList) => utils.clearDates(rs) as TagListDto);
                expect(res).toMatchPartialArray(tagsListWithTags, ExistingList );
                done();
            },
            error: (err) => {
                return Promise.reject('List not match');
            },

        });
    });

    it('/DELETE (with error)', (done) => {
        identity.customerKey = null;
        const data = {identity, uuid: null };
        tagsHead.delete(data).subscribe({
            next: (res) => {
                if (res) {
                    return Promise.reject('waiting for a delete error');
                } else {
                    done();
                }
            },
            error: (err) => {
                done();
            },

        });
    });

    it('/CACHE (TagList)', (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        const data = {identity, date: d.toISOString() };
        tagsHead.cache(data).subscribe({
            next: (res: any) => {
                expect(res).toEqual({
                    updated: [],
                    deleted: [],
                });
                done();
            },
            error: (err) => {
                return Promise.reject('No Cache TagList');
            },
        });
    });

});
