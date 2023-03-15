import { SnPageEventSchema } from './smart-nodes-page-event.schema';
import { SnPageWidgetSchema } from './smart-nodes-page-widget.schema';
import * as mongoose from 'mongoose';
import { SnPageVariableSchema } from './smart-nodes-page-variable.schema';
import { LangSchema } from '../lang/lang.schema';
import { SnCanvasSchema } from './smart-nodes-canvas.schema';
import { SnPageEventPipeSchema } from './smart-nodes-page-event-pipe.schema';

export const SnPageSchema = new mongoose.Schema({
    id: String,
    css: mongoose.Schema.Types.Mixed,
    icon: String,
    displayName: [LangSchema],
    canvas: SnCanvasSchema,
    securityGroups: [String],
    widgets: [SnPageWidgetSchema],
    header: SnPageWidgetSchema,
    footer: SnPageWidgetSchema,
    variables: [SnPageVariableSchema],
    dataSources: [SnPageEventPipeSchema],
    events: [SnPageEventSchema],
    main: Boolean,
    custom: mongoose.Schema.Types.Mixed,
    pageHeight: Number,
    pageWidth: Number,
}, {_id: false, minimize: false});
