import * as mongoose from 'mongoose';
import { LangSchema } from '../../lang/lang.schema';
import { WorkflowEventParameterSchema } from './workflow-event-parameter.schema';

export const WorkflowEventSchema = new mongoose.Schema({
    key: String,
    app: String,
    system: Boolean,
    displayName: [LangSchema],
    parameters: [WorkflowEventParameterSchema],
}, { _id: false, minimize: false});
