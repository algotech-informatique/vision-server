import { WorkflowApiModel } from '../../interfaces';
import { MockBuilder } from './mock-builder';

export class WorkflowApiBuilder extends MockBuilder<WorkflowApiModel> {
    constructor(
        private route: string = 'test-smartflow',
        private type: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' = 'GET',
        private auth: { jwt: boolean } = { jwt: true },
        private description: string = 'Smartflow description for openAPI',
        private summary: string = 'Smartflow summary for openAPI',
        private result: {
            code: string,
            description: string,
            content: string,
            multiple: boolean,
            type: string
        }[] = []
    ) { super(); }

    withRoute(route: string): WorkflowApiBuilder {
        this.route = route;
        return this;
    }

    withType(type: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH'): WorkflowApiBuilder {
        this.type = type;
        return this;
    }
}