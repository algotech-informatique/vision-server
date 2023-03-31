import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { CustomerInit, CustomerInitResult, Group } from '../../interfaces';
import { RxExtendService } from '../rx-extend/rx-extend.service';
import { KeycloakService } from '../admin/keycloak.service';
import { ATGroupUtils } from '@algotech-ce/core';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class GroupService {
    constructor(
        protected keycloakService: KeycloakService,
        protected utils: UtilsService,
        protected rxExt: RxExtendService,
    ) { }

    init(customer: CustomerInit): Observable<CustomerInitResult> {
        const result: CustomerInitResult = {
            key: 'groups',
            value: 'ko',
        };
        const cmds$: Observable<Group>[] = _.map(ATGroupUtils.getDefaults(), (group) => {
            const initGroup: Group = {
                uuid: '',
                deleted: false,
                customerKey: '',
                createdDate: '',
                updateDate: '',
                key: group.key,
                name: group.name,
                description: '',
                application: {
                    authorized: [],
                    default: {
                        web: '',
                        mobile: '',
                    },
                },
            };
            return this.create(customer.customerKey, initGroup, group.roles);
        });

        return this.rxExt.sequence(cmds$).pipe(
            map((groups) => {
                Logger.log('groups/init');
                Logger.log(_.size(groups), 'size(groups)');
                if (_.size(groups) === _.size(ATGroupUtils.getDefaults())) {
                    result.value = 'ok';
                } else {
                    result.value = 'ko';
                }
                return result;
            }),
            catchError((err) => {
                result.value = 'ko';
                throw new InternalServerErrorException(result);
            }));
    }

    findOne(customerKey: string, id: string): Observable<Group> {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/groups/${id}`,
            method: 'GET'
        }).pipe(
            map((g) => this.keycloakGroupToInterface(customerKey, g)),
        );
    }

    findAll(customerKey: string): Observable<Group[]> {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/groups?briefRepresentation=false`,
            method: 'GET'
        }).pipe(
            map((groups) => {
                for (const g of groups) {
                    if (g.subGroups.length > 0) {
                        groups.push(...g.subGroups);
                    }
                }
                return _.map(groups, (g) => this.keycloakGroupToInterface(customerKey, g));
            }),
        );
    }

    create(customerKey: string, group: Group, roles?): Observable<Group> {
        // Si le name existe
        return this.findByKey(customerKey, group.key).pipe(
            mergeMap((findGroup: Group) => {
                if (findGroup) {
                    throw new BadRequestException('name already exist');
                } else {
                    // Créer et enregistre le nouveau group
                    return this.keycloakService.requestKeyCloak(customerKey, {
                        url: `/admin/realms/vision/groups`,
                        method: 'POST',
                        data: this.interfaceToKeycloakGroup(group),
                    });
                }
            }),
            catchError((err) => {
                throw new BadRequestException('unable to create the group');
            }),
            mergeMap(() => {
                return this.findOneByKey(customerKey, group.key);
            }),
        );
    }

    update(customerKey: string, group: Group): Observable<Group> {
        return this.findOneByKey(customerKey, group.key).pipe(
            mergeMap((d) => {
                return this.keycloakService.requestKeyCloak(customerKey, {
                    url: `/admin/realms/vision/groups/${d.uuid}`,
                    method: 'PUT',
                    data: this.interfaceToKeycloakGroup(group),
                })
            }),
            catchError((err) => {
                throw new BadRequestException(err);
            }),
            mergeMap(() => {
                return this.findOneByKey(customerKey, group.key);
            }),
        );
    }

    delete(customerKey: string, id): Observable<boolean> {
        return this.keycloakService.requestKeyCloak(customerKey, {
            url: `/admin/realms/vision/groups/${id}`,
            method: 'DELETE'
        }).pipe(
            catchError(() => {
                throw new BadRequestException('error while deleting the group');
            }),
            map(() => true),
        );
    }

    findOneByKey(customerKey: string, key: string): Observable<Group> {
        return this.findAll(customerKey).pipe(
            mergeMap((groups: Group[]) => {
                const group = _.find(groups, { key });
                if (group) {
                    return of(group);
                } else {
                    throw new BadRequestException('group unknown');
                }
            }),
        );
    }

    private findByKey(customerKey: string, key: string): Observable<Group> {
        return this.findAll(customerKey).pipe(
            map((groups: Group[]) => {
                const group: Group = _.find(groups, { key });
                return group;
            }),
        );
    }

    private keycloakGroupToInterface(customerKey: string, group): Group {
        return {
            uuid: group.id,
            customerKey,
            deleted: false,
            key: group.name,
            name: group.attributes.name && group.attributes.name.length === 1 ? group.attributes.name[0] : '',
            description: group.attributes.description && group.attributes.description.length === 1 ? group.attributes.description[0] : '',
            application: {
                authorized: group.attributes.applicationAuthorized || [],
                default: {
                    mobile: group.attributes.defaultMobile && group.attributes.defaultMobile.length === 1 ? group.attributes.defaultMobile[0] : '',
                    web: group.attributes.defaultWeb && group.attributes.defaultWeb.length === 1 ? group.attributes.defaultWeb[0] : '',
                },
            },
        };
    }

    private interfaceToKeycloakGroup(group: Group) {
        return {
            name: group.key,
            attributes: {
                name: [group.name || ''],
                description: [group.description || ''],
                applicationAuthorized: group.application.authorized || [],
                defaultMobile: [group.application.default.mobile || ''],
                defaultWeb: [group.application.default.web || ''],
            },
            /* realmRoles: [
                "app-admin"
            ],
            clientRoles: {
                "realm-management": [
                    "manage-clients",
                    "query-realms",
                    "manage-events",
                    "manage-identity-providers",
                    "query-clients",
                    "impersonation",
                    "query-users",
                    "realm-admin",
                    "create-client",
                    "query-groups",
                    "manage-realm",
                    "manage-users",
                    "manage-authorization"
                ]
            }, */
        };
    }
}
