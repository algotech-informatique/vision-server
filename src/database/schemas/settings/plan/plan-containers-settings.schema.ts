import * as mongoose from 'mongoose';
import { LangSchema } from '../../lang/lang.schema';
import { PlanLayersSettingsSchema } from './plan-layers-settings.schema';
import { MetaDatasSchema } from '../../metadata/metadatas.schema';

export const PlanContainersSettingsSchema = new mongoose.Schema({
    uuid: String,
    displayName: [LangSchema],
    description: [LangSchema],
    metadataSoUuid: String,
    imageIds: [String],
    parentUuid: String,
    defaultLayer: String,
    layers: [PlanLayersSettingsSchema],
    metadatas: [MetaDatasSchema],
}, {_id: false, minimize: false});
