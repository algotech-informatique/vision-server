import * as mongoose from 'mongoose';
import { MetadataSchema } from './metadata.schema';

export const FileDocumentSchema = new mongoose.Schema({
    metadata: MetadataSchema,
    filename: String,
    aliases: Boolean,
    chunkSize: Number,
    uploadDate: Date,
    length: Number,
    contentType: String,
    md5: String,
});