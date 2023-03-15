import * as mongoose from 'mongoose';

export const UserCommunitySchema = new mongoose.Schema({
    communityKey: String,
    startDate: String,
}, {_id: false, minimize: false});
