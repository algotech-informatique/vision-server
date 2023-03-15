import * as mongoose from 'mongoose';

export const AuditLogSchema = new mongoose.Schema({
    eventId: String,
    eventActionCode: String,
    eventDate: Date,
    httpStatusCode: Number,
    userId: String,
    customerKey: String,
    networkAccessPoint: String,
    objectUuid: String,
    objectTypeCode: String,
    objectModelKey: String,
    objectUuids: [String],
    isRealDelete: Boolean,
    deletedObjects: Boolean,
    notIndexedObjects: Boolean,
}, { minimize: false });
