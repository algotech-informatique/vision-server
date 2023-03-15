import { SmartPropertyModelSchema } from './smart-property-model.schema';
import { SmartPermissionsSchema } from './smart-permissions.schema';
import { ATSkillsActiveSchema } from '../atskills/atskills-active.schema';
import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';

export const SmartModelSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    key: String,
    system: Boolean,
    uniqueKeys: [String],
    displayName: [LangSchema],
    domainKey: String,
    properties: [SmartPropertyModelSchema],
    skills : ATSkillsActiveSchema,
    permissions: SmartPermissionsSchema,
    description: String,
}, {minimize: false});
