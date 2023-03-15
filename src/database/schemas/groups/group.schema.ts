import * as mongoose from 'mongoose';
import { GroupApplicationSchema } from './group-application.schema';

export const GroupSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    key: String,
    name: String,
    description: String,
    application: GroupApplicationSchema,
}, { minimize: false });
