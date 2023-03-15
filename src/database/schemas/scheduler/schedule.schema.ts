import * as mongoose from 'mongoose';
import { ScheduleWorkflowSchema } from './schedule-workflow.schema';
import { ScheduleActivitySchema } from './schedule-activity.schema';
import { ScheduleReceiverSchema } from './schedule-receiver.schema';

export const ScheduleSchema = new mongoose.Schema({

    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    scheduleTypeKey: String,
    title: String,
    creationDate: Date,
    beginPlannedDate: Date,
    endPlannedDate: Date,
    emitterUuid: String,
    receivers: [ScheduleReceiverSchema],
    soUuid: [String],
    workflows: [ScheduleWorkflowSchema],
    repetitionMode: String,
    scheduleStatus: String,
    tags: [String],
    assignedUserUuid: [String],
    activities: [ScheduleActivitySchema],
    source: String,
}, { minimize: false });
