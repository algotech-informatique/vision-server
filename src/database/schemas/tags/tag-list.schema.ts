import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';
import { TagSchema } from './tag.schema';

export const TagListSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    key: String,
    displayName: [LangSchema],
    modelKeyApplication: [String],
    applyToDocuments: Boolean,
    applyToImages: Boolean,
    tags: [TagSchema],
}, {minimize: false});
