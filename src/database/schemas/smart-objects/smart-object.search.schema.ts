import * as mongoose from 'mongoose';

export const SmartObjectSearch  = new mongoose.Schema({
    search: String,
    skip: Number,
    max: Number,
}, {_id: false, minimize: false});
