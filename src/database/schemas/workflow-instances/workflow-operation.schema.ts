import * as mongoose from 'mongoose';

export const WorkflowOperationSchema = new mongoose.Schema({
    type: String,
    value: mongoose.Schema.Types.Mixed,
    saveOnApi: Boolean,
},
    { _id: false, minimize: false });
