import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';
import { SnVersionSchema } from './smart-nodes-version.schema';

export const SnModelSchema = new mongoose.Schema({

    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    key: String,
    displayName: [LangSchema],
    dirUuid: String,
    type: String,
    publishedVersion: String,
    versions: [SnVersionSchema],

}, {minimize: false});
