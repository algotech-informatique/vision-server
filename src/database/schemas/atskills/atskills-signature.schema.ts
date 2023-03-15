import * as mongoose from 'mongoose';

export const ATSkillsSignatureSchema = new mongoose.Schema({
    signatureID: String,
    date: String,
    userID: String,
}, { _id: false, minimize: false });
