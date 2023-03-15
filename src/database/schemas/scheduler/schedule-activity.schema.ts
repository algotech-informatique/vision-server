import * as mongoose from 'mongoose';

export const ScheduleActivitySchema = new mongoose.Schema({

    beginRealDate: Date,
    endRealDate: Date,
    workflowModelKey: String,
    workflowInstanceUuid: String,

}, { _id: false, minimize: false });
