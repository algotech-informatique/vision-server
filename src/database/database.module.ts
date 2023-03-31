import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as schema from './schemas';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'agendaJobs', schema: {}, collection: 'agendaJobs' },
            { name: 'agendaJobsLogs', schema: schema.SmartTaskLogSchema, collection: 'agendaJobsLogs' },
            { name: 'ApplicationModel', schema: schema.ApplicationModelSchema },
            { name: 'AuditLog', schema: schema.AuditLogSchema },
            { name: 'Customer', schema: schema.CustomerSchema },
            { name: 'document', schema: schema.DocumentSchema, collection: 'document' },
            { name: 'documents', schema: schema.FileDocumentSchema, collection: 'documents.files' },
            { name: 'Environment', schema: schema.EnvironmentSchema, collection: 'environment' },
            { name: 'GenericList', schema: schema.GenericListSchema, collection: 'genericlists' },
            { name: 'Group', schema: schema.GroupSchema },
            { name: 'IndexationError', schema: schema.IndexationErrorSchema, collection: 'indexationErrors' },
            { name: 'Icons', schema: schema.FileIconSchema, collection: 'icons' },
            { name: 'Notification', schema: schema.NotificationSchema },
            { name: 'Schedule', schema: schema.ScheduleSchema },
            { name: 'Setting', schema: schema.SettingsSchema },
            { name: 'SmartflowModel', schema: schema.WorkflowModelSchema },
            { name: 'SmartModel', schema: schema.SmartModelSchema },
            { name: 'SmartObject', schema: schema.SmartObjectSchema },
            { name: 'SnModel', schema: schema.SnModelSchema },
            { name: 'Tags', schema: schema.TagListSchema, collection: 'tags' },
            { name: 'tiles', schema: schema.FileDocumentSchema, collection: 'tiles.files' },
            { name: 'User', schema: schema.UserSchema },
            { name: 'WorkflowInstance', schema: schema.WorkflowInstanceSchema },
            { name: 'WorkflowModel', schema: schema.WorkflowModelSchema },
            { name: 'ProcessMonitoring', schema: schema.ProcessMonitoringSchema, collection: 'monitoring' },
            
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [
        MongooseModule,
    ],
})
export class DatabaseModule { }
