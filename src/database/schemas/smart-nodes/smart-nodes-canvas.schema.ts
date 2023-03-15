import * as mongoose from 'mongoose';

export const SnCanvasSchema = new mongoose.Schema({

    x: Number,
    y: Number,

}, {_id: false, minimize: false});
