import * as mongoose from 'mongoose';
import { IconMetadataSchema } from './icon-metadata.schema';

export const FileIconSchema = new mongoose.Schema({
    metadata: IconMetadataSchema,
    filename: String,
    aliases: Boolean,
    chunkSize: Number,
    uploadDate: Date,
    length: Number,
    contentType: String,
    md5: String,
});
