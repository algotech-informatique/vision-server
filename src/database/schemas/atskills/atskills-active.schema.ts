import * as mongoose from 'mongoose';

export const ATSkillsActiveSchema = new mongoose.Schema({
    atGeolocation: Boolean,
    atDocument: Boolean,
    atSignature: Boolean,
    atTag: Boolean,
    atMagnet: Boolean,
}, {_id: false, minimize: false});
