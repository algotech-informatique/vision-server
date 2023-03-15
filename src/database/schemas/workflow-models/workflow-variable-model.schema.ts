import * as mongoose from 'mongoose';

export const WorkflowVariableModelSchema = new mongoose.Schema({
    uuid: String,
    key: String,
    type: String,
    multiple: Boolean,
    required: Boolean,
    deprecated: Boolean,
    allowEmpty: Boolean,
    use: String,
    description: String,
}, { _id: false, minimize: false });
