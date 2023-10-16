import * as mongoose from 'mongoose';

export const SnSynoticSearchSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    key: String,
    snModelUuid: String,
    snViewUuid: String,
    snVersionUuid: String,
    elementUuid: String,
    displayName: mongoose.Schema.Types.Mixed,
    type: String,
    connectedTo: [String],
    texts: String,
}, { minimize: false });
