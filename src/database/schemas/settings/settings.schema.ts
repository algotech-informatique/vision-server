import * as mongoose from 'mongoose';
import { PlanSettingsSchema } from './plan/plan-settings.schema';
import { WorkflowSettingsSchema } from './workflow/workflow-settings.schema';
import { AgendaSettingsSchema } from './agenda/agenda.schema';
import { AuditSettingsSchema } from './audit/audit-settings.schema';
import { DocumentsSettingsSchema } from './documents/documents-settings.schema';
import { ThemeSchema } from './theme/theme.schema';
import { PlayerSchema } from './player/player.schema';

export const SettingsSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    plan: PlanSettingsSchema,
    workflows: [WorkflowSettingsSchema],
    agenda: [AgendaSettingsSchema],
    audit: AuditSettingsSchema,
    documents: DocumentsSettingsSchema,
    theme: ThemeSchema,
    player: PlayerSchema
}, { minimize: false });
