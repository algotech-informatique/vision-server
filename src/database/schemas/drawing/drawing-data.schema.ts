import * as mongoose from 'mongoose';

export const DrawingDataSchema = new mongoose.Schema({

    lines: [new mongoose.Schema(
        {
            id: String,
            points: [[Number]],
            color: String,
            penType: String,
            penScale: Number,
        },
        { _id: false, minimize: false }),
    ],
    elements: [mongoose.Schema.Types.Mixed],

}, {_id: false, minimize: false});
