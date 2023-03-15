import { ATSkillsSchema } from '../atskills/atskills.schema';
import * as mongoose from 'mongoose';

export const SmartObjectSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    modelKey: String,
    properties: mongoose.Schema.Types.Mixed,
    skills: ATSkillsSchema,
}, {minimize: false});

SmartObjectSchema.pre('deleteOne', (next) => {
    next(new Error('deleteOne smartobject not allow'));
});
SmartObjectSchema.pre('deleteMany', (next) => {
    next(new Error('deleteMany smartobject not allow'));
});
SmartObjectSchema.pre('remove', (next) => {
    next(new Error('remove smartobject not allow'));
});