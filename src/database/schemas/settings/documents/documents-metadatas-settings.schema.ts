import * as mongoose from 'mongoose';
import { LangSchema } from '../../lang/lang.schema';

export const DocumentsMetadatasSettingsSchema = new mongoose.Schema({
    key: String,
    displayName: [LangSchema],
}, { _id: false, minimize: false });
