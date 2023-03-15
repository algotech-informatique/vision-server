import * as mongoose from 'mongoose';
import { ZoneSchema } from './atskills-zone.schema';

export const ATSkillsMagnetSchema = new mongoose.Schema({
    zones: [ZoneSchema],
}, {_id: false, minimize: false});
