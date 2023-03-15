import * as mongoose from 'mongoose';
import { WorkflowSettingsSecurityGroupSchema } from './workflow-settings-security-group.schema';

export const WorkflowSettingsSchema = new mongoose.Schema({
    uuid: String,
    context: String,
    platforms: [String],
    filters: [new mongoose.Schema(
        {
            filterKey: String,
            filterValue: mongoose.Schema.Types.Mixed,
        },
        { _id: false, minimize: false })],
    securityGroup: [WorkflowSettingsSecurityGroupSchema],
    workflowUuid: String,
    savingMode: String,
    unique: Boolean,
}, { _id: false, minimize: false});
