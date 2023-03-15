import * as mongoose from 'mongoose';
import { SnCanvasSchema } from './smart-nodes-canvas.schema';

export const SnElementSchema = new mongoose.Schema({

    id: String,
    displayName: mongoose.Schema.Types.Mixed,
    open: Boolean,
    canvas: SnCanvasSchema,

}, {_id: false, minimize: false});
