import * as mongoose from 'mongoose';

export const ScheduleTypeDisplayShema = new mongoose.Schema({
    smartModelsKey: String,
    hasTitle: Boolean,
    securityGroupsKey: [String],
    primary: String,
    secondary: String,
    tertiary: String,
    highlight: String,

}, { _id: false, minimize: false });
