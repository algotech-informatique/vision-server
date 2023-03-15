import * as mongoose from 'mongoose';

export const UserCareerSchema = new mongoose.Schema({
    current: Boolean,
    beginDate: String,
    endDate: String,
    departmentKey: String,
    position: String,
    description: String,
}, {_id: false, minimize: false});
