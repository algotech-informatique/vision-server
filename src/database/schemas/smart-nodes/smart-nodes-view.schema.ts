import * as mongoose from 'mongoose';
import { SnBoxSchema } from './smart-nodes-box.schema';
import { SnGroupSchema } from './smart-nodes-group.schema';
import { SnNodeSchema } from './smart-nodes-node.schema';
import { SnCommentSchema } from './smart-nodes-comment.schema';
import { DrawingDataSchema } from '../drawing/drawing-data.schema';

export const SnViewSchema = new mongoose.Schema({

    id: String,
    groups: [SnGroupSchema],
    box: [SnBoxSchema],
    nodes: [SnNodeSchema],
    comments: [SnCommentSchema],
    drawing: DrawingDataSchema,
    options: mongoose.Schema.Types.Mixed,

}, {_id: false, minimize: false});
