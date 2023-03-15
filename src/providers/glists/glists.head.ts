import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { GenericListsSevice } from './glists.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { PatchPropertyDto } from '@algotech/core';
import { GenericList, GenericListValue, IdentityRequest } from '../../interfaces';

@Injectable()
export class GenericListsHead {
    constructor(
        private readonly gListsService: GenericListsSevice,
    ) { }

    getAll(data: { identity: IdentityRequest }): Observable<GenericList[]> {
        return this.gListsService.findAll(data.identity.customerKey);
    }

    get(data: { identity: IdentityRequest; uuid: string }): Observable<GenericList> {
        return this.gListsService.findOne(data.identity.customerKey, data.uuid);
    }

    getByKey(data: { identity: IdentityRequest; keyList: string; keyValue?: string }): Observable<GenericListValue | GenericList> {
        if (data.keyValue) {
            return this.gListsService.findOneValue(data.identity.customerKey, data.keyList, data.keyValue);
        } else {
            return this.gListsService.findOneByKey(data.identity.customerKey, data.keyList);
        }
    }

    create(data: { identity: IdentityRequest; gList: GenericList; }): Observable<GenericList> {
        return this.gListsService.create(data.identity.customerKey, data.gList);
    }

    cache(data: { identity: IdentityRequest, date: string }) {
        return this.gListsService.cache(data.identity.customerKey, data.date);
    }

    update(data: { identity: IdentityRequest; updateGenericList: GenericList }): Observable<GenericList> {
        return this.gListsService.update(data.identity.customerKey, data.updateGenericList);
    }

    patch(data: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {
        return this.gListsService.patchProperty(data.identity.customerKey, data.data.uuid, data.data.patches);
    }

    delete(data: { identity: IdentityRequest; uuid: string }): Observable<boolean> {
        const obsDelete$ = this.get(data).pipe(
            catchError((err) => {
                return of(false);
            }),
            mergeMap((value: GenericList) => {
                return (value) ? this.gListsService.delete(data.identity.customerKey, data.uuid) : of(false);
            }),
        );
        return obsDelete$.pipe(
            mergeMap((result: boolean) => {
                if (result === true) {
                    return of(result);
                } else {
                    return throwError(() => new BadRequestException('Delete gList failed'));
                }
            }),
        );
    }
}