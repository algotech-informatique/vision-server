import * as mongoose from 'mongoose';

export const WorkflowSettingsSecurityGroupSchema = new mongoose.Schema({
    profil: String,
    group: String,
    login: String,
}, { _id: false, minimize: false});
