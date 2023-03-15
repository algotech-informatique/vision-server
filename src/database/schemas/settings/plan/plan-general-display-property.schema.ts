import * as mongoose from 'mongoose';
import { PlanGeneralDisplaySmartModelSchema } from './plan-general-display-smart-model.schema';

export const PlanGeneralDisplayPropertySchema = new mongoose.Schema({
    name: String,
    smartModel: [PlanGeneralDisplaySmartModelSchema],
}, {_id: false, minimize: false});
