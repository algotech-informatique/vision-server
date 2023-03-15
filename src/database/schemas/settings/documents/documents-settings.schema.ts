import * as mongoose from 'mongoose';
import { DocumentsMetadatasSettingsSchema } from './documents-metadatas-settings.schema';

export const DocumentsSettingsSchema = new mongoose.Schema({
    metadatas: [DocumentsMetadatasSettingsSchema],
}, { _id: false, minimize: false });
