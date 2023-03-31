import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { NotificationDto } from '@algotech-ce/core';
import {
    notificationAdminAndRead, notificationUserAndUnread, notificationTechnicianAndUnread, notificationUserAndUnreadMobile,
    notificationUserAndUnreadWebMobile, notificationUserAndUnreadWeb,
} from '../fixtures/notifications';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

describe('NotificationController (e2e)', () => {
    const request = require('supertest');
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    const newNotification: NotificationDto = {
        uuid: '50d322b8-d162-4f70-9714-0a613a3d50b3',
        title: 'Ma notification',
        content: 'Mon content',
        author: 'Marcel Patulacci',
        date: '2019-02-01T18:25:43.511Z',
        icon: 'far fa-file-upload',
        state: {
            from: 'jsmith',
            to: ['grp:technician'],
            read: [],
        },
        action: {
            key: 'workflow',
        },
        channels: [],
    };

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
        app = nestApp;
        return utils.Before(app, 'notifications', request);});
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // list des notifications sans paramètres (read+unread)
    it('/notifications (GET)', () => {
        return request(app.getHttpServer())
            .get('/notifications')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([
                    notificationAdminAndRead,
                    notificationUserAndUnread,
                    notificationUserAndUnreadMobile,
                    notificationUserAndUnreadWebMobile,
                    notificationUserAndUnreadWeb,
                ]));
            });
    });

    // list des notifications avec paramètre (state=all)
    it('/notifications (GET) with param state (all)', () => {
        return request(app.getHttpServer())
            .get('/notifications?state=all')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([
                    notificationAdminAndRead,
                    notificationUserAndUnread,
                    notificationUserAndUnreadMobile,
                    notificationUserAndUnreadWebMobile,
                    notificationUserAndUnreadWeb,
                ]));
            });
    });

    // list des notifications avec paramètre (state=all + skip 1 limit 1)
    it('/notifications (GET) with param state (all) + skip 1 limit 1', () => {
        return request(app.getHttpServer())
            .get('/notifications?state=all&skip=1&limit=1')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(response.body.length).toBe(1);
            });
    });

    // list des notifications avec paramètre (state=unread)
    it('/notifications (GET) with param state (unread)', () => {
        return request(app.getHttpServer())
            .get('/notifications?state=unread')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([
                    notificationUserAndUnread,
                    notificationUserAndUnreadMobile,
                    notificationUserAndUnreadWebMobile,
                    notificationUserAndUnreadWeb,
                ]));
            });
    });

    // list des notifications avec paramètre (state=read)
    it('/notifications (GET) with param state (read)', () => {
        return request(app.getHttpServer())
            .get('/notifications?state=read')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([
                    notificationAdminAndRead,
                ]));
            });
    });

    // list des notifications avec paramètre (state=all + sort DATE order DESC)
    it('/notifications (GET) with param state (all) + sort date order desc', () => {
        return request(app.getHttpServer())
            .get('/notifications?sort=date&order=desc&limit=2')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body)).toEqual([
                    notificationUserAndUnread,
                    notificationAdminAndRead,
                ]);
            });
    });

    // list des notifications avec paramètre (state=all + channel MOBILE)
    it('/notifications (GET) with param state (all) + channel MOBILE', () => {
        return request(app.getHttpServer())
            .get('/notifications?state=all&channel=mobile')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([
                    notificationUserAndUnreadMobile,
                    notificationUserAndUnreadWebMobile,
                ]));
            });
    });

    // list des notifications avec paramètre (state=all + channel WEB)
    it('/notifications (GET) with param state (all) + channel WEB', () => {
        return request(app.getHttpServer())
            .get('/notifications?state=all&channel=web')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body)).toEqual(jasmine.arrayContaining([
                    notificationUserAndUnreadWeb,
                    notificationUserAndUnreadWebMobile,
                ]));
            });
    });

    // Test de la recuperation d'une notification inexistante
    it('/notifications/uuid - id inexistant (GET)', () => {
        return request(app.getHttpServer())
            .get('/notifications/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'un notification non affecté au user connecté
    it('/notifications/uuid - not affected', () => {
        return request(app.getHttpServer())
            .get('/notifications/' + notificationTechnicianAndUnread.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Test de la recuperation d'un notification
    it('/notifications/uuid - affected', () => {
        return request(app.getHttpServer())
            .get('/notifications/' + notificationUserAndUnread.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(utils.clearDates(response.body)).toEqual(notificationUserAndUnread);
            });
    });

    // Test de l'ajout d'une notification
    it('/notifications (POST)', () => {
        return request(app.getHttpServer())
            .post('/notifications')
            .set('Authorization', utils.authorizationJWT)
            .send(newNotification)
            .expect(201)
            .then(response => {
                expect(utils.clearDates(response.body)).toEqual(newNotification);
            });
    });

    // Test de la suppression d'une notification
    it('/notifications (DELETE)', () => {
        return request(app.getHttpServer())
            .delete('/notifications')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: notificationAdminAndRead.uuid })
            .expect(200);
    });

    // Test si la suppression est bien effectuée
    it('/notifications/uuid (GET)', () => {
        return request(app.getHttpServer())
            .get('/notifications/' + notificationAdminAndRead.uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });
});