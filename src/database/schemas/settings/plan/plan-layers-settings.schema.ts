import * as mongoose from 'mongoose';
import { LangSchema } from '../../lang/lang.schema';
import { MetaDatasSchema } from '../../metadata/metadatas.schema';
import { PlanLayersIframeSettingsSchema } from './plan-layers-iframe-settings.schema';
import { PlanLayersRastersSettingsSchema } from './plan-layers-rasters-settings.schema';

export const PlanLayersSettingsSchema = new mongoose.Schema({
    layerType: String,
    uuid: String,
    key: String,
    displayName: [LangSchema],
    rasters: [PlanLayersRastersSettingsSchema],
    defaultZoom: Number,
    zoomMin: Number,
    zoomMax: Number,
    defaultCenter: [Number],
    defaultRaster: String,
    clustersMode: Boolean,
    metadatas: [MetaDatasSchema],
    iframe: PlanLayersIframeSettingsSchema,
}, {_id: false, minimize: false});
