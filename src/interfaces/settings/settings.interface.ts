import { PlanSettings } from './plan/plan-settings.interface';
import { BaseDocument } from '../base/base.interface';
import { WorkflowSettings } from './workflow/workflow-settings.interface';
import { AgendaSettings } from './agenda/agenda.interface';
import { AuditSettings } from './audit/audit-settings.interface';
import { DocumentsSettings } from './documents/documents-settings.interface';
import { Theme } from './theme/theme.interface';
import { PlayerManifest } from './player/player-manifest.interface';

export interface Settings extends BaseDocument {
    readonly plan: PlanSettings;
    readonly workflows: WorkflowSettings[];
    readonly agenda: AgendaSettings[];
    readonly audit: AuditSettings;
    readonly documents: DocumentsSettings;
    readonly theme: Theme;
    readonly player: PlayerManifest;
}
