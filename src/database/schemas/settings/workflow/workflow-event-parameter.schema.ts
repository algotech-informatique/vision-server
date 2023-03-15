import * as mongoose from 'mongoose';
export const WorkflowEventParameterSchema = new mongoose.Schema({
    key: String,
    source: String,
}, { _id: false, minimize: false});
