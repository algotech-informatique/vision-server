import { PatchPropertyDto } from '@algotech/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ApplicationModel, IdentityRequest } from '../../interfaces';
import { ApplicationModelsService } from './application-models.service';

@Injectable()
export class ApplicationModelsHead {

    constructor(
        private readonly applicationModelService: ApplicationModelsService,
    ) { }

    create(ws: { identity: IdentityRequest, data: ApplicationModel }): Observable<ApplicationModel> {

        return this.applicationModelService.create(ws.identity.customerKey, ws.data)
    }

    cache(data: { identity: IdentityRequest, date: string }) {
        return this.applicationModelService.cache(data.identity.customerKey, data.date);
    }

    find(data: {
        identity: IdentityRequest;
        uuid?: string;
        key?: string;
        snModelUuid?: string;
    }): Observable<ApplicationModel | ApplicationModel[]> {

        if (data.uuid) {
            return this.applicationModelService.findOne(data.identity.customerKey, data.uuid)
        } else if (data.key) {
            return this.applicationModelService.findOneByKey(data.identity.customerKey, data.key)
        } else if (data.snModelUuid) {
            return this.applicationModelService.findOneBySnModel(data.identity.customerKey, data.snModelUuid).pipe(
                mergeMap((applicationModel) => {
                    if (!applicationModel) {
                        throw new BadRequestException('No application linked to this Model');
                    }
                    return of(applicationModel);
                }),
            )
        }
        else {
            return this.applicationModelService.findAll(data.identity.customerKey);
        }
    }

    delete(ws: { identity: IdentityRequest, data?, snModelUuid?: string }): Observable<boolean> {

        const obsDelete = (ws.data) ? this.applicationModelService.delete(ws.identity.customerKey, ws.data) :
            this.applicationModelService.deleteBySnModel(ws.identity.customerKey, ws.snModelUuid);
        return obsDelete.pipe(
            mergeMap((result: boolean) => {
                if (result === true) {
                    return of(result);
                } else {
                    return throwError(() => new BadRequestException('Delete application failed'));
                }
            },
            ));
    }

    patch(ws: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {

        return this.applicationModelService.patchProperty(ws.identity.customerKey, ws.data.uuid, ws.data.patches);
    }

    publish(data: { identity: IdentityRequest, applicationModel: ApplicationModel }): Observable<ApplicationModel> {

        return this.applicationModelService.publish(data.identity.customerKey, data.applicationModel)
    }
}
