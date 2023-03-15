import * as mongoose from 'mongoose';

export const DocumentMetadatasSchema = new mongoose.Schema({
    key: String,
    value: String,
}, {_id: false, minimize: false});
