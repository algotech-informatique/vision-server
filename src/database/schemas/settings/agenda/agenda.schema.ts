import * as mongoose from 'mongoose';
import { LangSchema } from '../../lang/lang.schema';
import { ScheduleReceiverSchema } from '../../scheduler/schedule-receiver.schema';
import { ScheduleWorkflowSchema } from '../../scheduler/schedule-workflow.schema';
import { ScheduleTypeDisplayShema } from './scheduler/schedule-type-display.schema';

export const AgendaSettingsSchema = new mongoose.Schema({
    key: String,
    owner: String,
    workflowUuid: String,
    displayName: [LangSchema],
    displays: [ScheduleTypeDisplayShema],
    defaultWorkflowModels: [ScheduleWorkflowSchema],
    defaultReceivers: [ScheduleReceiverSchema],
    defaultTags: [String],
    attribuable: Boolean,
    attributionMaxNumber: Number,
    statutGroupList: String,
}, { _id: false, minimize: false });
