import * as mongoose from 'mongoose';
import { SnParamSchema } from './smart-nodes-param.schema';

export const SnSectionSchema = new mongoose.Schema({

    id: String,
    displayName: mongoose.Schema.Types.Mixed,
    key: String,
    editable: Boolean,
    open: Boolean,
    hidden: Boolean,
    params: [SnParamSchema],

}, {_id: false, minimize: false});
