import * as mongoose from 'mongoose';
import { SnCanvasSchema } from './smart-nodes-canvas.schema';

export const SnCommentSchema = new mongoose.Schema({

    id: String,
    parentId: String,
    open: Boolean,
    comment: mongoose.Schema.Types.Mixed,
    canvas: SnCanvasSchema,

}, {_id: false, minimize: false});
