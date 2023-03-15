import * as mongoose from 'mongoose';

export const ThemeSchema = new mongoose.Schema({
    themeKey: String,
    customColors: [new mongoose.Schema(
        {
            key: String,
            value: String,
        },
        { _id: false, minimize: false })],
}, {_id: false, minimize: false});
