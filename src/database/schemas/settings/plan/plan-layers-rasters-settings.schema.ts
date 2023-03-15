import * as mongoose from 'mongoose';
import { LangSchema } from '../../lang/lang.schema';

export const PlanLayersRastersSettingsSchema = new mongoose.Schema({
    uuid: String,
    key: String,
    backgroundColor: String,
    displayName: [LangSchema],
    url: String,
}, {_id: false, minimize: false});
