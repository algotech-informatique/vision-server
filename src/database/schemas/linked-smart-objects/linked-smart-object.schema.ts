
import * as mongoose from 'mongoose';
import { SmartModelSchema } from '../smart-models/smart-model.schema';
import { SmartPropertyModelSchema } from '../smart-models/smart-property-model.schema';
import { DisplayObjectSchema } from './display-smart-object.schema';

export const LinkedSmartObjectSchema = new mongoose.Schema({
    propertyKey: String,

    isGeolocalisable: Boolean,
    isMultiple: Boolean,
    isComposition: Boolean,
    property: SmartPropertyModelSchema,
    linkedModel: SmartModelSchema,
    values: [DisplayObjectSchema],

}, {minimize: false});
