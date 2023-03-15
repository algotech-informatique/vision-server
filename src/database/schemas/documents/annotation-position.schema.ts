import * as mongoose from 'mongoose';

export const AnnotationZoneSchema = new mongoose.Schema({
    positionX: Number,
    positionY: Number,
    rayon: Number,
    color: String,
}, {_id: false, minimize: false});
