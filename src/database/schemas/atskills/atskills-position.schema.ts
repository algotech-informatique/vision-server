import * as mongoose from 'mongoose';

export const PositionSchema = new mongoose.Schema({
    x: Number,
    y: Number,
}, {_id: false, minimize: false});
