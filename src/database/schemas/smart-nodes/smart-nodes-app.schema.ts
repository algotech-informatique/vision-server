import * as mongoose from 'mongoose';
import { ThemeSchema } from '../settings/theme/theme.schema';
import { DrawingDataSchema } from '../drawing/drawing-data.schema';
import { LangSchema } from '../lang/lang.schema';
import { SnPageSchema } from './smart-nodes-page.schema';
import { SnPageWidgetSchema } from './smart-nodes-page-widget.schema';

export const SnAppSchema = new mongoose.Schema({

    id: String,
    environment: String,
    pages: [SnPageSchema],
    icon: String,
    description: [LangSchema],
    pageHeight: Number,
    pageWidth: Number,
    securityGroups: [String],
    theme: ThemeSchema,
    drawing: DrawingDataSchema,
    custom: mongoose.Schema.Types.Mixed,
    shared: [SnPageWidgetSchema],
}, { _id: false, minimize: false });
