import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    title: String,
    content: String,
    additionalInformation: String,
    icon: String,
    author: String,
    date: Date,
    comment: String,
    action: new mongoose.Schema({
        key: String,
        object: String,
    }, { _id: false, minimize: false }),
    state: new mongoose.Schema({
        from: String,
        to: [String],
        read: [String],
        execute: String,
    }, { _id: false, minimize: false }),
    channels: [String],
}, {minimize: false});
