import { LangSchema } from '../lang/lang.schema';
import { GenericListValueSchema } from './glist-value.schema';
import * as mongoose from 'mongoose';

export const GenericListSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    key: String,
    displayName: [LangSchema],
    protected: Boolean,
    values: [GenericListValueSchema],
}, {minimize: false});
