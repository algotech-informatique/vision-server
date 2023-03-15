import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';

export const TagSchema = new mongoose.Schema({
    uuid: String,
    key: String,
    displayName: [LangSchema],
    color: String,
}, {_id: false, minimize: false});
