import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { TestUtils } from '../utils';
import { WorkflowInstanceDto, SmartObjectDto, ScheduleSearchDto } from '@algotech-ce/core';
import {
    workflowInstance1, workflowInstance2, operationAddObject, operationPatchObject,
    operationSignObject, soAfterOperation,
    documentAfterOperation, operationDeleteDocument, operationDeleteObject,
} from '../fixtures/workflowinstances';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

const   createWorkflowInstance: WorkflowInstanceDto = _.cloneDeep(workflowInstance2);
delete createWorkflowInstance.uuid;

describe('WorkflowInstances', () => {
    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    const clearWFIDates = (data) => {
        const delDates = (o) => {
            o.workflowModel = utils.clearDates(o.workflowModel);
            o.updateDate = null;
            return o;
        };

        return Array.isArray(data) ? data.map(delDates) : delDates(data);
    };

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, ['workflowinstances', 'smartobjects', 'document', 'documents.files', 'documents.chunks', 'schedules'],
                request);
        });
    });

    // Finalisation
    afterAll(() => {
        return Promise.all([
            utils.After('workflowinstances'),
            utils.After('smartobjects'),
            utils.After('document'),
            utils.After('documents.files'),
            utils.After('documents.chunks'),
            utils.After('schedules')
        ]);
    });

    // Test la récupération de l'ensemble des workflow-instances
    it(`/GET workflow-instances`, () => {
        return request(app.getHttpServer())
            .get('/workflow-instances')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                const workflowInstances: object[] = clearWFIDates(response.body);

                expect(workflowInstances).toEqual(
                    jasmine.arrayContaining([Object.assign(workflowInstance1, { updateDate: null }),
                    Object.assign(workflowInstance2, { updateDate: null })]),
                );
            });
    });

    // Test la récupération d'un workflow instance par id
    it('/GET workflow-instances/id', () => {
        return request(app.getHttpServer())
            .get('/workflow-instances/' + workflowInstance2.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(clearWFIDates(response.body) as WorkflowInstanceDto).toEqual(
                    workflowInstance2,
                );
            });
    });

    // Test l'échec de la récupération d'un workflow instance par id
    it('/GET workflow-instances/id  - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/workflow-instances/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test la création d'un workflow instance
    it('/POST workflow-instances', () => {
        return request(app.getHttpServer())
            .post('/workflow-instances/')
            .set('Authorization', utils.authorizationJWT)
            .send(createWorkflowInstance)
            .expect(201);
    });

    // Test la modification d'un workflow instance
    it('/PUT workflow-instances', () => {
        const workflowUpdateInstance = _.cloneDeep(workflowInstance1);
        delete workflowUpdateInstance.workflowModel;
        delete workflowUpdateInstance.settings;

        return request(app.getHttpServer())
            .put('/workflow-instances/')
            .set('Authorization', utils.authorizationJWT)
            .send(workflowUpdateInstance)
            .expect(200);
    });

    // Tests la supppression d'un workflow-instance
    it('/DELETE workflow-instances', () => {
        return request(app.getHttpServer())
            .delete('/workflow-instances/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: workflowInstance1.uuid })
            .expect(200);
    });

    // Test l'échec de la récupération d'un workflow instance par id
    it('/GET workflow-instances - uuid inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/workflow-instances/' + createWorkflowInstance.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // ZIP: Prepare (insert document)
    /* it('zip prepare (insert document .files, .chunks)', (done) => {
        zip(
            utils.insert('documents.files', [{
                length: 5,
                chunkSize: 261120,
                uploadDate: '2020-02-24T03:03:11.556+0000',
                filename: 'document.txt',
                md5: '2debfdcf79f03e4a65a667d21ef9de14',
                contentType: 'text/plain',
                metadata: {
                    uuid: '51e8fafe-2fc1-41ee-4606-b9fd2227d1f5',
                    customerKey: 'algotech',
                    createdBy: 'jford',
                    createdDate: '2020-02-24T03:03:11+00:00',
                    indexationDate: null,
                    smartObject: 'cache',
                },
            }]),
            utils.insert('documents.chunks', [
                {
                    files_id: '5e533cf1d47430001dd8ecab',
                    n: 0,
                    data: null,
                },
            ]),
        ).subscribe({
            next: (res: any[]) => {
                expect(res).toMatchPartialObject([{'result': true }, {'result': true }]);
                done();
            },
            error: (err) => {
                return Promise.reject('Insertion docs error');
            },
        })
    }); */

    // Test le zip des opérations
    it('/POST zip', (done) => {
        return request(app.getHttpServer())
            .post('/workflow-instances/zip')
            .set('Authorization', utils.authorizationJWT)
            .send([
                operationAddObject,
                operationPatchObject,
                operationSignObject,
            ])
            .expect(201)
            .then(response => {
                expect(response.body).toEqual({ success: 1 });
                done();
            });
    });

    // ZIP: Check SO
    it('/GET zip: check so', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + soAfterOperation.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body)).toEqual(soAfterOperation);
            });
    });

    // ZIP: Check Document
    /* it('/GET zip: check document', () => {
        return request(app.getHttpServer())
            .get('/documents/' + documentAfterOperation.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const res = response.body;
                if (res.versions.length > 0) {
                    delete res.versions[0].fileID;
                    delete res.versions[0].dateUpdated;
                    utils.clearDates(res);
    
                    delete documentAfterOperation.versions[0].fileID;
                    delete documentAfterOperation.versions[0].dateUpdated;
                }
    
                expect(res).toEqual(documentAfterOperation);
            });
    }); */

    // Test le zip des opérations (delete doc)
    it('/POST zip (delete doc)', () => {
        return request(app.getHttpServer())
            .post('/workflow-instances/zip')
            .set('Authorization', utils.authorizationJWT)
            .send([
                operationDeleteDocument,
                operationDeleteObject,
            ])
            .expect(201)
            .then(response => {
                expect(response.body).toEqual({ success: 1 });
            });
    });

    // ZIP: SO Delete
    it('/GET zip: SO delete', () => {
        return request(app.getHttpServer())
            .delete('/smart-objects/')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: soAfterOperation.uuid })
            .expect(200);
    });

    // ZIP: Check SO Delete
    it('/GET zip: check SO delete', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/' + soAfterOperation.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // ZIP: Check Document Delete
    it('/GET zip: check document delete', () => {
        return request(app.getHttpServer())
            .get('/documents/' + documentAfterOperation.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // StartWorkflow
    it('/POST startWorkflow', () => {
        return request(app.getHttpServer())
            .post('/workflow-instances/startWorkflow')
            .send({
                key: 'process-workflow',
                inputs: [],
            })
            .set('Authorization', utils.authorizationJWT)
            .expect(201)
            .then(response => {
                expect(response.body.state).toBe('finished');
            });
    });

    // StartWorkflow: Check SO DOCUMENT
    it('/GET startWorkflow: check so DOCUMENT', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/DOCUMENT')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const smartObjects: SmartObjectDto[] = response.body;
                expect(smartObjects.filter((so: SmartObjectDto) =>
                    so.properties.find((p) => {
                        return p.key === 'NAME' && p.value === 'TEST';
                    }) !== undefined,
                ).length).toBe(1);
            });
    });

    // StartWorkflow: Check SO USER
    it('/GET startWorkflow: check so USER', () => {
        return request(app.getHttpServer())
            .get('/smart-objects/model/USER')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const smartObjects: SmartObjectDto[] = response.body;

                expect(smartObjects.filter((so: SmartObjectDto) =>
                    so.properties.find((p) => {
                        return p.key === 'FIRSTNAME' && p.value === 'TEST';
                    }) !== undefined,
                ).length).toBe(1);
            });
    });

    // StartWorkflow: Check Schedule
    it('/GET startWorkflow: check schedule', () => {
        const scheduleSearch: ScheduleSearchDto = {
            tags: ['test e2e'],
        };
        return request(app.getHttpServer())
            .post('/scheduler/search')
            .set('Authorization', utils.authorizationJWT)
            .send(scheduleSearch)
            .expect(201)
            .then((response) => {
                expect(response.body.length).toBe(1);
            });
    });
});
