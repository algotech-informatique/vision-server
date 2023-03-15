import * as mongoose from 'mongoose';

export const ScheduleReceiverSchema = new mongoose.Schema({

    userUuid: String,
    groupUuid: String,
    permission: String,

}, { _id: false, minimize: false });
