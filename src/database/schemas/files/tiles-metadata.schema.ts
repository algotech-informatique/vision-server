import * as mongoose from 'mongoose';

export const TilesMetadataSchema = new mongoose.Schema({
    rasterUuid : String,
    customerKey : String,
    z : Number,
    x : Number,
    y : Number,
}, {_id: false});