import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { concat, Observable, of, pipe, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios'; 
import { map, mergeMap, concatAll, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { Customer, CustomerInit, CustomerInitResult, CustomerSearch, User, UserSearch } from '../../interfaces';
import * as qs from 'qs';
import { AxiosResponse } from 'axios';
import { addRealm, generateSecret, revokeOfflineToken, sendEmailAfterRegister } from './keycloak-cmd';

const keycloak_url = process.env.KEYCLOAK_URL ? process.env.KEYCLOAK_URL : 'http://keycloak:8080/auth';

@Injectable()
export class KeycloakService {
    constructor(
        private readonly httpService: HttpService,
    ) { }

    clientSecret;

    clientId = 'vision-server';

    initKeyCloakRealm(customer: CustomerInit) {
        const result: CustomerInitResult = {
            key: 'realm',
            value: 'ko',
        };
        return this.requestKeyCloak(customer.customerKey, addRealm(customer)).pipe(
            mergeMap(() => {
                return this.requestKeyCloak(customer.customerKey, generateSecret(customer, 'vision', 'vision-server'));
            }),
            map(() => {
                result.value = 'ok';
                return result;
            }),
            catchError(() => {
                result.value = 'ko';
                throw new InternalServerErrorException(result);
            }));
    }

    deleteKeyCloakRealm() {
        return this.requestKeyCloak('', {
            url: '/admin/realms/vision',
            method: 'DELETE',
            data: {}
        });
    }

    sendEmailAfterRegister(userId: string) {
        return this.requestKeyCloak('', sendEmailAfterRegister('', 'vision', userId));
    }

    validateTokenUser(token: string): Observable<boolean> {
        return this.getClientSecret().pipe(
            mergeMap((clientSecret: string) => this.httpService.post(keycloak_url + `/realms/vision/protocol/openid-connect/token/introspect`,
                qs.stringify({
                    'token_type_hint': 'requesting_party_token',
                    'token': token
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + clientSecret).toString('base64'),
                    }
                }).pipe(
                    map((response) => {
                        if (response.status !== 200) {
                            throw new Error('Token validity check failed');
                        }
                        return response.data && response.data.active;
                    }),
                    catchError((e) => {
                        return e;
                    })
                )
            )
        );
    }

    validateTokenAdmin(token: string): Observable<boolean> {
        return this.httpService.get(keycloak_url + '/realms/master/protocol/openid-connect/userinfo',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            }) .pipe(
                catchError((err) => {
                    return throwError(() => new Error('Token validity check failed'));
                }),
                mergeMap((response) => {
                    if (response.status !== 200) {
                        return throwError(() => new Error('Token validity check failed'));
                    }
                    return of(!!response);

                }),
            );
    }

    getClientSecret() {
        if (this.clientSecret && this.clientSecret !== '') {
            return of(this.clientSecret);
        }

        return this._loginAdmin(process.env.KEYCLOAK_USER, process.env.KEYCLOAK_PASSWORD).pipe(
            mergeMap((data) => {
                if (!data) {
                    return throwError(() => new Error('Unable to authenticate to Keycloak'));
                }

                const bearer = data.access_token;

                return this.httpService.get(keycloak_url + `/admin/realms/vision/clients/${this.clientId}/client-secret`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + bearer,
                        }
                    });
            }),
            mergeMap((resHttp: AxiosResponse) => {
                return (resHttp && resHttp.data) ?
                    of(resHttp.data) : of(null);
            }),
            map((clientSecret: { type: string, value: string }) => {
                if (!clientSecret || !clientSecret.value) {
                    console.log(clientSecret);
                    throw new Error('Unable to retrieve the client-secret');
                }

                this.clientSecret = clientSecret.value;

                return clientSecret.value;
            }),
        );
    }

    revokeOfflineToken(userId: string, clientId: string) {
        return this.requestKeyCloak(null, revokeOfflineToken('vision', userId, clientId));
    }

    requestKeyCloak(customerKey, request: { url: string, method, data?: any }) {
        return this._loginAdmin(process.env.KEYCLOAK_USER, process.env.KEYCLOAK_PASSWORD).pipe(
            mergeMap((data) => {
                if (!data) {
                    throwError(() => new Error('Unable to authenticate to Keycloak'))
                }

                return this.httpService.request({
                    url: process.env.KEYCLOAK_URL + request.url,
                    method: request.method,
                    data: request.data || null,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + data.access_token,
                    }
                });
            }),
            mergeMap((resHttp: AxiosResponse) => {
                return (resHttp && resHttp.data) ?
                    of(resHttp.data) : of(null);
            }),
        );
    }

    signInAdmin(login, password) {
        return this._loginAdmin(login, password);
    }

    _loginAdmin(login, password) {
        return this.httpService.post(keycloak_url + '/realms/master/protocol/openid-connect/token',
            qs.stringify({
                'username': login,
                'password': password,
                'client_id': 'admin-cli',
                'grant_type': 'password',
                'scope': 'openid'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        ).pipe(
            mergeMap((resHttp: AxiosResponse) => {
                return (resHttp && resHttp.data) ?
                    of(resHttp.data) : of(null);
            }),
        );
    }

}
