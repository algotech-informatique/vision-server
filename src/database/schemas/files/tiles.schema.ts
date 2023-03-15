import * as mongoose from 'mongoose';
import { TilesMetadataSchema } from './tiles-metadata.schema';

export const TilesSchema = new mongoose.Schema({
    metadata: TilesMetadataSchema,
    filename: String,
    aliases: Boolean,
    chunkSize: Number,
    uploadDate: Date,
    length: Number,
    contentType: String,
    md5: String,
});