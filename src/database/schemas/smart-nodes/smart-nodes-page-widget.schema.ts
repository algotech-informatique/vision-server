import { SnPageBoxSchema } from './smart-nodes-page-box.schema';
import * as mongoose from 'mongoose';
import { SnPageEventSchema } from './smart-nodes-page-event.schema';
import { SnPageWidgetTypeReturnSchema } from './smart-nodes-page-widget-type-return.schema';

export const SnPageWidgetSchema = new mongoose.Schema({});
SnPageWidgetSchema.add({
    id: String,
    typeKey: String,
    displayName: mongoose.Schema.Types.Mixed,
    box: SnPageBoxSchema,
    group: new mongoose.Schema(
        {
            widgets: [SnPageWidgetSchema],
        },
        { _id: false, minimize: false }),
    rules: [new mongoose.Schema(
        {
            id: String,
            conditions: [new mongoose.Schema(
                {
                    input: String,
                    criteria: String,
                    value: mongoose.Schema.Types.Mixed,
                },
                { _id: false, minimize: false }
            )],
            operator: String,
            name: String,
            color: String,
            css: mongoose.Schema.Types.Mixed,
            custom: mongoose.Schema.Types.Mixed,
            events: [SnPageEventSchema],
        },
        { _id: false, minimize: false }
    )],
    returnData: [SnPageWidgetTypeReturnSchema],
    isActive: Boolean,
    css: mongoose.Schema.Types.Mixed,
    custom: mongoose.Schema.Types.Mixed,
    events: [SnPageEventSchema],
    sharedId: String,
    locked: Boolean,
    lockedProperties: [String],
    afterTemplatePlaced: mongoose.Schema.Types.Mixed,
});
SnPageWidgetSchema.set('_id', false);
SnPageWidgetSchema.set('minimize', false);
