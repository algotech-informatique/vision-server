import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { BaseService } from '../@base/base.service';
import { ApplicationModel } from '../../interfaces';

@Injectable()
export class ApplicationModelsService extends BaseService<ApplicationModel> {

    constructor(
        @InjectModel('ApplicationModel') private readonly applicationModel: Model<ApplicationModel>,
    ) {
        super(applicationModel);
    }

    public create(customerKey: string, applicationModel: ApplicationModel): Observable<ApplicationModel> {

        const obsFindOne: Observable<ApplicationModel> = from(this.applicationModel.findOne(
            { customerKey, key: applicationModel.key, deleted: false }));
        return obsFindOne.pipe(
            mergeMap((model) => {
                if (model) {
                    throw new BadRequestException('application model already exist');
                } else {
                    const modelToCreate = Object.assign({}, applicationModel, { deleted: false });
                    return super.create(customerKey, modelToCreate);
                }
            }),
        );
    }

    public publish(customerKey: string, applicationModel: ApplicationModel): Observable<ApplicationModel> {

        const obsFindOne: Observable<ApplicationModel> = from(this.applicationModel.findOne(
            { customerKey, snModelUuid: applicationModel.snModelUuid, deleted: false }));

        return obsFindOne.pipe(
            mergeMap((findApplicationModel: ApplicationModel) => {
                if (findApplicationModel) {
                    return super.update(customerKey, _.assign(applicationModel, { uuid: findApplicationModel.uuid }));
                } else {
                    return super.create(customerKey, applicationModel, true);
                }
            }),
        );
    }

    findOne(customerKey: string, id: string): Observable<ApplicationModel> {

        const findApplicationModel: Observable<ApplicationModel> = super.findOne(customerKey, id);

        return findApplicationModel.pipe(
            mergeMap(applicationModel => {
                if (applicationModel) {
                    return of(applicationModel);
                } else {
                    throw new BadRequestException('application model unknow');
                }
            }),
        );
    }

    findOneByKey(customerKey: string, key: string): Observable<ApplicationModel> {

        return from(
            this.applicationModel.findOne({ customerKey, key, deleted: false }).lean(),
        ).pipe(
            mergeMap((applicationModel: ApplicationModel) => {
                if (applicationModel) {
                    return of(applicationModel);
                } else {
                    throw new BadRequestException('application model unknown');
                }
            }),
        );
    }

    findOneBySnModel(customerKey: string, snModelUuid: string): Observable<ApplicationModel> {

        return from(
            this.applicationModel.findOne({ customerKey, snModelUuid, deleted: false }).lean(),
        ).pipe(
            map((applicationModel: ApplicationModel) => {
                if (applicationModel) {
                    return applicationModel;
                } else {
                    return null;
                }
            }),
        );
    }

    deleteBySnModel(customerKey: string, snModelUuid: string, real?: boolean) {

        const findApplicationModelToDelete = this.findOneBySnModel(customerKey, snModelUuid);
        return findApplicationModelToDelete.pipe(
            mergeMap((applicationModel: ApplicationModel) => {
                if (applicationModel) {
                    return super.delete(customerKey, applicationModel.uuid, real);
                } else {
                    return of(false);
                }
            }),
        );
    }
}
