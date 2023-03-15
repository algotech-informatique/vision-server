import { WorkflowModel } from '../workflow-models/workflow-model.interface';
import { WorkflowOperation } from './workflow-operation.interface';
import { WorkflowSettings } from '../settings/workflow/workflow-settings.interface';
import { BaseDocument } from '../base/base.interface';

export interface WorkflowInstance extends BaseDocument {
    readonly workflowModel: WorkflowModel;
    readonly settings: WorkflowSettings;
    readonly startDate: Date;
    readonly finishDate: Date;
    readonly rangeDate: Date[];
    readonly state: string;
    readonly saved: boolean;
    readonly data: {
            key: string,
            value: any,
            type: string,
        }[];
    readonly participants: {
            user: string,
            profil: string,
            active: boolean,
        }[];
    readonly stackTasks: {
            uuid: string,
            taskModel: string,
            startDate: Date,
            finishDate: Date
            operations: WorkflowOperation[],
            reverse: WorkflowOperation[],
            active: boolean,
            saved: boolean,
        }[];
    readonly operations: WorkflowOperation[];
}
