import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupService } from './groups.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CustomerInit, CustomerInitResult, Group, IdentityRequest } from '../../interfaces';
import { ATGroupUtils } from '@algotech-ce/core';
import * as _ from 'lodash';

@Injectable()
export class GroupHead {
    constructor(
        private readonly groupService: GroupService) { }

    init(data: { customer: CustomerInit }): Observable<CustomerInitResult> {
        return this.groupService.init(data.customer);
    }

    findOne(data: { identity: IdentityRequest, uuid?: string, key?: string }): Observable<Group> {
        if (data.uuid) {
            return this.groupService.findOne(data.identity.customerKey, data.uuid);
        } else if (data.key) {
            return this.groupService.findOneByKey(data.identity.customerKey, data.key);
        } else {
            throw new Error('key or uuid undefined');
        }
    }

    findAll(data: { identity: IdentityRequest }): Observable<Group[]> {
        return this.groupService.findAll(data.identity.customerKey);
    }

    create(data: { identity: IdentityRequest, group: Group }): Observable<Group> {
        return this.groupService.create(data.identity.customerKey, data.group);
    }

    /* cache(data: { identity: IdentityRequest, date: Date }) {
        return this.groupService.cache(data.identity.customerKey, data.date);
    } */

    update(data: { identity: IdentityRequest, group: Group }): Observable<Group> {
        return this.findOne({ identity: data.identity, uuid: data.group.uuid, key: data.group.key }).pipe(
            mergeMap((grp) => {
                if (ATGroupUtils.isDefault(data.group)) {
                    const value = Object.assign(_.cloneDeep(data.group), { uuid: 0, application: 0, deleted: 0, customerKey: 0 });
                    const compare = Object.assign(_.cloneDeep(grp), { uuid: 0, application: 0, deleted: 0, customerKey: 0 });

                    // compare grp exclude application
                    if (!_.isEqual(value, compare)) {
                        throw new Error(`Unable to update group [${data.group.key}] because it is a default group`);
                    }
                }

                return this.groupService.update(data.identity.customerKey, Object.assign(data.group, { uuid: grp.uuid, key: grp.key }));
            }),
        );
    }

    delete(data: { identity: IdentityRequest, uuid: string }): Observable<boolean> {
        const obsDelete$: Observable<boolean> = this.findOne(data).pipe(
            catchError((err) => {
                return of(false);
            }),
            mergeMap((group) => {
                if (!group) {
                    return of(false);
                }
                if (typeof group === 'object' && ATGroupUtils.isDefault(group)) {
                    throw new Error(`Unable to delete group [${group.key}] because it is a default group`);
                }
                return this.groupService.delete(data.identity.customerKey, data.uuid);
            }),
        );
        return obsDelete$.pipe(mergeMap(
            (result: boolean) => {
                if (result === true) {
                    return of(result);
                }
                throw new BadRequestException('Delete group failed');
            },
        ));
    }

}