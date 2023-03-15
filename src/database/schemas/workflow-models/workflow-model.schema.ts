import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';
import { TaskModelSchema } from './task-model.schema';
import { WorkflowApiModelSchema } from './workflow-api-model.schema';
import { WorkflowVariableModelSchema } from './workflow-variable-model.schema';

export const WorkflowModelSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    key: String,
    snModelUuid: String,
    viewId: String,
    viewVersion: Number,
    connectorUuid: String,
    displayName: [LangSchema],
    description: [LangSchema],
    tags: [String],
    iconName: String,
    parameters: [new mongoose.Schema(
        {
            key: String,
            value: mongoose.Schema.Types.Mixed,
        },
        { _id: false, minimize: false })],
    variables: [WorkflowVariableModelSchema],
    profiles: [new mongoose.Schema(
        {
            uuid: String,
            name: String,
            color: String,
        },
        { _id: false, minimize: false })],
    steps: [new mongoose.Schema(
        {
            uuid: String,
            key: String,
            displayName: [LangSchema],
            color: String,
            tasks: [TaskModelSchema],
        },
        { _id: false, minimize: false })],
    api: WorkflowApiModelSchema,
}, {minimize: false});
