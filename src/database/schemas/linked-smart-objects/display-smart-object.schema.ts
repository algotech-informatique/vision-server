import * as mongoose from 'mongoose';
import { SmartObjectSchema } from '../smart-objects/smart-object.schema';

export const DisplayObjectSchema = new mongoose.Schema({
    uuid: String,

    display: String,
    smartObject: SmartObjectSchema,

}, {minimize: false});
