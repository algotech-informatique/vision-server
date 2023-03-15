import { SnPageBoxSchema } from './../../smart-nodes/smart-nodes-page-box.schema';
import * as mongoose from 'mongoose';
import { LangSchema } from '../../lang/lang.schema';
import { PlanPoiContentSettingsSchema } from './plan-poi-content-settings.schema';

export const PlanPoiSettingsSchema = new mongoose.Schema({
    uuid: String,
    icon: String,
    color: String,
    displayName: [LangSchema],
    content: PlanPoiContentSettingsSchema,
    displayValue: String,
    toolTip: String,
    actionType: String,
    zoomMin: Number,
    zoomMax: Number,
    type: String,
    widgets: [new mongoose.Schema(
        {
            id: String,
            type: String,
            box: SnPageBoxSchema,
            custom: mongoose.Schema.Types.Mixed,
            css: mongoose.Schema.Types.Mixed,
        },
        { _id: false, minimize: false },
    )],
    canvas: new mongoose.Schema(
        {
            originWidth: Number,
            originHeight: Number,
            width: Number,
            height: Number,
        },
        { _id: false, minimize: false },
    ),
}, {_id: false, minimize: false});
