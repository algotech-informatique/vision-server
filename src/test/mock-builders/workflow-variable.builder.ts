import { WorkflowVariableModel } from '../../interfaces';
import { MockBuilder } from './mock-builder';

export class WorkflowVariableBuilder extends MockBuilder<WorkflowVariableModel> {
    constructor(
        private uuid: string = '123456',
        private key: string = 'test-variable',
        private type: string = 'string',
        private multiple: boolean = false,
        private use: 'header' | 'url-segment' | 'query-parameter' | 'body' = undefined
    ) { super(); }

    withKey(key: string): WorkflowVariableBuilder {
        this.key = key;
        return this;
    }

    withType(type: string): WorkflowVariableBuilder {
        this.type = type;
        return this;
    }

    withMultiple(multiple: boolean): WorkflowVariableBuilder {
        this.multiple = multiple;
        return this;
    }

    withUse(use: 'header' | 'url-segment' | 'query-parameter' | 'body' | undefined): WorkflowVariableBuilder {
        this.use = use;
        return this;
    }
}