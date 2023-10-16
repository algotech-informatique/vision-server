import { INestApplication } from '@nestjs/common';
import { CustomerInit, CustomerInitResult, IdentityRequest, ProcessMonitoring, SnModel } from '../../interfaces';
import { TestUtils } from '../utils';
import {
    createSnModel, createSnModelService, duplicateNewSnModelService, listSnModel, modifyCreatedSnModel,
    modifyCreatedSnModelService,
    node,
    snModelSearchTest,
    snModelTest1, snModelTest2
} from '../fixtures/smartnodes';
import * as _ from 'lodash';
import { ProcessMonitoringService, SmartNodesHead } from '../../providers';
import { CacheDto, PatchPropertyDto, SnSynoticSearchQueryDto } from '@algotech-ce/core';
import { mergeMap } from 'rxjs/operators';

declare const describe, beforeAll, afterAll, expect, it: any;

const identity: IdentityRequest = {
    login: 'jford',
    groups: [''],
    customerKey: 'algotech',
};

const identityError: IdentityRequest = {
    login: null,
    groups: [''],
    customerKey: '',
};

const customerInit: CustomerInit = {
    customerKey: identity.customerKey,
    firstName: 'John',
    lastName: 'Doe',
    login: 'jford',
    email: 'test@test.fr',
    password: '123456',
    languages: [
        {
            lang: 'fr-FR',
            value: 'français',
        },
        {
            lang: 'en-US',
            value: 'anglais',
        },
        {
            lang: 'es-ES',
            value: 'espagnol',
        },
    ],
    defaultapplications: []
};

const customerInitError: CustomerInit = {
    customerKey: '',
    firstName: 'John',
    lastName: 'Doe',
    login: '',
    email: 'test@test.fr',
    password: '123456',
    languages: [
        {
            lang: 'fr-FR',
            value: 'français',
        },
    ],
    defaultapplications: []
};

