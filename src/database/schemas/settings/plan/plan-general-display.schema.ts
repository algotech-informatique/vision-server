import * as mongoose from 'mongoose';
import { PlanGeneralDisplayPropertySchema } from './plan-general-display-property.schema';

export const PlanGeneralDisplaySchema = new mongoose.Schema({
    uuid: String,
    propertyList: [PlanGeneralDisplayPropertySchema],
}, {_id: false, minimize: false});
