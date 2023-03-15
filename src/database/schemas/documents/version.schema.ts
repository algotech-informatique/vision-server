import * as mongoose from 'mongoose';
import { SmartPropertyObjectSchema } from '../smart-objects/smart-property-object.schema';
import { AnnotationSchema } from './annotation.schema';

export const VersionSchema = new mongoose.Schema({
    uuid: String,
    fileID: String,
    linkedFilesID: [String],
    size: Number,
    dateUpdated: String,
    reason: String,
    userID: String,
    extendedProperties: [SmartPropertyObjectSchema],
    annotations: [AnnotationSchema],
}, {_id: false, minimize: false});
