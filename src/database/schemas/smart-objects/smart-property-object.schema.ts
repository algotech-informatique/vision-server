import * as mongoose from 'mongoose';

export const SmartPropertyObjectSchema = new mongoose.Schema({
    key: String,
    value: mongoose.Schema.Types.Mixed,
}, {_id: false, minimize: false});
