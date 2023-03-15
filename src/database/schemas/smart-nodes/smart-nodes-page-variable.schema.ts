import * as mongoose from 'mongoose';

export const SnPageVariableSchema = new mongoose.Schema({
    uuid: String,
    key: String,
    type: String,
    multiple: Boolean,
}, {_id: false, minimize: false});
