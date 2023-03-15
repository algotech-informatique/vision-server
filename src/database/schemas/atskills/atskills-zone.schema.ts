import * as mongoose from 'mongoose';
import { PositionSchema } from './atskills-position.schema';

export const ZoneSchema = new mongoose.Schema({
    appKey: String,
    magnetsZoneKey: String,
    boardInstance: String,
    position: PositionSchema,
    order: Number,
}, {_id: false, minimize: false});
