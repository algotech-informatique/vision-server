import * as mongoose from 'mongoose';
import { PlanGeneralSettingsSchema } from './plan-general-settings.schema';
import { PlanPoiSettingsSchema } from './plan-poi-settings.schema';
import { PlanContainersSettingsSchema } from './plan-containers-settings.schema';

export const PlanSettingsSchema = new mongoose.Schema({
    general: PlanGeneralSettingsSchema,
    poi: [PlanPoiSettingsSchema],
    containers: [PlanContainersSettingsSchema],
}, {_id: false, minimize: false});
