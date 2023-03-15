import { Lang, TaskModel, WorkflowApiModel, WorkflowModel, WorkflowVariableModel } from '../../interfaces';
import { MockBuilder } from './mock-builder';
import { WorkflowApiBuilder } from './index';

export class WorkflowBuilder extends MockBuilder<WorkflowModel> {
    constructor(
        private key: string = 'test-workflow',
        private uuid: string = '123456789',
        private customerKey: string = 'test-client',
        private deleted: boolean = false,
        private displayName: Lang[] = [{ lang: 'fr-FR', value: 'Test Workflow'}],
        private description: Lang[] = [{ lang: 'fr-FR', value: 'A test smartflow'}],
        private tags: string[] = [],
        private iconName: string = 'fa-toto',
        private variables: WorkflowVariableModel[] = [],
        private profiles: {
            uuid: string,
            name: string,
        }[] = [],
        private steps: {
            uuid: string,
            key: string,
            displayName: Lang[],
            tasks: TaskModel[],
        }[] = [],
        private api: WorkflowApiModel = new WorkflowApiBuilder().build()
    ) { super(); }

    withKey(key: string): WorkflowBuilder {
        this.key = key;
        return this;
    }

    withVariables(variables: WorkflowVariableModel[]): WorkflowBuilder {
        this.variables = variables;
        return this;
    }

    withApi(api: WorkflowApiModel): WorkflowBuilder {
        this.api = api;
        return this;
    }
}