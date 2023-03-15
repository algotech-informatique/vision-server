import { LangSchema } from '../lang/lang.schema';
import * as mongoose from 'mongoose';

export const GenericListValueSchema = new mongoose.Schema({
    key: String,
    value: [LangSchema],
    index: Number,
}, {_id: false, minimize: false});
