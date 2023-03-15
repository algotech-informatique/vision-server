import * as mongoose from 'mongoose';

export const UserFavoritesSchema = new mongoose.Schema({
    documents: [String],
    smartObjects: [String],
}, {_id: false, minimize: false});
