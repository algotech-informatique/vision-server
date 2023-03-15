import * as mongoose from 'mongoose';
import { SnParamSchema } from './smart-nodes-param.schema';

export const SnFlowSchema = new mongoose.Schema({

    id: String,
    key: String,
    displayName: mongoose.Schema.Types.Mixed,
    direction: String,
    toward: String,
    paramsEditable: Boolean,
    params: [SnParamSchema],
    custom: mongoose.Schema.Types.Mixed

}, {_id: false, minimize: false});
