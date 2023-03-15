import { SmartPermissionsSchema } from './smart-permissions.schema';
import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';

export const SmartPropertyModelSchema = new mongoose.Schema({
    uuid : String,
    key: String,
    displayName: [LangSchema],
    keyType: String,
    multiple: Boolean,
    items: mongoose.Schema.Types.Mixed,
    composition: Boolean,
    defaultValue: mongoose.Schema.Types.Mixed,
    required: Boolean,
    system: Boolean,
    hidden: Boolean,
    validations: [String],
    permissions: SmartPermissionsSchema,
    description: String,
}, {_id: false, minimize: false});
