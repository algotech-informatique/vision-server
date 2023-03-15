import * as mongoose from 'mongoose';
import { PlanLayersIframeEventSettingsSchema } from './plan-layers-iframe-event-settings.schema';

export const PlanLayersIframeSettingsSchema = new mongoose.Schema({
    url: String,
    properties: [{ key: String, value: String }],
    event: PlanLayersIframeEventSettingsSchema,
}, {_id: false, minimize: false});
