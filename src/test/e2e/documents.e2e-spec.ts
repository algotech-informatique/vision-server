import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { DocumentsController } from '../../controllers';
import { document1, document2 } from '../fixtures/documents';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe(`${DocumentsController.name} (e2e)`, () => {
    const request = require('supertest');
    let app: INestApplication;

    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp; 
            return utils.Before(app, 'document', request);
        });
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    it(`/POST documents/uuids`, () => {
        return request(app.getHttpServer())
            .post('/documents/uuids')
            .set('Authorization', utils.authorizationJWT)
            .send([
                document1.uuid,
                document2.uuid,
            ])
            .expect(201)
            .then((response) => {
                const documents = utils.clearDates(response.body);
                expect(documents).toEqual([
                    document1,
                    document2
                ]);
            });
    });

});
