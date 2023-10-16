import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';

import { SmartObjectDto, SearchSODto } from '@algotech-ce/core';
import { TestUtils } from '../utils';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

export const createSmartObjectR: SmartObjectDto = {
    modelKey: 'PERMISSION_TEST_R',
    properties: [
        {
            key: 'PROP_R1',
            value: 'PROP_R1_VALUE',
        }, {
            key: 'PROP_R2',
            value: 'PROP_R2_VALUE',
        },
    ],
    skills: {},
};

export const createSmartObjectRW: SmartObjectDto = {
    modelKey: 'PERMISSION_TEST_RW',
    properties: [
        {
            key: 'PROP_RW1',
            value: 'PROP_RW1_VALUE_R_PERMISSION',
        }, {
            key: 'PROP_RW2',
            value: 'PROP_RW2_VALUE',
        },
    ],
    skills: {},
};

export const createSmartObjectX: SmartObjectDto = {
    modelKey: 'PERMISSION_TEST_X',
    properties: [
        {
            key: 'PROP_X1',
            value: 'PROP_X1_VALUE',
        }, {
            key: 'PROP_X2',
            value: 'PROP_X2_VALUE',
        },
    ],
    skills: {},
};

describe('search', () => {

    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll((done) => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, ['smartobjects'], request).then(() => {
                done();
            });
        });
    });

    // Finalisation
    afterAll((done) => {
        return Promise.all([
            utils.After('smartobjects'),
        ]).then(() => {
            done();
        });
    });

    // Test récupération des SOs Search avec sous-objects
    it('/POST search SO - avec filter sur sous object with equals jane', () => {
        const search: SearchSODto = {
            modelKey: 'pere',
            filter: [
                { key: 'enfant.prenom', value: { criteria: 'equals', value: 'jane', type: 'string', models: ['enfant'] } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('698658de-789a-4b01-80e9-f1ecd8898506');
            },
            );
    });

    // Test récupération des SOs Search avec sous-objects
    it('/POST search SO - avec filter sur sous object with contains a', () => {
        const search: SearchSODto = {
            modelKey: 'pere',
            filter: [
                { key: 'enfant.prenom', value: { criteria: 'contains', value: 'a', type: 'string', models: ['enfant'] } },
            ],
            order: [{ key: 'enfant', value: 1 }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('698658de-789a-4b01-80e9-f1ecd8898506');
                expect(soResult[1].uuid).toEqual('698658de-789a-4b01-80e9-f1ecd8898596');
            },
            );
    });

    // Test récupération des SOs Search avec sysQuery
    it('/POST search SO - avec sysQuery', () => {
        const search: SearchSODto = {
            modelKey: 'enfant',
            searchParameters: {
                filter: [{ key: 'id', value: { criteria: 'equals', value: 1, type: 'number' } }],
                skip: 0,
                limit: 4,
                order: [{ key: 'ordre', value: -1 }]
            },
            order: [{ key: 'ordre', value: 1 }],
            filter: [{ key: 'id', value: { criteria: 'contains', value: '1', type: 'string' } }
            ]
        }
        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=1&limit=2')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(4);
                expect(soResult[0].uuid).toEqual('698658de-789a-4b01-80e9-f1ecd8898511');
                expect(soResult[1].uuid).toEqual('698658de-789a-4b01-80e9-f1ecd8898510');
                expect(soResult[2].uuid).toEqual('698658de-789a-4b01-80e9-f1ecd8898508');
                expect(soResult[3].uuid).toEqual('698658de-789a-4b01-80e9-f1ecd8898507');
            },
            );
    });

    // Test récupération des SOs Search
    it('/POST search SO - simple', () => {
        const search: SearchSODto = {
            modelKey: 'APPLICATION',
            filter: [
                { key: 'APP_KEY', value: { criteria: 'in', value: ['data'], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult[0].uuid).toEqual('8f6dba2c-a090-4cdf-ac37-2ebe854a669a');
            },
            );
    });

    // Test récupération des SOs Multiple Search 
    it('/POST search SO - (3 search - 2 found)', () => {
        const search: SearchSODto = {
            modelKey: 'APPLICATION',
            filter: [
                { key: 'APP_KEY', value: { criteria: 'in', value: ['data', 'security', 'no-exist'], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                expect((utils.clearDates(response.body) as object[]).length).toEqual[2];
            });
    });

    // Test récupération des SOs Search (Error)
    it('/POST search SO - simple (Error)', () => {
        const search: SearchSODto = {
            modelKey: 'APPLICATION',
            filter: [
                { key: 'APP_KEY', value: { criteria: 'in', value: ['no-found'], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                expect((utils.clearDates(response.body) as object[]).length).toEqual[0];
            });
    });

    //test startsWith critera

    it('/POST search SO - criteria startsWith string zmb', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'startsWith', value: 'zmb', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria startsWith string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'startsWith', value: 'aaa', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith m_string te', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'startsWith', value: 'te', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria startsWith m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'startsWith', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith number -4', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'startsWith', value: -4, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith m_number 1', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'startsWith', value: 1, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith time 2', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'startsWith', value: '2', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria startsWith time 1', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'startsWith', value: '1', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria startsWith time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'startsWith', value: '5', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith date 2024', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'startsWith', value: '2024', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith date 2023', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'startsWith', value: '2023', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith date 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'startsWith', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith datetime 2024', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'startsWith', value: '2024', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith datetime 2023', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'startsWith', value: '2023', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'startsWith', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith datetime 2024', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'startsWith', value: '2024', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    it('/POST search SO - criteria startsWith datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'startsWith', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith boolean_m t', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL', value: { criteria: 'startsWith', value: 't', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria startsWith boolean_m t', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL_M', value: { criteria: 'startsWith', value: 't', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    //test notStartsWith critera
    
    it('/POST search SO - criteria notStartsWith string zmb', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'notStartsWith', value: 'zmb', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria notStartsWith string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'notStartsWith', value: 'aaa', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
            });
    });

    it('/POST search SO - criteria notStartsWith m_string te', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'notStartsWith', value: 'te', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'notStartsWith', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria notStartsWith number -4', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'notStartsWith', value: -4, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith m_number 1', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'notStartsWith', value: 1, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith time 2', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'notStartsWith', value: '2', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria notStartsWith time 1', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'notStartsWith', value: '1', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria notStartsWith time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'notStartsWith', value: '5', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
            });
    });

    it('/POST search SO - criteria notStartsWith date 2024', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'notStartsWith', value: '2024', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith date 2023', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'notStartsWith', value: '2023', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith date 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'notStartsWith', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith datetime 2024', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'notStartsWith', value: '2024', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith datetime 2023', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'notStartsWith', value: '2023', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'notStartsWith', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith datetime 2024', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'notStartsWith', value: '2024', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    it('/POST search SO - criteria notStartsWith datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'notStartsWith', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith boolean_m t', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL', value: { criteria: 'notStartsWith', value: 't', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria notStartsWith boolean_m t', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL_M', value: { criteria: 'notStartsWith', value: 't', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    //test for endWith  

    it('/POST search SO - criteria endWith string eaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'endWith', value: 'eaà', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria endWith string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'endWith', value: 'aaa', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria endWith m_string t', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'endWith', value: 't', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria endWith m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'endWith', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria endWith number 0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'endWith', value: 0, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria endWith m_number 0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'endWith', value: 0, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria endWith time M', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'endWith', value: 'M', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria endWith time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'endWith', value: '5', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria endWith date 11', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'endWith', value: '11', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });



    it('/POST search SO - criteria endWith date 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'endWith', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria endWith datetime 11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'endWith', value: '11:17', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    it('/POST search SO - criteria endWith datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'endWith', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria endWith datetime 17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'endWith', value: '17', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    it('/POST search SO - criteria endWith datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'endWith', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria endWith boolean_m t', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL', value: { criteria: 'endWith', value: 't', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria endWith boolean_m t', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL_M', value: { criteria: 'endWith', value: 't', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    //test for contains  

    it('/POST search SO - criteria contains string eea', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'contains', value: 'eea', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria contains string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'contains', value: 'aaa', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria contains m_string e', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'contains', value: 'e', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria contains m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'contains', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria contains number 0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'contains', value: 0, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria contains m_number 0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'contains', value: 0, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria contains time 08', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'contains', value: '08', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria contains time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'contains', value: '5', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria contains date -01-', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'contains', value: '-01-', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });



    it('/POST search SO - criteria contains date 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'contains', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria contains datetime 11', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'contains', value: '11', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    it('/POST search SO - criteria contains datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'contains', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria contains datetime 02', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'contains', value: '02', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    it('/POST search SO - criteria contains datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'contains', value: '2025', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria contains boolean_m t', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL', value: { criteria: 'contains', value: 't', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria contains boolean_m t', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL_M', value: { criteria: 'contains', value: 't', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    //test for equals  

    it('/POST search SO - criteria equals string zmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'equals', value: 'zmbéeaà', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria equals string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'equals', value: 'aaa', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria equals m_string test', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'equals', value: 'test', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria equals m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'equals', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria equals number -488.0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'equals', value: -488.0, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria equals m_number 15.88', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'equals', value: [15.88], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria equals time 1:08 PM', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'equals', value: '1:08 PM', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });


    it('/POST search SO - criteria equals time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'equals', value: '5', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria equals date 2023-01-11', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'equals', value: '2023-01-11', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });



    it('/POST search SO - criteria equals date 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'equals', value: '2025', type: 'DATE' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria equals datetime 2023-01-11T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'equals', value: '2024-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria equals datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'equals', value: '2025', type: 'DATE' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria equals datetime [2024-01-11T11:17, 2024-02-11T11:17]', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'equals', value: ['2024-01-11T11:17', '2024-02-11T11:17'], type: 'DATE' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria equals datetime [2024-03-11T11:17, 2024-02-11T11:17]', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'equals', value: ['2024-03-11T11:17', '2024-02-11T11:17'], type: 'DATE' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    it('/POST search SO - criteria equals datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'equals', value: '2025', type: 'DATE' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria equals boolean true', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL', value: { criteria: 'equals', value: true, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria equals boolean_m false', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL_M', value: { criteria: 'equals', value: [false], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    //test for different  

    it('/POST search SO - criteria different string zmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'different', value: 'zmbéeaà', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria different string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'different', value: 'aaa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria different m_string test', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'different', value: 'test', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria different m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'different', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria different number -488.0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'different', value: -488.0, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria different m_number 15.88', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'different', value: [15.88], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria different time 1:08 PM', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'different', value: '1:08 PM', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria different time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'different', value: '5', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria different date 2023-01-11', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'different', value: '2023-01-11', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });



    it('/POST search SO - criteria different date 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'different', value: '2025', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');

            });
    });

    it('/POST search SO - criteria different datetime 2023-01-11T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'different', value: '2024-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });


    it('/POST search SO - criteria different datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'different', value: '2025', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria different datetime [2024-01-11T11:17, 2024-02-11T11:17]', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'different', value: ['2024-01-11T11:17', '2024-02-11T11:17'], type: 'DATE' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria different datetime [2024-03-11T11:17, 2024-02-11T11:17]', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'different', value: ['2024-03-11T11:17', '2024-02-11T11:17'], type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });


    it('/POST search SO - criteria different datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME_M', value: { criteria: 'different', value: '2025', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria different boolean true', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL', value: { criteria: 'different', value: true, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria different boolean_m false', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'BOOL_M', value: { criteria: 'different', value: [false], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    //test for gt  

    it('/POST search SO - criteria gt string zmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'gt', value: 'zmbéeaà', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria gt string Nozmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'gt', value: 'Nozmbéeaà', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria gt string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'gt', value: 'aaa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria gt m_string test', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'gt', value: 'test', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria gt m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'gt', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria gt number -488.0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'gt', value: -488.0, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria gt m_number 15.88', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'gt', value: [15.88], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria gt time 1:08 PM', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'gt', value: '1:08 PM', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria gt time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'gt', value: '5', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria gt date 2023-01-11', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'gt', value: '2023-01-11T00:00:00Z', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });



    it('/POST search SO - criteria gt date 2020-01-01', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'gt', value: '2020-01-01T00:00:00Z', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');

            });
    });

    it('/POST search SO - criteria gt datetime 2023-01-11T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'gt', value: '2023-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria gt datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'gt', value: '2025', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    //test for gte  

    it('/POST search SO - criteria gte string zmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'gte', value: 'zmbéeaà', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria gte string Nozmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'gte', value: 'Nozmbéeaà', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria gte string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'gte', value: 'aaa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria gte m_string test', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'gte', value: 'test', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria gte m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'gte', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria gte number -488.0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'gte', value: -488.0, type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria gte m_number 15.88', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'gte', value: [15.88], type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria gte time 1:08 PM', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'gte', value: '1:08 PM', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria gte time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'gte', value: '5', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria gte date 2023-01-11', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'gte', value: '2023-01-11T00:00:00Z', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });



    it('/POST search SO - criteria gte date 2020-01-01', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'gte', value: '2020-01-01T00:00:00Z', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');

            });
    });

    it('/POST search SO - criteria gte datetime 2023-01-11T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'gte', value: '2023-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });


    it('/POST search SO - criteria gte datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'gte', value: '2025', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    //test for lt  

    it('/POST search SO - criteria lt string zmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'lt', value: 'zmbéeaà', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lt string Nozmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'lt', value: 'Nozmbéeaà', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria lt string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'lt', value: 'aaa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lt m_string test', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'lt', value: 'test', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria lt m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'lt', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria lt number 488.0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'lt', value: 488.0, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lt m_number 15.88', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'lt', value: [21], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria lt time 2:08 PM', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'lt', value: '2:08 PM', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });


    it('/POST search SO - criteria lt time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'lt', value: '5', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lt date 2023-01-11', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'lt', value: '2023-01-11T00:00:00Z', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });



    it('/POST search SO - criteria lt date 2020-01-01', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'lt', value: '2020-01-01T00:00:00Z', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);

            });
    });

    it('/POST search SO - criteria lt datetime 2023-01-11T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'lt', value: '2023-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    it('/POST search SO - criteria lt datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'lt', value: '2025', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    //test for lte  

    it('/POST search SO - criteria lte string zmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'lte', value: 'zmbéeaà', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lte string Nozmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'lte', value: 'Nozmbéeaà', type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lte string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'lte', value: 'aaa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lte m_string test', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'lte', value: 'test', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lte m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'lte', value: 'aa', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria lte number 488.0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'lte', value: 488.0, type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lte m_number 15.88', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'lte', value: [21], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria lte time 2:08 PM', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'lte', value: '2:08 PM', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria lte time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'lte', value: '5', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria lte date 2023-01-11', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'lte', value: '2023-01-11T00:00:00Z', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });



    it('/POST search SO - criteria lte date 2020-01-01', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'lte', value: '2020-01-01T00:00:00Z', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);

            });
    });

    it('/POST search SO - criteria lte datetime 2023-01-11T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'lte', value: '2023-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });


    it('/POST search SO - criteria lte datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'lte', value: '2025', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    //test for isNull  

    it('/POST search SO - criteria isNull SO_COMP', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'SO_COMP', value: { criteria: 'isNull', value: '', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    //test for exists  

    it('/POST search SO - criteria exists SO_COMP', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'SO_COMP', value: { criteria: 'exists', value: '', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    //test for in  


    it('/POST search SO - criteria in string zmbéeaà', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'in', value: ['Nozmbéeaà', 'zmbéeaà'], type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria in string aaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING', value: { criteria: 'in', value: ['aaa'], type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria in m_string test', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'in', value: ['test'], type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria in m_string aa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'STRING_M', value: { criteria: 'in', value: ['aa'], type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria in number -488.0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'in', value: [-488.0], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria in m_number 15.88', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER_M', value: { criteria: 'in', value: [15.88], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria in time 1:08 PM', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'in', value: '1:08 PM', type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria in time 1:08 PM', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'in', value: ['2:08 PM'], type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });


    it('/POST search SO - criteria in time 5', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'TIME', value: { criteria: 'in', value: ['5'], type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST search SO - criteria in date 2023-01-11', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'in', value: '2023-01-11', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });



    it('/POST search SO - criteria in date 2020-01-01', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATE', value: { criteria: 'in', value: '2020-01-01T00:00:00Z', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);

            });
    });

    it('/POST search SO - criteria in datetime 2023-01-11T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'in', value: '2023-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });


    it('/POST search SO - criteria in datetime 2025', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'in', value: '2025', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    //test for between  
    it('/POST search SO - criteria between number 489.0 && 0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'between', value: 0, secondValue: 489, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria between number 488.0 && 0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'between', value: 0, secondValue: 488, type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search SO - criteria between number 489.0 && -488.0', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'NUMBER', value: { criteria: 'between', value: -489.0, secondValue: 489, type: 'string' } },
            ],
            order: [{
                key: 'KEY',
                value: 'desc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });


    //test for between  
    it('/POST search SO - criteria between number 2025 && 2023', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'between', value: '2023-01-11T12:17Z', secondValue: '2025-01-11T11:17Z', type: 'DATE' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST search SO - criteria between number 2025 && 2022', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'between', value: '2022-01-11T11:17', secondValue: '2025-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST fullTextSearch zmbeeaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'between', value: '2023-01-11T11:17', secondValue: '2025-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?search=zmbeeaa&skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST fullTextSearch no', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?search=no&skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST fullTextSearch zmbeeaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'DATETIME', value: { criteria: 'gt', value: '2024-01-11T11:17', type: 'DATE' } },
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?search=zmbeeaa&skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });

    it('/POST fullTextSearch zmbeeaa', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?search=zmbeeaa&skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST fullTextSearch unknowntext', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?search=unknowntext&skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(0);
            });
    });


    it('/POST updateDate < 2023-01-12T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                {
                    key: 'sys:updateDate',
                    value: {
                        criteria: 'lt',
                        value: '2023-01-12T11:17',
                        type: 'DATE'
                    }
                }
            ],
            order: [{
                key: 'KEY',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
            });
    });

    it('/POST createdDate > 2018-01-11T11:17', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                {
                    key: 'sys:createdDate',
                    value: {
                        criteria: 'gt',
                        value: '2018-01-11T11:17',
                        type: 'DATE'
                    }
                }
            ],
            order: [{
                key: 'sys:createdDate',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1a99');
                expect(soResult[1].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    //search deleted
    it('/POST deleted true', () => {
        const search: SearchSODto = {
            modelKey: 'child',
            filter: [],
            order: [{
                key: 'sys:createdDate',
                value: 'asc'
            }],
            deleted: true,
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('698658de-789a-4b01-80e9-f1ecd8898350');
            });
    });

    //search skip 0 limit 2
    it('/POST skip 0 limit 2', () => {
        const search: SearchSODto = {
            modelKey: 'USER',
            filter: [],
            order: [{
                key: 'FIRSTNAME',
                value: 'asc'
            }],
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?skip=0&limit=2')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(2);
                expect(soResult[0].uuid).toEqual('82f127e9-f338-4422-b772-d704ec8f270b');
                expect(soResult[1].uuid).toEqual('bebc86d8-edec-48bc-a649-f5b9c42cefbf');
            });
    });

    //search skip 1 limit 2
    it('/POST skip 1 limit 2', () => {
        const search: SearchSODto = {
            modelKey: 'USER',
            filter: [],
            order: [{
                key: 'FIRSTNAME',
                value: 'asc'
            }]
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?&skip=1&limit=2')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('d36b26dd-1bcc-4b67-b632-9edd0b312bca');
            });
    });

    it('/POST search deep', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'KEY', value: { criteria: 'equals', value: '2', type: 'string' }},
                { key: 'SO.enfant.prenom', value: { criteria: 'startsWith', value: 'jan', models: ['pere', 'enfant'], type: 'string' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?&search=zmbeeaa&skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

    it('/POST search global smart object', () => {
        const search: SearchSODto = {
            modelKey: 'alltypes',
            filter: [
                { key: 'KEY', value: { criteria: 'equals', value: '2', type: 'string' }},
                { key: 'SO.enfant', value: { criteria: 'equals', value: 'jane', models: ['pere', 'enfant'], type: 'so:enfant' } },
            ],
            order: []
        }

        return request(app.getHttpServer())
            .post('/search/smart-objects?&search=zmbeeaa&skip=0&limit=100')
            .set('Authorization', utils.authorizationJWT)
            .send(search)
            .expect(201)
            .then((response) => {
                const soResult: SmartObjectDto[] = utils.clearDates(response.body) as SmartObjectDto[];
                expect(soResult.length).toBe(1);
                expect(soResult[0].uuid).toEqual('47bcc674-700e-f161-6fe9-b76b1f3a1ace');
            });
    });

});