import * as mongoose from 'mongoose';

export const SnVersionSchema = new mongoose.Schema({

    uuid: String,
    createdDate: String,
    updatedDate: String,
    creatorUuid: String,
    deleted: Boolean,
    view: mongoose.Schema.Types.Mixed,

}, {_id: false, minimize: false});
