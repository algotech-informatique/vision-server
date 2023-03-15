import { Lang } from '../../lang/lang.interface';
import { WorkflowEventParameter } from './workflow-event-parameter.interface';

export interface WorkflowEvent {
    readonly key: string;
    readonly app: string;
    readonly system: boolean;
    readonly displayName: Lang[];
    readonly parameters: WorkflowEventParameter[];
}