describe('SmartNodesHead', () => {
    let smartNodesHead: SmartNodesHead;
    let monitoring: ProcessMonitoringService;
    const utils: TestUtils = new TestUtils();
    const request = require('supertest');
    let app: INestApplication;
    let initUuid: string;

    beforeAll(async () => {
        app = await utils.InitializeApp();
        smartNodesHead = app.get<SmartNodesHead>(SmartNodesHead);
        monitoring = app.get<ProcessMonitoringService>(ProcessMonitoringService);
        await utils.Before(app, ['snsynoticsearches', 'monitoring', 'snmodels'], request);
    });

    afterAll(async () => {
        await utils.AfterArray(['snsynoticsearches', 'monitoring', 'snmodels']);
    });

    it('CREATE INSTANCE', () => {
        expect(smartNodesHead).toBeDefined();
    });

    it('/INIT', (done) => {
        const data = { customer: customerInit };
        smartNodesHead.init(data).subscribe({
            next: (res: CustomerInitResult) => {
                expect(res.value).toMatchPartialObject('ok');
                done();
            },
            error: (err) => {
                return Promise.reject('No Init Smart Nodes');
            },
        });
    });

    it('/FIND (init by key)', (done) => {
        const data = { identity, key: 'smartmodel' };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                const sModel: SnModel = res as SnModel;
                expect(sModel.key).toEqual('smartmodel');
                initUuid = sModel.uuid;
                done();
            },
            error: (err) => {
                return Promise.reject('No Init Smart Nodes');
            },
        });
    });

    it('/FIND (All)', (done) => {
        const data = { identity };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                expect(res).toMatchPartialArray(listSnModel);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find all');
            },
        });
    });

    it('/FIND (uuid)', (done) => {
        const data = { identity, uuid: snModelTest1.uuid };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                expect(res).toMatchPartialObject(snModelTest1);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find by uuid');
            },
        });
    });

    it('/FIND (with error - uuid not exists)', (done) => {
        const data = { identity, uuid: 'uuid-not-exists' };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                return Promise.reject('Get Smart Nodes find by uuid');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND (Key)', (done) => {
        const data = { identity, key: snModelTest1.key };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                expect(res).toMatchPartialObject(snModelTest1);
                done();
            },
            error: (err) => {
                return Promise.reject('No get Smart Nodes find by key');
            },
        });
    });

    it('/FIND (with error - key not exists)', (done) => {
        const data = { identity, key: 'key-not-exists' };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                return Promise.reject('Get Smart Nodes find by key');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/CREATE', (done) => {
        const data = { identity, data: createSnModelService };
        smartNodesHead.create(data).subscribe({
            next: (res: SnModel) => {
                createSnModel.uuid = res.uuid;
                expect(res).toMatchPartialObject(createSnModel);
                done();
            },
            error: (err) => {
                return Promise.reject('No created Smart Nodes');
            },
        });
    });

    it('/CREATE (with error - duplicate)', (done) => {
        const data = { identity, data: createSnModelService };
        smartNodesHead.create(data).subscribe({
            next: (res: SnModel) => {
                return Promise.reject('created Smart Nodes duplicate');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/CREATE (with error - duplicate)', (done) => {
        const data = { identity, data: duplicateNewSnModelService };
        smartNodesHead.create(data).subscribe({
            next: (res: SnModel) => {
                return Promise.reject('Created Smart Nodes (duplicate)');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/UPDATE', (done) => {
        modifyCreatedSnModel.uuid = createSnModel.uuid;
        const data = { identity, data: modifyCreatedSnModelService };
        smartNodesHead.update(data).subscribe({
            next: (res: SnModel) => {
                expect(res).toMatchPartialObject(modifyCreatedSnModel);
                done();
            },
            error: (err) => {
                return Promise.reject('No Created Smart Nodes (update)');
            },
        });
    });

    it('/PATCH', (done) => {
        const patch: PatchPropertyDto[] = [
            {
                op: 'replace',
                path: '/type/',
                value: 'workflow-1',
            },
        ];
        const data = { identity, data: { uuid: modifyCreatedSnModel.uuid, patches: patch } };
        smartNodesHead.patch(data).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject(patch);
                done();
            },
            error: (err) => {
                return Promise.reject('No Smart Nodes patch');
            },
        });
    });

    it('/PATCH (version)', (done) => {
        const patch: PatchPropertyDto[] = [
            {
                op: 'replace',
                path: '/versions/[uuid:cda86945-7e47-4a81-845b-bfe93acc50c9]/creatorUuid/',
                value: 'workflow-100292-100292-100292',
            },
        ];
        const data = { identity, data: { uuid: modifyCreatedSnModel.uuid, patches: patch } };
        smartNodesHead.patch(data).subscribe({
            next: (res: PatchPropertyDto[]) => {
                expect(res).toMatchPartialObject(patch);
                done();
            },
            error: (err) => {
                return Promise.reject('No Smart Nodes patch');
            },
        });
    });

    it('/DELETE ', (done) => {
        const data = { identity, data: createSnModel.uuid };
        smartNodesHead.delete(data).subscribe({
            next: (res: boolean) => {
                done();
            },
            error: (err) => {
                return Promise.reject('No delete Smart Nodes');
            },
        });
    });

    it('/DELETE (init snmodel)', (done) => {
        const data = { identity, data: initUuid };
        smartNodesHead.delete(data).subscribe({
            next: (res: boolean) => {
                done();
            },
            error: (err) => {
                return Promise.reject('No deleted Init Smart Nodes');
            },
        });
    });

    it('/DELETE (with error - validate delete)', (done) => {
        const data = { identity, data: createSnModel.uuid };
        smartNodesHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('No correctly delete Smart Nodes');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/DELETE (with error - no uuid)', (done) => {
        const data = { identity: identityError, data: 'no-uuid-exists' };
        smartNodesHead.delete(data).subscribe({
            next: (res: boolean) => {
                return Promise.reject('No delete Smart Nodes');
            },
            error: (err) => {
                done();
            },
        });
    });

    it('/FIND - (version actives)', (done) => {
        const data = { identity, uuid: snModelTest2.uuid };
        smartNodesHead.find(data).subscribe({
            next: (res: SnModel | SnModel[]) => {
                done();
            },
            error: (err) => {
                return Promise.reject('Get Smart Nodes find by key');
            },
        });
    });

    it('CACHE', (done) => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        const data = { identity, date: d.toISOString() };
        smartNodesHead.cache(data).subscribe({
            next: (res: CacheDto) => {
                expect(res.deleted).toEqual([
                    initUuid,
                    createSnModel.uuid,
                ]);
                done();
            },
            error: (err) => {
                return Promise.reject('No Cache Smart Nodes');
            },
        });
    });

    describe('snModels indexation process', () => {
        let lock : ProcessMonitoring;
        let snModelSearchTestUuid = '';
        let updateDate;
        it('should not index aany snModels', (done) => {
            smartNodesHead.tryIndexsnModels().subscribe({
                next: (results) => {
                    expect(results[1]).toEqual(false);
                    done();
                },
                error: (err) => {
                    return Promise.reject('should index all snModels failed');
                },
            });
        });

        it('should not index only one Model', (done) => {
            const data = { identity, data: snModelSearchTest };
            smartNodesHead.create(data).pipe(
                mergeMap((created) => {
                    snModelSearchTestUuid = created.uuid;
                    
                    return smartNodesHead.tryIndexsnModels()}),
            )
            .subscribe({
                next: (results) => {
                    lock = results[0];
                    const succeeded = results[1];
                    expect(lock.processState).toEqual('succeeded');
                    expect(lock.total).toBeGreaterThan(0);
                    expect(succeeded).toEqual(true);
                    done();
                },
                error: (err) => {
                    return Promise.reject('should not index only one Model failed');
                },
            });
        });
        
        it('smartNodesHead.search should find only one objet exactValue = null, caseSensitive = null', (done) => {
            snModelSearchTest.displayName.push({lang: 'es', value: 'test model en-023333333'}) ;
            const data = { identity, data: snModelSearchTest };
            const query: SnSynoticSearchQueryDto = {
                search: 'en-023333333',
                versions: [ snModelSearchTest.versions[0].uuid] 
            }
            smartNodesHead.update(data).pipe(
                mergeMap((updated) => {
                    updateDate = updated.updateDate;
                    return smartNodesHead.search(query,0,1);
                },
            ))
            .subscribe({
                next: (results) => {
                    expect(results.length).toEqual(1);
                    expect(results[0]).toMatchObject({
                        updateDate: updateDate,
                        key: snModelSearchTest.key,
                        snModelUuid: snModelSearchTestUuid,
                        snVersionUuid: snModelSearchTest.versions[0].uuid,
                        snViewUuid: snModelSearchTest.versions[0].view.id,
                        elementUuid: '',
                        displayName: snModelSearchTest.displayName,
                        connectedTo: [],
                        type: 'view',
                    });
                    done();
                },
                error: (err) => {
                    return Promise.reject('should not index only onde Model failed');
                },
            });
        });

        it('smartNodesHead.search should find only one objet exactValue = false, caseSensitive = false', (done) => {
            const query: SnSynoticSearchQueryDto = {
                search: 'Model en-023333333',
                versions: [ snModelSearchTest.versions[0].uuid],
                exactValue: false,
                caseSensitive: false
            }
            smartNodesHead.search(query,0,1)
            .subscribe({
                next: (results) => {
                    expect(results.length).toEqual(1);
                    expect(results[0]).toMatchObject({
                        updateDate: updateDate,
                        key: snModelSearchTest.key,
                        snModelUuid: snModelSearchTestUuid,
                        snVersionUuid: snModelSearchTest.versions[0].uuid,
                        snViewUuid: snModelSearchTest.versions[0].view.id,
                        elementUuid: '',
                        displayName: snModelSearchTest.displayName,
                        connectedTo: [],
                        type: 'view',
                    });
                    done();
                },
                error: (err) => {
                    return Promise.reject('should not index only onde Model failed');
                },
            });
        });
        
        it('smartNodesHead.search should find only one objet exactValue = true, caseSensitive = false', (done) => {
            const query: SnSynoticSearchQueryDto = {
                search: 'TEST model en-023333333',
                versions: [ snModelSearchTest.versions[0].uuid],
                exactValue: true,
                caseSensitive: false
            }
            smartNodesHead.search(query,0,1)
            .subscribe({
                next: (results) => {
                    expect(results.length).toEqual(1);
                    expect(results[0]).toMatchObject({
                        updateDate: updateDate,
                        key: snModelSearchTest.key,
                        snModelUuid: snModelSearchTestUuid,
                        snVersionUuid: snModelSearchTest.versions[0].uuid,
                        snViewUuid: snModelSearchTest.versions[0].view.id,
                        elementUuid: '',
                        displayName: snModelSearchTest.displayName,
                        connectedTo: [],
                        type: 'view',
                    });
                    done();
                },
                error: (err) => {
                    return Promise.reject('should not index only onde Model failed');
                },
            });
        });

        it('smartNodesHead.search should find only one objet exactValue = true, caseSensitive = true', (done) => {
            const query: SnSynoticSearchQueryDto = {
                search: 'TEST model en-023333333',
                versions: [ snModelSearchTest.versions[0].uuid],
                exactValue: true,
                caseSensitive: true
            }
            smartNodesHead.search(query,0,1)
            .subscribe({
                next: (results) => {
                    expect(results.length).toEqual(0);                    
                    done();
                },
                error: (err) => {
                    return Promise.reject('should not index only onde Model failed');
                },
            });
        });

        it('smartNodesHead.search should find only one objet exactValue = true, caseSensitive = true', (done) => {
            const query: SnSynoticSearchQueryDto = {
                search: 'test model en-023333333',
                versions: [ snModelSearchTest.versions[0].uuid],
                exactValue: true,
                caseSensitive: true
            }
            smartNodesHead.search(query,0,1)
            .subscribe({
                next: (results) => {
                    expect(results.length).toEqual(1);
                    expect(results[0]).toMatchObject({
                        updateDate: updateDate,
                        key: snModelSearchTest.key,
                        snModelUuid: snModelSearchTestUuid,
                        snVersionUuid: snModelSearchTest.versions[0].uuid,
                        snViewUuid: snModelSearchTest.versions[0].view.id,
                        elementUuid: '',
                        displayName: snModelSearchTest.displayName,
                        connectedTo: [],
                        type: 'view',
                    });                 
                    done();
                },
                error: (err) => {
                    return Promise.reject('should not index only onde Model failed');
                },
            });
        });

        

        it('smartNodesHead.search should find only onde objet', (done) => {
            const query: SnSynoticSearchQueryDto = {
                ressource: 'wf:create-Model-test',
                versions: [ snModelSearchTest.versions[0].uuid] 
            }
            smartNodesHead.search(query,0,1).subscribe({
                next: (results) => {
                    expect(results.length).toEqual(1);
                    expect(results[0]).toMatchObject({
                        key: snModelSearchTest.key,
                        snModelUuid: snModelSearchTest.uuid,
                        snVersionUuid: snModelSearchTest.versions[0].uuid,
                        snViewUuid: snModelSearchTest.versions[0].view.id,
                        elementUuid: node.id,
                        displayName: node.displayName,
                        connectedTo: [ 'wf:create-Model-test', 'so:typeSoNode4'],
                        type: 'node',
                    });
                    done();
                },
                error: (err) => {
                    return Promise.reject('should not index only onde Model failed');
                },
            });
        });

        it('should not index any model because of lock', (done) => {
            lock.processState = 'inProgress';
            monitoring.update(identity.customerKey, lock, false).pipe(
                mergeMap(() => smartNodesHead.tryIndexsnModels()),
            )
            .subscribe({
                next: (results) => {
                    const succeeded = results[1];
                    expect(succeeded).toEqual(false);
                    done();
                },
                error: (err) => {
                    return Promise.reject('should not index any model because of lock failed');
                },
            });
        });

        
    })


});