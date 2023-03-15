import * as mongoose from 'mongoose';

export const UserSkillSchema = new mongoose.Schema({
    skillKey: String,
    score: Number,
}, {_id: false, minimize: false});
