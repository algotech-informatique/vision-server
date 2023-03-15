import * as mongoose from 'mongoose';

export const DocumentLockStateSchema = new mongoose.Schema({
    userID: String,
    user: String,
    date: Date,
}, {_id: false, minimize: false});
