import * as mongoose from 'mongoose';

export const SnPageEventPipeSmartflowResultSchema = new mongoose.Schema({
        type: String,
        multiple: Boolean,
    },
    { _id: false, minimize: false },
);
