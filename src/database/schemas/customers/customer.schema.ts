import * as mongoose from 'mongoose';
import { LangSchema } from '../lang/lang.schema';
import { CustomerOAuth2Schema } from './customer-oauth2.schema';

export const CustomerSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    name: String,
    logoUrl: String,
    languages: [LangSchema],
    applicationsKeys: [String],
    licenceKey: String,
    oauth2: CustomerOAuth2Schema,    
    catchboxUrl: String,
    dataretreiverUrl: String,
}, { minimize: false });
