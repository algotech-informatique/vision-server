import * as mongoose from 'mongoose';
import { WorkflowsSettingsSecurityGroupSchema } from './workflows-settings-security-group.schema';

export const WorkflowsSettingsSchema = new mongoose.Schema({
    actionBinding: String,
    owner: String,
    securityGroup: [WorkflowsSettingsSecurityGroupSchema],
    workflowUuid: String,
});
