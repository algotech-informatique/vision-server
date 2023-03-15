import * as mongoose from 'mongoose';

export const LangSchema = new mongoose.Schema({
    lang: String,
    value: String,
}, {_id: false, minimize: false});
