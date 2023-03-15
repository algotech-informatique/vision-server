import * as mongoose from 'mongoose';
import { WorkflowSettingsSchema } from '../settings/workflow/workflow-settings.schema';
import { WorkflowModelSchema } from '../workflow-models/workflow-model.schema';
import { WorkflowOperationSchema } from './workflow-operation.schema';

export const WorkflowInstanceSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    workflowModel: mongoose.Schema.Types.Mixed,
    settings: WorkflowSettingsSchema,
    createdDate: Date,
    startDate: Date,
    updateDate: Date,
    finishDate: Date,
    rangeDate: [Date],
    state: String,
    saved: Boolean,
    data: mongoose.Schema.Types.Mixed,
    participants: mongoose.Schema.Types.Mixed,
    stackTasks: mongoose.Schema.Types.Mixed,
    operations: mongoose.Schema.Types.Mixed,
}, {minimize: false});
