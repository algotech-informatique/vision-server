import * as mongoose from 'mongoose';

export const ATSkillsDocumentSchema = new mongoose.Schema({
    documents: [String],
}, {_id: false, minimize: false});
