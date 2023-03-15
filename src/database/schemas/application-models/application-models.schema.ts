import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';
import { SnAppSchema } from '../smart-nodes/smart-nodes-app.schema';

export const ApplicationModelSchema = new mongoose.Schema({

    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    key: String,
    snModelUuid: String,
    appId: String,
    appVersion: Number,
    displayName: [LangSchema],
    description: [LangSchema],
    environment: String,
    snApp: mongoose.Schema.Types.Mixed,

}, {minimize: false});
