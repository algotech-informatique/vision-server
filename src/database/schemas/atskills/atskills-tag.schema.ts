import * as mongoose from 'mongoose';

export const ATSkillsTagSchema = new mongoose.Schema({
    tags: [String],
}, {_id: false, minimize: false});
