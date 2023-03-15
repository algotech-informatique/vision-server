import * as mongoose from 'mongoose';

export const SnAppThemeSchema = new mongoose.Schema({

    primary: String,
    secondary: String,
    tertiary: String,
    defaultColor: String,
    defaultBgColor: String,

}, {_id: false, minimize: false});
