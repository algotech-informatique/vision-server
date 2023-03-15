import * as mongoose from 'mongoose';

export const SmartPermissionsSchema = new mongoose.Schema({
  R: [String],
  RW: [String],
}, {_id: false, minimize: false});
