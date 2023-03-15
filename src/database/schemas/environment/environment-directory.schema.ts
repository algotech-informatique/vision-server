import * as mongoose from 'mongoose';

export const EnvironmentDirectorySchema = new mongoose.Schema({});
EnvironmentDirectorySchema.add({
    uuid: String,
    name: String,
    custom: mongoose.Schema.Types.Mixed,
    subDirectories: [EnvironmentDirectorySchema],
});
EnvironmentDirectorySchema.set('_id', false);
EnvironmentDirectorySchema.set('minimize', false)