// admin
export { AdminUser } from './admin/admin-user.interface';
export { UserSearch } from './admin/user-search';
export { CustomerLicence } from './admin/customer-licence.interface';

// Indexation
export { IndexationError } from './indexation/indexation-error.interface';
// application-models
export { ApplicationModel } from './application-models/application-models.interface';

// atskills
export { ATSkills } from './atskills/atskills.interface';
export { ATSkillsActive } from './atskills/atskills-active.interface';
export { ATSkillsDocument } from './atskills/atskills-document.interface';
export { ATSkillsGeolocation } from './atskills/atskills-geolocation.interface';
export { ATSkillsSignature } from './atskills/atskills-signature.interface';
export { ATSkillsTag } from './atskills/atskills-tag.interface';
export { Geo } from './atskills/atskills-geo.interface';
export { Geometry } from './atskills/atskills-geometry.interface';
export { ATSkillsMagnet } from './atskills/atskills-magnet.interface';
export { Zone } from './atskills/atskills-zone.interface';
export { Position } from './atskills/atskills-position.interface';

// audit-trail
export { AuditLog } from './audit-trail/audit-trail.interface';

// base
export { DateRange } from './base/base.dateRange';
export { BaseDocument } from './base/base.interface';
export { SettingsData } from './base/settings-data.interface';

// customers
export { CustomerInit } from './customers/customer-init';
export { CustomerInitResult } from './customers/customer-init-result';
export { CustomerOAuth2Parameter } from './customers/customer-oauth2-parameter.interface';
export { CustomerOAuth2 } from './customers/customer-oauth2.interface';
export { CustomerSearch } from './customers/customer-search';
export { Customer } from './customers/customer.interface';

// documents
export { AnnotationZone } from './documents/annotation-position.interface';
export { Annotation } from './documents/annotation.interface';
export { DocumentLockState } from './documents/document-lock.interface';
export { DocumentMetadatas } from './documents/document-metadatas.interface';
export { Document } from './documents/document.interface';
export { Version } from './documents/version.interface';

// drawing
export { DrawingData } from './drawing/drawing-data.interface';

// environment
export { Environment } from './environment/environment.interface';
export { EnvironmentDirectory } from './environment/environment-directory.interface';

// glists
export { GenericList } from './glists/glist.interface';
export { GenericListValue } from './glists/glist-value.interface';

// groups
export { Group } from './groups/group.interface';
export { GroupApplication } from './groups/group-application.interface';

// icons
export { FileIcon } from './icons/file-icon.interface';

// identity-request
export { IdentityRequest } from './identity-request/identity-request';

// lang
export { Lang } from './lang/lang.interface';

// linked-smart-objects
export { DisplayObject } from './linked-smart-objects/display-smart-object.interface';
export { LinkedSmartObject } from './linked-smart-objects/linked-smart-object.interface';

// metadata
export { MetaDatas } from './metadata/metadatas.interface';

// nats
export { NatsResponse } from './nats/nats-response.dto';

// notifications
export { Notification } from './notifications/notification.interface';

// scheduler
export { ParametersSearch } from './scheduler/search/parameters-search';
export { ProfilsSearch } from './scheduler/search/profils-search';
export { ScheduleActivitiesSearch } from './scheduler/search/schedule-activities-search';
export { ScheduleReceiversSearch } from './scheduler/search/schedule-receivers-search';
export { ScheduleSearch } from './scheduler/search/schedule-search';
export { ScheduleStatusSearch } from './scheduler/search/schedule-status-search';
export { ScheduleWorkflowsSearch } from './scheduler/search/schedule-workflows-search';
export { ScheduleActivity } from './scheduler/schedule-activity.interface';
export { ScheduleReceiver } from './scheduler/schedule-receiver.interface';
export { ScheduleWorkflow } from './scheduler/schedule-workflow.interface';
export { Schedule } from './scheduler/schedule.interface';

// search
export { DocRecommendation } from './search/doc-recommendation.interface';
export { DocumentSearchResult } from './search/document-search-result.interface';
export { QuerySearchResult } from './search/query-search-result.interface';
export { SearchResult } from './search/search-result.interface';
export { TagSearchResult } from './search/tag-search-result.interface';
export { EsdocQueryModel } from './search/doc-es-query-model.interface';
export { EsSmartObjectsQueryModel } from './search/so-es-query-model.interface';
export { EsSmartObjectsUniqueValuesAggsModel } from './search/so-es-unique-values-aggs-model.interface';
export { ESSearchSo } from './search/es-search-so.interface';
export { ESSearchSoOrder } from './search/es-search-so-order.interface';
export { ESSearchSoQuery } from './search/es-search-so-query.interface';
export { ESSearchSoQueryEquals } from './search/es-search-so-query-equals.interface';
export { ESSearchSoQueryRange } from './search/es-search-so-query-range.interface';
export { SearchSO } from './search/search-so.interface';
export { Search } from './search/search.interface';
export { SearchSOCombinedFilters } from './search/search-so-combined-filtes.interface';
export { FacetAggregationPipeline } from './search/facet-aggregation-pipeline.interface';

