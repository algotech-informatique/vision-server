import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';

export const MetaDatasSchema = new mongoose.Schema({
    uuid: String,
    key: String,
    displayName: [LangSchema],
    value: String,
}, {_id: false, minimize: false});
