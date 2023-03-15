import * as mongoose from 'mongoose';

export const SnPageEventPipeSchema = new mongoose.Schema({
    id: String,
    key: String,
    type: String,
    action: String,
    inputs: [new mongoose.Schema(
        {
            key: String,
            value: mongoose.Schema.Types.Mixed,
        },
        { _id: false, minimize: false }),
    ],
    custom: mongoose.Schema.Types.Mixed,
}, { _id: false, minimize: false });
