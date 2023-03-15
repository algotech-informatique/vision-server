import * as mongoose from 'mongoose';

export const SnPageWidgetTypeReturnSchema = new mongoose.Schema({
    key: String,
    multiple: Boolean,
    type: String,
    name: String,
}, {_id: false, minimize: false});
