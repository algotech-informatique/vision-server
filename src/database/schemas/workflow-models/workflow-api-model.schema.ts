import * as mongoose from 'mongoose';

export const WorkflowApiModelSchema = new mongoose.Schema({
    route: String,
    type: String,
    auth: new mongoose.Schema(
        {
            jwt: Boolean,
            webhook: mongoose.Schema.Types.Mixed,
            groups: [String],
        }, { _id: false, minimize: false }),
    description: String,
    summary: String,
    result: [new mongoose.Schema(
        {
            code: String,
            description: String,
            content: String,
            multiple: Boolean,
            type: String,
        }, { _id: false, minimize: false })],
}, { _id: false, minimize: false });
