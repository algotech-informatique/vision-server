import * as mongoose from 'mongoose';

export const PlanGeneralDisplaySmartModelSchema = new mongoose.Schema({
    smUuid: String,
    smFormated: String,
    smModel: String,
    smField: String,
    color: String,
}, {_id: false, minimize: false});
