import * as mongoose from 'mongoose';
import { LangSchema } from '../../lang/lang.schema';

export const PlanLayersIframeEventSettingsSchema = new mongoose.Schema({
    displayName: [LangSchema],
    triggers: [{
        path: String,
        value: String,
    }],
    behaviors: {
        details: {
            from: String,
            smartobject: {
                valueFromPath: String,
                smartPropertyKey: String,
            },
            smartflow: {
                uuid: String,
                key: String,
                variables: [{
                    key: String,
                    valueFromPath: String,
                }],
            },
        },
    },
}, { _id: false, minimize: false });
