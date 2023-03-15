import { BaseDocument } from '../base/base.interface';
import { Lang } from '../lang/lang.interface';
import { TaskModel } from './task-model.interface';
import { WorkflowApiModel } from './workflow-api-model.interface';
import { WorkflowVariableModel } from './workflow-variable-model.interface';

export interface WorkflowModel extends BaseDocument {
    readonly key: string;
    readonly snModelUuid?: string;
    readonly viewId?: string;
    readonly connectorUuid?: string;
    readonly viewVersion?: number;
    readonly displayName: Lang[];
    readonly description: Lang[];
    readonly tags: string[];
    readonly iconName: string;
    readonly parameters?: {
        readonly key: string;
        readonly value: any;
    }[];
    readonly variables: WorkflowVariableModel[];
    readonly profiles: {
        readonly uuid: string;
        readonly name: string;
        readonly color?: string;
    }[];
    readonly steps: {
        readonly uuid: string;
        readonly key: string;
        readonly displayName: Lang[];
        readonly color?: string;
        readonly tasks: TaskModel[];
    }[];
    readonly api?: WorkflowApiModel;
}
