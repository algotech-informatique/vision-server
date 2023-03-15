import * as mongoose from 'mongoose';
import { WorkflowEventParameterSchema } from '../settings/workflow/workflow-event-parameter.schema';
import { WorkflowSettingsSecurityGroupSchema } from '../settings/workflow/workflow-settings-security-group.schema';

export const ScheduleWorkflowSchema = new mongoose.Schema({

    workflowUuid: String,
    parameters: [WorkflowEventParameterSchema],
    profils: [WorkflowSettingsSecurityGroupSchema],

}, { _id: false, minimize: false });
