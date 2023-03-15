import * as mongoose from 'mongoose';
import { SnCanvasSchema } from './smart-nodes-canvas.schema';

export const SnBoxSchema = new mongoose.Schema({

    id: String,
    displayName: mongoose.Schema.Types.Mixed,
    open: Boolean,
    canvas: SnCanvasSchema,
    parentId: String,
    custom: mongoose.Schema.Types.Mixed,

}, {_id: false, minimize: false});