// settings
export { AgendaSettings } from './settings/agenda/agenda.interface';
export { ScheduleTypeDisplay } from './settings/agenda/scheduler/schedule-type-display.interface';
export { AuditSettings } from './settings/audit/audit-settings.interface';
export { DocumentsMetadatasSettings } from './settings/documents/documents-metadatas-settings.interface';
export { DocumentsSettings } from './settings/documents/documents-settings.interface';
export { PlanContainersSettings } from './settings/plan/plan-containers-settings.interface';
export { PlanGeneralDisplayPropertySettings } from './settings/plan/plan-general-display-property.interface';
export { PlanGeneralDisplaySmartModelSettings } from './settings/plan/plan-general-display-smart-model.interface';
export { PlanGeneralDisplaySettings } from './settings/plan/plan-general-display.interface';
export { PlanGeneralSettings } from './settings/plan/plan-general-settings.interface';
export { PlanLayersIframeEventSettings } from './settings/plan/plan-layers-iframe-event-settings.interface';
export { PlanLayersIframeSettings } from './settings/plan/plan-layers-iframe-settings.interface';
export { PlanLayersRastersSettings } from './settings/plan/plan-layers-rasters-settings.interface';
export { PlanLayersSettings } from './settings/plan/plan-layers-settings.interface';
export { PlanPoiContentSettings } from './settings/plan/plan-poi-content-settings.interface';
export { PlanPoiSettings } from './settings/plan/plan-poi-settings.interface';
export { PlanSettings } from './settings/plan/plan-settings.interface';
export { WorkflowEventParameter } from './settings/workflow/workflow-event-parameter.interface';
export { WorkflowEvent } from './settings/workflow/workflow-event.interface';
export { WorkflowSettingsSecurityGroup } from './settings/workflow/workflow-settings-security-group.interface';
export { WorkflowSettings } from './settings/workflow/workflow-settings.interface';
export { Theme } from './settings/theme/theme.interface';
export { Settings } from './settings/settings.interface';

// smart-models
export { SmartModel } from './smart-models/smart-model.interface';
export { SmartPermissions } from './smart-models/smart-permissions.interface';
export { SmartPropertyModel } from './smart-models/smart-property-model.interface';

// smart-nodes
export { SnAppTheme } from './smart-nodes/smart-nodes-app-theme.interface';
export { SnApp } from './smart-nodes/smart-nodes-app.interface';
export { SnBox } from './smart-nodes/smart-nodes-box.interface';
export { SnCanvas } from './smart-nodes/smart-nodes-canvas.interface';
export { SnComment } from './smart-nodes/smart-nodes-comment.interface';
export { SnConnector } from './smart-nodes/smart-nodes-connector.interface';
export { SnElement } from './smart-nodes/smart-nodes-element.interface';
export { SnFlow } from './smart-nodes/smart-nodes-flow.interface';
export { SnGroup } from './smart-nodes/smart-nodes-group.interface';
export { SnModel } from './smart-nodes/smart-nodes-model.interface';
export { SnNode } from './smart-nodes/smart-nodes-node.interface';
export { SnPageBox } from './smart-nodes/smart-nodes-page-box.interface';
export { SnPageEvent } from './smart-nodes/smart-nodes-page-event.interface';
export { SnPageEventPipe } from './smart-nodes/smart-nodes-page-event-pipe.interface';
export { SnPageVariable } from './smart-nodes/smart-nodes-page-variable.interface';
export { SnPageWidgetTypeReturn } from './smart-nodes/smart-nodes-page-widget-type-return.interface';
export { SnPageWidget } from './smart-nodes/smart-nodes-page-widget.interface';
export { SnPage } from './smart-nodes/smart-nodes-page.interface';
export { SnParam } from './smart-nodes/smart-nodes-param.interface';
export { SnSection } from './smart-nodes/smart-nodes-section.interface';
export { SnVersion } from './smart-nodes/smart-nodes-version.interface';
export { SnView } from './smart-nodes/smart-nodes-view.interface';

// smart-objects
export { SmartObject } from './smart-objects/smart-object.interface';
export { SmartObjectSearch } from './smart-objects/smart-object.search.interface';
export { SmartPropertyObject } from './smart-objects/smart-property-object.interface';
export { EsSmartObject } from './smart-objects/es-smart-objects.interface';
export { ESSOproperty } from './smart-objects/es-soproperty.interface';

// smart-tasks
export { SmartTaskLog } from './smart-tasks/smart-task-log.interface';
export { SmartTaskRepetition } from './smart-tasks/smart-task-repetition.interface';
export { SmartTask } from './smart-tasks/smart-task.interface';
export { SmartTaskPeriodicity } from './smart-tasks/smart-task.periodicity.interface';

// tags
export { TagList } from './tags/tag-list.interface';
export { Tag } from './tags/tag.interface';

// users
export { UserCareer } from './users/user-career.interface';
export { UserCommunity } from './users/user-community.interface';
export { Credentials } from './users/user-credentials.interface';
export { UserFavorites } from './users/user-favorites.interface';
export { UserPhone } from './users/user-phone.interface';
export { UserSkill } from './users/user-skill.interface';
export { User } from './users/user.interface';

// websockets
export { WsRoom } from './websockets/room.model';
export { WsClient } from './websockets/ws-client.model';

// worker
export { WorkerMessage } from './worker/worker-message.interface';

// workflow-instances
export { WorkflowInstance } from './workflow-instances/workflow-instance.interface';
export { WorkflowOperation } from './workflow-instances/workflow-operation.interface';

// workflow-models
export { TaskModel } from './workflow-models/task-model.interface';
export { WorkflowModel } from './workflow-models/workflow-model.interface';
export { WorkflowVariableModel } from './workflow-models/workflow-variable-model.interface';
export { WorkflowsSettingsSecurityGroup } from './workflow-models/workflows-settings-security-group.interface';
export { WorkflowsSettings } from './workflow-models/workflows-settings.interface';
export { WorkflowApiModel } from './workflow-models/workflow-api-model.interface';

// upload
export { UploadData } from './upload/upload-data.interface';
export { UploadFile } from './upload/upload-file.interface';

// metrics
export { CountMetric } from './metrics/count-metric.interface';

// manifest for pwa-player
export { PlayerManifest, PlayerManifestIcon, PlayerManifestRelatedApps } from './settings/player/player-manifest.interface';


export { ProcessMonitoring } from './process-monitoring/process-monitoring.interface';