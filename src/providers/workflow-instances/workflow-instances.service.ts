import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { PairDto, WorkflowInstanceAbstractDto, WorkflowStackTaskDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import moment = require('moment');
import { BaseService } from '../@base/base.service';
import { WorkflowInstance } from '../../interfaces';

@Injectable()
export class WorkflowInstancesService extends BaseService<WorkflowInstance> {
    constructor(
        @InjectModel('WorkflowInstance') private readonly workflowInstance: Model<WorkflowInstance>,
    ) {
        super(workflowInstance);
    }

    delete(customerKey: string, id: string): Observable<boolean> {
        return super.delete(customerKey, id, true);
    }

    findOne(customerKey: string, id: string): Observable<WorkflowInstance> {
        const findWorkflowInstance: Observable<WorkflowInstance> = super.findOne(customerKey, id);
        return findWorkflowInstance.pipe(
            map(workflowInstance => {
                if (workflowInstance) {
                    return workflowInstance;
                } else {
                    throw new BadRequestException('workflow instance unknown');
                }
            }),
        );
    }

    findAllbyModel(customerKey: string, data: { uuid: string[], data: PairDto[] }): Observable<WorkflowInstanceAbstractDto[]> {
        const query = {
            customerKey,
            'deleted': false,
            'state': 'running',
            'workflowModel.uuid': { $in: data.uuid },
        };

        const res =
            from(
                this.workflowInstance.find(query)
                .select({uuid: 1, participants: 1, startDate: 1, updateDate: 1, workflowModel: 1, data: 1, stackTasks: 1})
                .lean<WorkflowInstance[]>(),
            ).pipe(
                map((instances: WorkflowInstance[]) => {

                    const filter = data.data ? instances.filter((instance) => {
                        return data.data.every((d) => {
                            const findData = instance.data.find((wfiData) => wfiData.key === d.key);
                            if (!findData) {
                                return true;
                            }
                            return _.isEqual(findData.value, d.value);
                        });
                    }) : instances;

                    return _.map(filter, (instance: WorkflowInstance) => {
                        const activeStack = _.find(instance.stackTasks, (stack: WorkflowStackTaskDto) => stack.active);
                        const wfiAbstract: WorkflowInstanceAbstractDto = {
                            uuid: instance.uuid,
                            activeTask: activeStack ? activeStack.taskModel : null,
                            participants: instance.participants,
                            startDate: moment(instance.startDate).format(),
                            updateDate: moment(instance.updateDate).format(),
                            workflowModelUuid: instance.workflowModel.uuid,
                        };
                        return wfiAbstract;
                    });
                }),
            );

        return res;
    }
}
