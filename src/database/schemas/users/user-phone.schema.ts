import * as mongoose from 'mongoose';

export const UserPhoneSchema = new mongoose.Schema({
    phoneType: String,
    phoneNumber: String,
}, {_id: false, minimize: false});
