import * as mongoose from 'mongoose';

export const CustomerOAuth2ParameterSchema = new mongoose.Schema({
    key: String,
    value: String,
}, {minimize: false});
