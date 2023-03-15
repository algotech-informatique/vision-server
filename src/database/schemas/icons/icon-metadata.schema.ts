import * as mongoose from 'mongoose';

export const IconMetadataSchema = new mongoose.Schema({
    tags: [String],
}, {_id: false});