import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { BaseService } from '../@base/base.service';
import { WorkflowModel } from '../../interfaces';

@Injectable()
export class WorkflowModelsService extends BaseService<WorkflowModel> {
    constructor(
        @InjectModel('WorkflowModel') private readonly workflowModel: Model<WorkflowModel>,
    ) {
        super(workflowModel);
    }

    public create(customerKey: string, workflowModel: WorkflowModel): Observable<WorkflowModel> {
        const obsFindOne: Observable<WorkflowModel> = from(this.workflowModel.findOne(
            { customerKey, key: workflowModel.key, deleted: false }).lean());

        return obsFindOne.pipe(
            mergeMap((model: WorkflowModel) => {
                if (model) {
                    throw new BadRequestException('model already exist');
                } else {
                    const modelToCreate = Object.assign({}, workflowModel, { deleted: false });
                    return super.create(customerKey, modelToCreate);
                }
            }),
        );
    }

    public publish(customerKey: string, workflow: WorkflowModel): Observable<WorkflowModel> {
        const obsFindOne: Observable<WorkflowModel> = from(this.workflowModel.findOne(
            { customerKey, snModelUuid: workflow.snModelUuid, deleted: false }).lean());
        return obsFindOne.pipe(
            mergeMap((findWorkflow: WorkflowModel) => {
                if (findWorkflow) {
                    return super.update(customerKey, _.assign(workflow, { uuid: findWorkflow.uuid }));
                } else {
                    return super.create(customerKey, workflow, true);
                }
            }),
        );
    }

    findOne(customerKey: string, id: string): Observable<WorkflowModel> {
        const findWorkflowModel: Observable<WorkflowModel> = super.findOne(customerKey, id);
        return findWorkflowModel.pipe(
            mergeMap(workflowModel => {
                if (workflowModel) {
                    return of(workflowModel);
                } else {
                    throw new BadRequestException('workflow model unknown');
                }
            }),
        );
    }

    findOneByKey(customerKey: string, key: string): Observable<WorkflowModel> {
        return from(
            this.workflowModel.findOne({ customerKey, key, deleted: false }).lean(),
        ).pipe(
            mergeMap((workflowModel: WorkflowModel) => {
                if (workflowModel) {
                    return of(workflowModel);
                } else {
                    throw new BadRequestException('workflow model unknown');
                }
            }),
        );
    }

    findOneBySnModel(customerKey: string, snModelUuid: string): Observable<WorkflowModel> {
        return from(
            this.workflowModel.findOne({ customerKey, snModelUuid, deleted: false }).lean(),
        ).pipe(
            map((workflowModel: WorkflowModel) => {
                if (workflowModel) {
                    return workflowModel;
                } else {
                    return null;
                }
            }),
        );
    }

    deleteBySnModel(customerKey: string, snModelUuid: string, real?: boolean) {
        const findWorkflowToDelete = this.findOneBySnModel(customerKey, snModelUuid);
        return findWorkflowToDelete.pipe(
            mergeMap((workFlow: WorkflowModel) => {
                if (workFlow) {
                    return super.delete(customerKey, workFlow.uuid, real);
                } else {
                    return of(false);
                }
            }),
        );
    }
}
