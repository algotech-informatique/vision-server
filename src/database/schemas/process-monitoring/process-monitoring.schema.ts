
import * as mongoose from 'mongoose';

export const ProcessMonitoringSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    processType: String,
    processState: String,
    current: Number,
    total: Number,
    result: mongoose.Schema.Types.Mixed,
}, {minimize: false});

ProcessMonitoringSchema.pre('deleteOne', (next) => {
    next(new Error('deleteOne smartobject not allow'));
});
ProcessMonitoringSchema.pre('deleteMany', (next) => {
    next(new Error('deleteMany smartobject not allow'));
});
ProcessMonitoringSchema.pre('remove', (next) => {
    next(new Error('remove smartobject not allow'));
});