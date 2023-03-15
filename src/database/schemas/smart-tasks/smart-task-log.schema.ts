import * as mongoose from 'mongoose';

export const SmartTaskLogSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    smartTaskUuid: String,
    runAt: Date,
    finishAt: Date,
    status: String,
    failureMsg: String,
}, {minimize: false});
