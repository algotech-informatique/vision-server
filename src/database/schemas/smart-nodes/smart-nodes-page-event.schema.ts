import * as mongoose from 'mongoose';
import { SnPageEventPipeSchema } from './smart-nodes-page-event-pipe.schema';

export const SnPageEventSchema = new mongoose.Schema({
    id: String,
    eventKey: String,
    pipe: [SnPageEventPipeSchema],
    custom: mongoose.Schema.Types.Mixed,
}, { _id: false, minimize: false });
