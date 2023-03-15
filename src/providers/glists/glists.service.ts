import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { GenericList, GenericListValue } from '../../interfaces';
import { BaseService } from '../@base/base.service';

@Injectable()
export class GenericListsSevice extends BaseService<GenericList> {
    constructor(@InjectModel('GenericList') private readonly gListModel: Model<GenericList>) {
        super(gListModel);
    }

    create(customerKey: string, gList: GenericList): Observable<GenericList> {
        const find$: Observable<GenericList> = from(
            this.gListModel.findOne({ customerKey, key: gList.key, deleted: false }).lean());

        return find$.pipe(
            mergeMap((findGList: GenericList) => {
                if (findGList !== null) {
                    throw new BadRequestException('Key already exists');
                } else {
                    return super.create(customerKey, gList);
                }
            }),
        );
    }

    findOne(customerKey: string, id: string): Observable<GenericList> {
        const findGenericList: Observable<GenericList> = super.findOne(customerKey, id);
        return findGenericList.pipe(
            map(gList => {
                if (gList) {
                    return gList;
                } else {
                    throw new BadRequestException('gList unknown');
                }
            }),
        );
    }

    findOneByKey(customerKey: string, key: string): Observable<GenericList> {
        return from(
            this.gListModel.findOne({ customerKey, key, deleted: false }).lean(),
        ).pipe(
            map((gList: GenericList) => {
                if (gList) {
                    return gList;
                } else {
                    throw new BadRequestException('group unknown');
                }
            }),
        );
    }

    findOneValue(customerKey: string, keyL: string, keyV: string): Observable<GenericListValue> {
        return from(
            this.gListModel.findOne({ customerKey, key: keyL, deleted: false }).lean(),
        ).pipe(
            map((gList: GenericList) => {
                if (gList) {
                    const gListValue = gList.values.filter(value => value.key === keyV);
                    if (gListValue && gListValue.length === 1) {
                        return gListValue[0];
                    } else {
                        throw new BadRequestException('gListValue unknown');
                    }
                } else {
                    throw new BadRequestException('gList unknown');
                }
            }),
        );
    }
}