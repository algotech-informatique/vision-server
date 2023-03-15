/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const GroupApplicationSchema = new mongoose.Schema(
    {
        authorized: [String],
        default: new mongoose.Schema({
            mobile: String,
            web: String,
        }, { _id: false, minimize: false }),
    },
    { _id: false, minimize: false },
);
