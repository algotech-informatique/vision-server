import * as mongoose from 'mongoose';

export const IndexationErrorSchema = new mongoose.Schema({
  uuid: String,
  customerKey: String,
  createdDate: Date,
  updateDate: Date,  
  error: mongoose.Schema.Types.Mixed
}, {minimize: false});
