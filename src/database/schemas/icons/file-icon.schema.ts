import * as mongoose from 'mongoose';

export const FileIconSchema = new mongoose.Schema({
    tags: [String],
    filename: String,
});
