import * as mongoose from 'mongoose';
import { SnFlowSchema } from './smart-nodes-flow.schema';
import { SnParamSchema } from './smart-nodes-param.schema';
import { SnSectionSchema } from './smart-nodes-section.schema';
import { SnCanvasSchema } from './smart-nodes-canvas.schema';

export const SnNodeSchema = new mongoose.Schema({

    id: String,
    displayName: mongoose.Schema.Types.Mixed,
    open: Boolean,
    canvas: SnCanvasSchema,
    key: String,
    parentId: String,
    icon: String,
    type: String,
    flowsEditable: Boolean,
    flows: [SnFlowSchema],
    params: [SnParamSchema],
    sections: [SnSectionSchema],
    custom: mongoose.Schema.Types.Mixed,
    expanded: Boolean,

}, {_id: false, minimize: false});
