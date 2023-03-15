import * as mongoose from 'mongoose';

export const PlanPoiContentSettingsSchema = new mongoose.Schema({
    path: String,
    value: mongoose.Schema.Types.Mixed,
}, {_id: false, minimize: false});
