import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SmartModelsService } from './smart-models.service';
import { PatchPropertyDto, QuerySearchDto } from '@algotech-ce/core';
import { IdentityRequest, SmartModel } from '../../interfaces';

@Injectable()
export class SmartModelsHead {
    constructor(
        private readonly smartModelService: SmartModelsService,
    ) { }

    create(data: { identity: IdentityRequest, data }): Observable<SmartModel> {
        return this.smartModelService.create(data.identity.customerKey, data.data);
    }

    cache(data: { identity: IdentityRequest, date: string }) {
        return this.smartModelService.cache(data.identity.customerKey, data.date);
    }

    find(data: {
        identity: IdentityRequest,
        uuid?: string,
        key?: string,
        system?: boolean,
        submodel?: boolean,
        skills?: string,
        ignoreModelKeys?: string[] // to prevent fetching models that are already known
    }): Observable<SmartModel|SmartModel[]> {
        if (data.uuid) {
            return this.smartModelService.findOne(data.identity.customerKey, data.uuid);
        } else if (data.key) {
            if (data.submodel) {
                return this.smartModelService.findOneWithSubModel(data.identity.customerKey, data.key, data.ignoreModelKeys);
            } else {
                return this.smartModelService.findOneByKey(data.identity.customerKey, data.key);
            }
        } else if (data.system) {
            return this.smartModelService.findAllSystem(data.identity.customerKey);

        } else if (data.skills && data.skills !== '') {
            return this.smartModelService.findAndFilter(data.identity.customerKey, data.skills);

        } else {
            return this.smartModelService.findAll(data.identity.customerKey);
        }
    }

    findOneByExactKey(data: {identity: IdentityRequest, key: string}): Observable<SmartModel> {
        return this.smartModelService.findOneByExactKey(data.identity.customerKey, data.key);
    }

    delete(data: { identity: IdentityRequest, data }): Observable<boolean> {
        return this.smartModelService.delete(data.identity.customerKey, data.data);
    }

    update(data: { identity: IdentityRequest, changes: SmartModel }): Observable<SmartModel> {
        return this.smartModelService.update(data.identity.customerKey, data.changes);
    }

    patch(data: { identity: IdentityRequest; uuid: string, patches: PatchPropertyDto[] }): Observable<PatchPropertyDto[]> {
        return this.smartModelService.patchProperty(data.identity.customerKey, data.uuid, data.patches);
    }

    smartObjectsPermissions(data: {
        identity: IdentityRequest,
        query: QuerySearchDto,
        target: string,
    }): Observable<{ modelKey: string; properties: string }[]> {
        return this.smartModelService.smPermissions(
            data.identity,
            data.query,
            data.target);
    }
}
