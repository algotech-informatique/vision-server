import * as mongoose from 'mongoose';

export const SnPageBoxSchema = new mongoose.Schema({
    x: Number,
    y: Number,
    height: Number,
    width: Number,
}, {_id: false, minimize: false});
