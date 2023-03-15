import * as mongoose from 'mongoose';
import { EnvironmentDirectorySchema } from './environment-directory.schema';

export const EnvironmentSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    workflows: [EnvironmentDirectorySchema],
    smartmodels: [EnvironmentDirectorySchema],
    smartflows: [EnvironmentDirectorySchema],
    reports: [EnvironmentDirectorySchema],
    apps: [EnvironmentDirectorySchema],
    smartTasks: [EnvironmentDirectorySchema],
}, { minimize: false });
