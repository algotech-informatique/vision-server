import { mergeMap } from 'rxjs/operators';
import { IdentityRequest, TagList } from '../../interfaces';
import { Injectable, BadRequestException } from '@nestjs/common';
import { TagsService } from './tags.service';
import { of, Observable, throwError } from 'rxjs';
import { CacheDto } from '@algotech-ce/core';

@Injectable()
export class TagsHead {

    constructor(private readonly tagsService: TagsService) { }

    findOne(data: { identity: IdentityRequest; uuid?: string; key?: string }): Observable<TagList> {
        if (data.uuid) {
            return this.tagsService.findOne(data.identity.customerKey, data.uuid);
        } else if (data.key) {
            return this.tagsService.findOneByKey(data.identity.customerKey, data.key);
        }
    }

    findAll(data: { identity: IdentityRequest }): Observable<TagList[]> {
        return this.tagsService.findAll(data.identity.customerKey);
    }

    create(data: { identity: IdentityRequest; tagList: TagList }): Observable<TagList> {
        return this.tagsService.create(data.identity.customerKey, data.tagList);
    }

    cache(data: { identity: IdentityRequest, date: string }): Observable<CacheDto> {
        return this.tagsService.cache(data.identity.customerKey, data.date);
    }

    update(data: { identity: IdentityRequest; tagList: TagList }): Observable<TagList> {
        return this.tagsService.update(data.identity.customerKey, data.tagList);
    }

    delete(data: { identity: IdentityRequest; uuid: string }): Observable<boolean> {
        const obsDelete = this.tagsService.delete(data.identity.customerKey, data.uuid);
        return obsDelete.pipe(mergeMap(
            (result: boolean) => {
                if (result === true) {
                    return of(result);
                } else {
                    return throwError(() => new BadRequestException('Delete tag list failed'));
                }
            },
        ));
    }
}
