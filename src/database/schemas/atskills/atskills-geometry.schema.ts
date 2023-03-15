import * as mongoose from 'mongoose';

export const GeometrySchema = new mongoose.Schema({
  type: String,
  coordinates: [mongoose.Schema.Types.Mixed],
}, {_id: false, minimize: false});
