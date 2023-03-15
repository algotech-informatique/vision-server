import { Injectable, BadRequestException } from '@nestjs/common';
import { TagList, Tag } from '../../interfaces';
import { InjectModel } from '@nestjs/mongoose/index';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import { Observable, from, of, zip, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { BaseService } from '../@base/base.service';

@Injectable()
export class TagsService extends BaseService<TagList> {
    constructor(
        @InjectModel('Tags') private readonly tagsModel: Model<TagList>,
    ) {
        super(tagsModel);
    }

    create(customerKey: string, tagList: TagList): Observable<TagList> {

        // Si le name existe
        const obsTagList: Observable<TagList> = this.findOneByKey(customerKey, tagList.key).pipe(
            catchError((err) => of(null)),
            map((d) => {
                if (d === null && !this.checkDuplicateKey(tagList.tags)) {
                    return d;
                } else {
                    throw new BadRequestException('tag list key already exist');
                }
            }),
        );
        const obsTags: Observable<TagList[]>[] = _.map(tagList.tags, (tag) => {
            return from(this.tagsModel.find<TagList[]>({ customerKey, 'tags.key': tag.key, 'deleted': false }).lean()).pipe(
                map((d) => {
                    if (d.length > 0) {
                        throw new BadRequestException('tag key already exist');
                    } else {
                        return d;
                    }
                }),
            );    
        });

        return zip(obsTagList, ...obsTags).pipe(
            mergeMap(() => {
                // Créer et enregistre la nouvelle tagList
                return super.create(customerKey, tagList);
            }),
        );
    }

    findOne(customerKey: string, id: string): Observable<TagList> {
        const findTagList: Observable<TagList> = super.findOne(customerKey, id);
        return findTagList.pipe(
            mergeMap(tagList => {
                if (tagList) {
                    return of(tagList);
                } else {
                    throw new BadRequestException('tag list unknown');
                }
            }),
        );
    }

    findOneByKey(customerKey: string, key: string): Observable<TagList> {
        return from(
            this.tagsModel.findOne({ customerKey, key, deleted: false }).lean(),
        ).pipe(
            mergeMap((tagList: TagList) => {
                if (tagList) {
                    return of(tagList);
                } else {
                    throw new BadRequestException('tag list unknown');
                }
            }),
        );
    }

    update(customerKey: string, tagList: TagList): Observable<TagList> {

        // Si le name existe
        const obsTagList: Observable<TagList> = from(
            this.tagsModel.findOne({ customerKey, uuid: { $ne: tagList.uuid }, key: tagList.key, deleted: false }),
        ).pipe(
            catchError((err) => of(null)),
            map((d) => {
                if (d === null && !this.checkDuplicateKey(tagList.tags)) {
                    return d;
                } else {
                    throw new BadRequestException('tag list key already exist');
                }
            }),
        );
        const obsTags: Observable<TagList[]>[] = _.map(tagList.tags,
            (tag) => from(
                this.tagsModel.find<TagList[]>({ customerKey, 'uuid': { $ne: tagList.uuid }, 'tags.key': tag.key, 'deleted': false }).lean(),
            ).pipe(
                map((d) => {
                    if (d.length > 0) {
                        throw new BadRequestException('tag key already exist');
                    } else {
                        return d;
                    }
                }),
            ),
        );
        return zip(obsTagList, ...obsTags).pipe(
            mergeMap(() => {
                const updateobject: any = _.cloneDeep(tagList);
                updateobject.updateDate = new Date().toISOString();
                // Update la tagList
                return from(
                    this.tagsModel.findOneAndUpdate({ uuid: tagList.uuid, customerKey, deleted: false },
                        updateobject,
                        {
                        new: true,
                        runValidators: true,
                        select: {
                            _id: 0,
                            deleted: 0,
                        },
                    }).lean(),
                );
            }),
        );
    }

    delete(customerKey: string, id: string, real?: boolean): Observable<boolean> {
        return this.findOne(customerKey, id).pipe(
            catchError((err) => {
                throwError(() => new BadRequestException('Delete tag list failed'));
                return of(false);
            }),
            mergeMap((d) => {
                return (d) ? super.delete(customerKey, id) : of(false);
            }),
        );
    }

    private checkDuplicateKey(tags: Tag[]): boolean {
        return tags.length !== _.uniq(_.map(tags, (tag) => tag.key)).length;
    }

}
