import * as mongoose from 'mongoose';

export const MetadataSchema = new mongoose.Schema({
    uuid: String,
    smartObject: String,
    customerKey: String,
    createdBy: String,
    createdDate: String,
    indexationDate: String,
    status: String,
    zoomMin: Number,
    zoomMax: Number,
}, {_id: false});