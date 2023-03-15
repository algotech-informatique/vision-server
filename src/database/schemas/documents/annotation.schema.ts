import * as mongoose from 'mongoose';
import { AnnotationZoneSchema } from './annotation-position.schema';

export const AnnotationSchema = new mongoose.Schema({
    uuid: String,
    annotation: String,
    userID: String,
    author: String,
    dateCreation: Date,
    zone: AnnotationZoneSchema,
}, {_id: false, minimize: false});
