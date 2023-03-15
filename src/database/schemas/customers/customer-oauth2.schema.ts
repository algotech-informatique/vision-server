import * as mongoose from 'mongoose';
import { CustomerOAuth2ParameterSchema } from './customer-oauth2-parameter.schema';

export const CustomerOAuth2Schema = new mongoose.Schema({
    authorizeURL: String,
    accessTokenURL: String,
    userInfoURL: String,
    authorizeURLParameters: [CustomerOAuth2ParameterSchema],
    accessTokenURLParameters: [CustomerOAuth2ParameterSchema],
    userInfoURLParameters: [CustomerOAuth2ParameterSchema],
    defaultGroups: [String],
}, {minimize: false});
