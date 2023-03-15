import * as mongoose from 'mongoose';
import { SmartPropertyObjectSchema } from '../smart-objects/smart-property-object.schema';
import { DocumentLockStateSchema } from './document-lock.schema';
import { DocumentMetadatasSchema } from './document-metadatas.schema';
import { VersionSchema } from './version.schema';

export const DocumentSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    name: String,
    ext: String,
    documentModelKey: String,
    indexStatus: String,
    lastIndexDate: Date,
    tags: [String],
    lockState: DocumentLockStateSchema,
    extendedProperties: [SmartPropertyObjectSchema],
    versions: [VersionSchema],
    metadatas: [DocumentMetadatasSchema],
}, {minimize: false});
