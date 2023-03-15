import * as mongoose from 'mongoose';

export const AuditSettingsSchema = new mongoose.Schema({
    activated: Boolean,
    traceOriginal: Boolean,
}, { _id: false, minimize: false });
