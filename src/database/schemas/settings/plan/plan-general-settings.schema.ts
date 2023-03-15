import * as mongoose from 'mongoose';
import {PlanGeneralDisplaySchema } from './plan-general-display.schema';

export const PlanGeneralSettingsSchema = new mongoose.Schema({
    displayPlanSO: PlanGeneralDisplaySchema,
}, {_id: false, minimize: false});
