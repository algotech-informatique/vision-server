import * as mongoose from 'mongoose';

export const WorkflowsSettingsSecurityGroupSchema = new mongoose.Schema({
    role: new mongoose.Schema(
        {
            uuid: String,
            name: String,
            color: String,
        },
        { _id: false, minimize: false }),
    groupe: String,
    login: String,
});
