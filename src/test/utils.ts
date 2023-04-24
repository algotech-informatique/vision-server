import { Test } from '@nestjs/testing';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { user1, user2, user3, user4 } from './fixtures/users';
import * as qs from 'qs';
import { AppModuleMock } from './mock/app.module.mock';
import axios from 'axios';

declare const expect;

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchPartialObject(partialObj): R;
            toMatchPartialArray(objArray: any[]): R;
        }
    }
}

expect.extend({
    toMatchPartialObject(received, partialObj) {
        const matches = _.matches(partialObj)(received);
        return {
            pass: matches,
            message: () => {
                let msj = '';
                if (matches) {
                    msj = 'ok';
                } else {
                    const diffs = jsonpatch.compare(received, partialObj);
                    const ignore = ['$parent', '$isSingleNeste', '$__', 'isNew', '_doc',
                        '$locals', '$op', 'createdDate', 'updateDate'];
                    msj += `Received Object: ${JSON.stringify(received)}\n`;
                    msj += 'Differences\n';
                    for (const diff of diffs) {
                        const pth = _.trimStart(_.join(_.map(diff.path, (s) => {
                            if (s === '/') {
                                return '.';
                            } else {
                                return s;
                            }
                        }), ''), '.');
                        if ((!_.find(ignore, (str) => diff.path.includes(str))) && (diff.op !== 'remove')) {
                            const realdiff = _.get(partialObj, pth, '') !== _.get(received, pth, null);
                            msj += (realdiff) ? `${pth} : Received: ${JSON.stringify(_.get(received, pth, null))}` +
                                `, Expected: ${JSON.stringify(_.get(partialObj, pth, ''))}\n` : '';
                        }
                    }

                }
                return msj;
            },
        };
    },
    toMatchPartialArray(received, objArray: any[]) {

        const noMatches = _.reduce(objArray, (results, partialobj) => {

            const f = _.find(received, (obj) => _.matches(partialobj)(obj));
            if (!f) {
                results.push(partialobj);
            }

            return results;
        }, []);
        return {
            pass: noMatches.length === 0,
            message: () => {
                let msj = '';
                if (noMatches.length === 0) {
                    msj = 'ok';
                } else {
                    msj = `Received: ${JSON.stringify(received)}\n NoMatch: ${JSON.stringify(noMatches)}`;

                }
                return msj;
            },
        };
    },
});

export class TestUtils {

    private _collectionName: string;
    private _objects: any = {};
    private _collection: any = {};
    private _mongoConnection;

    public mongoClient = require('mongodb').MongoClient;
    public authorizationJWT: string;
    public sadminauthorizationJWT: string;
    public adminAuthorizationJWT: string;

    private callBackFind(err, res, collectionName) {
        if (err) {
            return err;
        }
        this._objects[collectionName] = res;
    }

    private callBackConnect(err, db, collectionName) {
        if (err) {
            return err;
        }

        return new Promise((resolve) => {
            this._collection[collectionName] = db.collection(collectionName);
            this._collection[collectionName].find({}).toArray(
                // Closure
                (error, res) => {
                    resolve(this.callBackFind(error, res, collectionName));
                },
            );
        });
    }

    public async InitializeApp() {
        try {
            const moduleFixture = await Test.createTestingModule({
                imports: [AppModuleMock],
            }).compile();

            const app = moduleFixture.createNestApplication();
            app.useGlobalPipes(new ValidationPipe({ whitelist: true, transformOptions: { ignoreDecorators: true } }));

            return app.init();
        } catch (error) {
            console.log('error : ', error);
        }
    }

