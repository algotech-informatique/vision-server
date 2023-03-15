import * as mongoose from 'mongoose';
import { GeometrySchema } from './atskills-geometry.schema';

export const GeoSchema = new mongoose.Schema({
    uuid: String,
    layerKey: String,
    geometries: [GeometrySchema],
}, {_id: false, minimize: false});
