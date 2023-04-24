import { Injectable, BadRequestException } from '@nestjs/common';
import { Observable, of, throwError, zip } from 'rxjs';
import { mergeMap, catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { User } from '../../interfaces';
import { KeycloakService } from '../admin/keycloak.service';

interface Rules {
    rule: string;
    key?: string;
    value?: string;
}

@Injectable()
export class UsersService {

    constructor(
        protected keycloakService: KeycloakService,
    ) { }

    create(customerKey: string, user: User, ignoreEmail: boolean): Observable<User> {
        // Si le login existe
        return this._findKC(customerKey, `?username=${user.username}`).pipe(
            mergeMap((findUser: Array<any>) => {
                if (findUser && findUser.length > 0) {
                    throw new BadRequestException('login already exist');
                } else {
                    // Créer et enregistre le nouveau user
                    return this.keycloakService.requestKeyCloak(customerKey, {
                        url: `/admin/realms/vision/users`,
                        method: 'POST',
                        data: this.interfaceToKeycloakUser(user),
                    }).pipe(
                        mergeMap(() => this.findOneByLogin(customerKey, user.username)),
                    );
                }
            }),
            tap((user: User) => {
                if (ignoreEmail) {
                    return;
                }
                // send email
                this.keycloakService.sendEmailAfterRegister(user.uuid).subscribe();
            }),
            catchError((err) => {
                throw new BadRequestException('unable to create the user', err);
            }),
            mergeMap(() => {
                return this.findOneByLogin(customerKey, user.username);
            }),
        );
    }

    setUpPassword(user: User, customerKey: string, passsord: string) {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/users/${user.uuid}/reset-password`,
            method: 'PUT',
            data: {
                'type': 'password',
                'value': passsord,
                'temporary': false
            },
        }).pipe(
            catchError((err) => {
                console.log(err);
                
                return of(null)}),
            map(() => user)
        );
    }

    delete(customerKey: string, id): Observable<boolean> {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/users/${id}`,
            method: 'DELETE'
        }).pipe(
            catchError(() => {
                throw new BadRequestException('error while deleting the user');
            }),
            map(() => true),
        );
    }

    update(customerKey: string, user: User): Observable<User> {
        return this._update(customerKey, user, user.uuid);
    }

    patch(customerKey: string, uuid: string, partUser): Observable<User> {
        return this.findOne(customerKey, uuid).pipe(
            mergeMap((user: User) => {
                return this._update(customerKey, Object.assign(user, partUser), uuid);
            }),
        );
    }

    _update(customerKey: string, user: User, uuid: string): Observable<User> {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/users/${uuid}`,
            method: 'PUT',
            data: this.interfaceToKeycloakUser(user),
        }).pipe(
            mergeMap(() => {
                return this._applyGroupsToKcUser(customerKey, user);
            }),
            catchError(() => {
                throw new BadRequestException('unable to update the user');
            }),
            mergeMap(() => {
                return this.findOneByLogin(customerKey, user.username);
            }),
        );
    }

    findOne(customerKey: string, id: string): Observable<User> {
        return this._findKC(customerKey, id).pipe(
            mergeMap((user) => {
                if (user) {
                    return this._addGroupsToUser(customerKey, user);
                } else {
                    return of(null);
                }
            }),
            map((user) => user ? this.keycloakUserToInterface(customerKey, user) : null),
        );
    }

    findAll(customerKey: string): Observable<User[]> {
        return this._findKC(customerKey, `?max=-1`).pipe(
            mergeMap((users) => {
                return zip(..._.map(users, user => {
                    return this._addGroupsToUser(customerKey, user);
                }));
            }),
            map((users) => {
                return _.map(users, (u) => this.keycloakUserToInterface(customerKey, u));
            }),
        );
    }

    findOneByLogin(customerKey: string, username: string): Observable<User> {
        return this._findOne(customerKey, `?username=${username}`).pipe(
            mergeMap((user) => {
                if (user) {
                    return this._addGroupsToUser(customerKey, user);
                } else {
                    return of(null);
                }
            }),
            map((user) => user ? this.keycloakUserToInterface(customerKey, user) : null),
        );
    }

    _addGroupsToUser(customerKey: string, user) {
        return this._findUsersGroups(customerKey, user.id).pipe(
            catchError((err) => {
                return of(err);
            }),
            map((groups) => {
                return Object.assign(user, { groups: _.map(groups, g => g.name) })
            }),
        );
    }

    _findUsersGroups(customerKey: string, id: string): Observable<[]> {
        return this._findKC(customerKey, `${id}/groups`);
    }

    _getAllGroups(customerKey: string): Observable<[]> {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/groups/`,
            method: 'GET'
        });
    }

    _applyGroupsToKcUser(customerKey: string, user: User): Observable<any> {
        return zip(this._getAllGroups(customerKey), this._findUsersGroups(customerKey, user.uuid)).pipe(
            mergeMap(([allGroups, usersKcGroups]) => {
                const usersUpdateGroups = _.cloneDeep(user.groups);
                const $operations = [];

                allGroups.map((group: any) => {
                    const isInKc = !!_.find(usersKcGroups, { id: group.id });
                    const isInUser = usersUpdateGroups.includes(group.name);

                    if (isInUser && !isInKc) {
                        $operations.push(this._addUserToGroup(customerKey, user.uuid, group.id));
                    }
                    if (!isInUser && isInKc) {
                        $operations.push(this._removeUserToGroup(customerKey, user.uuid, group.id));
                    }
                });

                return $operations.length === 0 ? of([]) : zip(...$operations);
            }),
        );
    }

    _addUserToGroup(customerKey: string, userId: string, groupId: string): Observable<any> {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/users/${userId}/groups/${groupId}`,
            method: 'PUT',
            data: {},
        }).pipe(
            catchError(() => {
                throw new BadRequestException('unable to update the user');
            }),
        );
    }

    _removeUserToGroup(customerKey: string, userId: string, groupId: string): Observable<any> {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/users/${userId}/groups/${groupId}`,
            method: 'DELETE',
            data: {},
        }).pipe(
            catchError(() => {
                throw new BadRequestException('unable to update the user');
            }),
        );
    }

    _findOne(customerKey: string, request) {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/users/${request}`,
            method: 'GET'
        }).pipe(
            map((user: Array<any>) => {
                if (user.length !== 1) {
                    throw new Error('Users:_findOne bad length of array');
                }
                return user[0];
            }
            ));
    }

    _findKC(customerKey: string, request) {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/users/${request}`,
            method: 'GET'
        });
    }

    getEmailByGroup(customerKey: string, groupKey: string): Observable<string[]> {
        return this.findAll(customerKey).pipe(
            map((allUsers: User[]) => {
                return _.reduce(allUsers, function (emails, user: User) {
                    if (user.groups.includes(groupKey)) {
                        emails.push(user.email);
                    }
                    return emails;
                }, []);
            }),
        );
    }

    removeMobileToken(customerKey: string, uuid: string, clientId: string): Observable<boolean> {
        return this.patch(customerKey, uuid, { mobileToken: '' })
            .pipe(
                mergeMap(() => this.keycloakService.revokeOfflineToken(uuid, clientId)),
                map(() => {
                    return true;
                }),
            );
    }

    getMobileToken(customerKey: string, to: string[], exclude: string): Observable<string[]> {
        const users = [];
        const groups = [];

        _.each(to, (recipient: string) => {
            if (recipient.startsWith('grp:')) {
                groups.push(recipient.slice(4));
            } else if (recipient.startsWith('usr:')) {
                users.push(recipient.slice(4));
            }
        });

        return this.findAll(customerKey).pipe(
            map((allUsers: User[]) => {
                return _.reduce(allUsers, function (mobileTokens, user: User) {
                    if (user.username !== exclude &&
                        (users.includes(user.username) || _.intersection(groups, user.groups).length > 0)
                    ) {
                        mobileTokens.push(user.mobileToken);
                    }
                    return mobileTokens;
                }, []);
            }),
        );
    }

    private keycloakUserToInterface(customerKey: string, user): User {
        return {
            uuid: user.id,
            customerKey,
            deleted: false,
            preferedLang: user.attributes.locale && user.attributes.locale.length === 1 ? user.attributes.locale[0] : '',
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            groups: user.groups,
            enabled: user.enabled,
            pictureUrl: user.attributes.pictureUrl && user.attributes.pictureUrl.length === 1 ? user.attributes.pictureUrl[0] : '',
            following: user.attributes.following || [],
            favorites: {
                documents: user.attributes.favoritesDoc || [],
                smartObjects: user.attributes.favoritesSo || [],
            },
            mobileToken: user.attributes.mobileToken && user.attributes.mobileToken.length === 1 ? user.attributes.mobileToken[0] : '',
        };
    }

    private interfaceToKeycloakUser(user: User) {
        return {
            id: '',
            username: user.username,
            enabled: user.enabled,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            groups: _.map(user.groups, g => '/' + g),
            attributes: {
                locale: [user.preferedLang || ''],
                pictureUrl: [user.pictureUrl || ''],
                mobileToken: [user.mobileToken || ''],
                following: user.following || [],
                favoritesDoc: user.favorites?.documents || [],
                favoritesSo: user.favorites?.smartObjects || [],
            },
        };
    }

}
