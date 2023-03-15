import * as mongoose from 'mongoose';
import { GeoSchema } from './atskills-geo.schema';

export const ATSkillsGeolocationSchema = new mongoose.Schema({
  geo: [GeoSchema],
}, {_id: false, minimize: false});
