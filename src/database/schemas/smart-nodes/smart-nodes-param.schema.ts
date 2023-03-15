import * as mongoose from 'mongoose';

export const SnParamSchema = new mongoose.Schema({

    id: String,
    key: String,
    displayName: mongoose.Schema.Types.Mixed,
    display: String,
    direction: String,
    toward: String,
    types: mongoose.Schema.Types.Mixed,
    multiple: Boolean,
    pluggable: Boolean,
    master: Boolean,
    required: Boolean,
    hidden: Boolean,
    default: mongoose.Schema.Types.Mixed,
    value: mongoose.Schema.Types.Mixed,
    custom: mongoose.Schema.Types.Mixed

}, {_id: false, minimize: false});