    public async Before(app: INestApplication, collectionName: string | string[], request: any) {
        this.authorizationJWT = '';
        this.adminAuthorizationJWT = '';
        this._collectionName = Array.isArray(collectionName) ? collectionName[0] : collectionName;
        this._objects = {};
        this._collection = {};

        const url = `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PWD)}` +
            `@${process.env.MONGO_HOST}/${process.env.MONGO_DB}`;


        if (collectionName) {
            this._mongoConnection = this.mongoClient.connect(url, {
                useUnifiedTopology: true,
            }, (err, client) => {
                const db = client.db(process.env.MONGO_DB);
                const collections = _.isArray(collectionName) ? collectionName : (collectionName !== '') ? [collectionName] : [];
                _.map(collections, async (collection) => {
                    await this.callBackConnect(err, db, collection);
                });
            });
        }

        // SignIn Admin Keycloak
        const adminSignIn = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                login: process.env.KEYCLOAK_USER,
                password: process.env.KEYCLOAK_PASSWORD
            }).catch(err => { console.log('err : ', err);; throw new Error('SignIn Admin Keycloak ' + err); });

        if (adminSignIn.statusCode !== 201) {
            throw new Error('Unable to login as Admin');
        }

        this.adminAuthorizationJWT = adminSignIn.body.access_token;

        // Remove Keycloak Realm
        await axios.delete(process.env.KEYCLOAK_URL + '/admin/realms/vision', {
            headers: { 'Authorization': 'Bearer ' + this.adminAuthorizationJWT },
        }).catch(err => { console.log('Remove Keycloak Realm ' + err); });

        // Initialize Keycloak Realm
        const init = await request(app.getHttpServer())
            .post('/admin/customers/init?keycloakOnly=true&ignoreEmail=true')
            .set('Authorization', 'Bearer ' + this.adminAuthorizationJWT)
            .send({
                login: user2.username,
                customerKey: user2.customerKey,
                email: user2.email,
                password: '123456',
                firstName: user2.firstName,
                lastName: user2.lastName,
                languages: [
                    {
                        lang: 'fr-FR',
                        value: 'Français'
                    }
                ],
                defaultapplications: []
            }).catch(err => { throw new Error('Initialize Keycloak Realm ' + err); });

        // SignIn Sadmin
        const signInSadmin = await axios.post(process.env.KEYCLOAK_URL + '/realms/vision/protocol/openid-connect/token',
            qs.stringify({
                client_id: 'pwa-studio',
                username: user2.username,
                password: '123456',
                grant_type: 'password'
            })
        ).catch(err => { throw new Error('SignIn Sadmin user ' + err); });

        if (signInSadmin.status !== 200) {
            throw new Error('Unable to login as SAdmin user');
        }

        const sadminJwt = signInSadmin.data.access_token;
        this.sadminauthorizationJWT = `Bearer ${sadminJwt}`
        // Add users
        await Promise.all(
            [
                user1,
                // user2,
                user3,
                user4,
            ].map(user => {
                return request(app.getHttpServer())
                    .post('/users?ignoreEmail=true')
                    .set('Authorization', 'Bearer ' + sadminJwt)
                    .send(user).catch(err => { throw new Error('Add user fail ' + err); })
            })
        ).catch(err => { throw new Error('Init Users ' + err); });

        // Search JSmith User
        const resJsmith = await axios.get(process.env.KEYCLOAK_URL + '/admin/realms/vision/users/?username=' + user1.username,
            {
                headers: { 'Authorization': 'Bearer ' + this.adminAuthorizationJWT },
            }).catch(err => { throw new Error('Search SAdmin User ' + err); });

        if (resJsmith.status !== 200 || resJsmith.data.length !== 1) {
            throw new Error('Unable to retrieve sadmin user');
        }

        // Set Up Password for admin user
        await axios.put(process.env.KEYCLOAK_URL + '/admin/realms/vision/users/' + resJsmith.data[0].id + '/reset-password',
            { 'type': 'password', 'value': '123456', 'temporary': false },
            {
                headers: { 'Authorization': 'Bearer ' + this.adminAuthorizationJWT },
            }).catch(err => { throw new Error('Set Up Password for admin user ' + err); });

        // SignIn JSmith
        const signInJSmith = await axios.post(process.env.KEYCLOAK_URL + '/realms/vision/protocol/openid-connect/token',
            qs.stringify({
                client_id: 'pwa-studio',
                username: user1.username,
                password: '123456',
                grant_type: 'password',
            })).catch(err => { throw new Error('SignIn Sadmin user ' + err); });

        this.authorizationJWT = `Bearer ${signInJSmith.data.access_token}`;

        console.log('Successfully initialized');
    }

    public AfterArray(collectionsName: string[]): Promise<any> {
        const promise$: Promise<any>[] = _.each(collectionsName, (collection) => {
            return this.After(collection);
        });
        return promise$[0];
    }

    public After(collectionName?): Promise<any> {
        const _collectionName = collectionName ? collectionName : this._collectionName;
        // Restore Fixtures
        return new Promise((resolve, reject) => {

            (this._collection[_collectionName]) ? this._collection[_collectionName].deleteMany(
                (err, res) => {
                    if (err) {
                        if (this._mongoConnection) {
                            this._mongoConnection.close();
                        }
                        reject(err);
                    }

                    if (Array.isArray(this._objects[_collectionName]) && this._objects[_collectionName].length > 0) {
                        this._collection[_collectionName].insertMany(this._objects[_collectionName],
                            (error, result) => {
                                if (error) {
                                    if (this._mongoConnection) {
                                        this._mongoConnection.close();
                                    }
                                    reject(error);
                                }

                                if (this._mongoConnection) {
                                    this._mongoConnection.close();
                                }
                                resolve(result);
                            });
                    } else {
                        if (this._mongoConnection) {
                            this._mongoConnection.close();
                        }
                        resolve(true);
                    }
                },
            ) : reject(new Error(`collection ${_collectionName} not find`));
        });
    }

    public insert(collectionName: string, objects: any[]) {
        return new Promise((resolve, reject) => {
            this._collection[collectionName].insert(objects,
                (error, result) => {
                    if (error) {
                        reject();
                    }
                    resolve({ 'result': true });
                });
        });
    }

    public clearDates(data) {
        const delDates = (o) => {
            delete o.updateDate;
            delete o.createdDate;
            return o;
        };
        return Array.isArray(data) ? data.map(delDates) : delDates(data);
    }
}