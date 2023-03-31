import { INestApplication } from '@nestjs/common';
import { user1, user2, user4, user3 } from '../fixtures/users';
import { TestUtils } from '../utils';
import { UserDto } from '@algotech-ce/core';
import { User } from '../../interfaces';

declare const describe, jasmine, expect, beforeAll, beforeEach, afterAll, it: any;

describe('Users', () => {
    let app: INestApplication;
    const utils: TestUtils = new TestUtils();

    const createUser: UserDto = {
        customerKey: 'algotech',
        preferedLang: 'fr-FR',
        groups: ['admin'],
        enabled: true,
        username: 'new-user',
        email: 'new.user@gmail.com',
        firstName: 'New',
        lastName: 'User',
        following: [],
        mobileToken: '',
        pictureUrl: 'https://picture.url',
        favorites: {
            documents: [],
            smartObjects: [],
        },
    };

    const request = require('supertest');
    const _ = require('lodash');

    let user3Uuid = null;
    let createUserUuid = null;

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
            app = nestApp;
            return utils.Before(app, null, request);
        });
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test la récupération de l'ensemble des utilisateurs
    it(`/GET users`, () => {
        return request(app.getHttpServer())
            .get('/users')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                // Test que le tableau users (retour de la route) contient les utilisateurs
                const expected = [user3, user2, user4, user1];
                const users: object[] = response.body.map(u => {
                    if (u.username === user3.username) {
                        user3Uuid = u.uuid;
                    }
                    u.uuid = _.find(expected, { username: u.username }).uuid;
                    return u;
                });
                expect(users).toEqual(jasmine.arrayContaining(expected));
            },
            );
    });

    // Test la récupération d'un utilisateur par id
    it('/GET users/id', () => {
        return request(app.getHttpServer())
            .get('/users/' + user3Uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                response.body.uuid = user3.uuid;
                expect(response.body as object).toEqual(user3);
            });
    });

    // Test la création d'un utilisateur
    it('/POST users', () => {
        return request(app.getHttpServer())
            .post('/users?ignoreEmail=true')
            .set('Authorization', utils.authorizationJWT)
            .send(createUser)
            .expect(201)
            .then(response => {
                const user: UserDto = response.body;

                createUser.uuid = user.uuid;
                createUserUuid = user.uuid;
                expect(user).toEqual(createUser);
            });
    });

    // Test la présence de l'utilisateur ajouté dans la liste complète des users
    it(`/GET users`, () => {
        return request(app.getHttpServer())
            .get('/users')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                expect(response.body as object[]).toEqual(jasmine.arrayContaining([
                    createUser,
                ]));
            },
            );
    });

    // Test l'échec de la création d'un utilisateur avec un login existant
    it('/POST users/ : login existant : 400', () => {
        const createUserError = _.cloneDeep(createUser);
        return request(app.getHttpServer())
            .post('/users?ignoreEmail=true')
            .set('Authorization', utils.authorizationJWT)
            .send(createUserError)
            .expect(400);
    });

    // Test l'échec de la création d'un utilisateur avec un login vide
    it('/POST users/ : login manquant : 400', () => {
        const createUserError = _.cloneDeep(createUser);
        createUserError.username = '';

        return request(app.getHttpServer())
            .post('/users?ignoreEmail=true')
            .set('Authorization', utils.authorizationJWT)
            .send(createUserError)
            .expect(400);
    });

    // Test l'échec de la création d'un utilisateur avec un email incorrect
    it('/POST users / : email incorrect : 400', () => {
        const createUserError = _.cloneDeep(createUser);
        createUserError.username = 'new-user-2';
        createUserError.email = 'test@yahoo';

        return request(app.getHttpServer())
            .post('/users?ignoreEmail=true')
            .set('Authorization', utils.authorizationJWT)
            .send(createUserError)
            .expect(400);
    });

    // Test la suppression d'un utilisateur
    it('/DELETE users /id', () => {
        return request(app.getHttpServer())
            .delete('/users')
            .set('Authorization', utils.authorizationJWT)
            .send({ uuid: user3Uuid })
            .expect(200);
    });

    // Vérifie que l'utilisateur a bien été supprimé
    it('/GET users/id', () => {
        return request(app.getHttpServer())
            .get('/users/' + user3Uuid)
            .set('Authorization', utils.authorizationJWT)
            .expect(400);
    });

    // Vérifie que l'utilisateur supprimé n'est pas présent dans la liste de tous les utilisateurs
    it(`/GET users`, () => {
        return request(app.getHttpServer())
            .get('/users')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then(response => {
                expect(response.body as object[]).not.toEqual(
                    jasmine.arrayContaining([user3]),
                );
            });
    });

    // Test de l'échec de la suppression d'un utilisateur (non trouvé)
    it('/DELETE users with fakeid', () => {
        return request(app.getHttpServer())
            .delete('/users/fakeid')
            .set('Authorization', utils.authorizationJWT)
            .send(createUser)
            .expect(404);
    });

    // Test la modification d'un utilisateur
    it(`/PUT users`, () => {
        const updateUser = _.cloneDeep(createUser);

        updateUser.uuid = createUserUuid;
        updateUser.lastName = 'Last name updated';
        updateUser.firstName = 'First name updated';
        updateUser.email = 'email@updated.fr';

        return request(app.getHttpServer())
            .put('/users')
            .set('Authorization', utils.authorizationJWT)
            .send(updateUser)
            .expect(200)
            .then(response => {
                expect(response.body as object).toEqual(updateUser);
            });
    });

    // Test la modification partielle d'un utilisateur (firstName)
    it(`/PATCH users`, () => {
        const obj = { firstName: 'Bertrand' };

        return request(app.getHttpServer())
            .patch('/users/' + createUserUuid)
            .set('Authorization', utils.authorizationJWT)
            .send(obj)
            .expect(200)
            .then(response => {
                expect((response.body as User).firstName).toBe(obj.firstName);
            });
    });

});
