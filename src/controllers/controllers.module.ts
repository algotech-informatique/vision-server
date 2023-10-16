/* eslint-disable prettier/prettier */
import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProvidersModule } from '../providers/providers.module';
import * as controllers from './index';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [ProvidersModule, AuthModule, BullModule.registerQueue({ name: process.env.CUSTOMER_KEY + '-rasters' })],
    controllers: [
        controllers.SmartModelsController,
        controllers.SmartObjectsController,
        controllers.ConnectorsController,
        controllers.DatabaseController,
        controllers.SmartFlowsController,
        controllers.WorkflowInstancesController,
        controllers.WorkflowModelsController,
        controllers.GenericListsController,
        controllers.AdminController,
        controllers.AuditTrailController,
        controllers.SearchController,
        controllers.StoreController,
        controllers.TagsController,
        controllers.SmartNodesController,
        controllers.SettingsController,
        controllers.GroupsController,
        controllers.SchedulesController,
        controllers.SmartTasksController,
        controllers.ApplicationModelsController,
        controllers.EnvironmentController,
        controllers.NotificationsController,
        controllers.EmailController,
        controllers.CustomersController,
        controllers.UsersController,
        controllers.TemplatesController,
        controllers.DocumentsController,
        controllers.IconsController,
        controllers.FilesController,
        controllers.RasterController,
        controllers.ReportsController,
        controllers.ConvertController,
        controllers.MetricsController,
        controllers.ManifestController,
        controllers.MonitorController,
        controllers.ProcessMonitoringController,
        controllers.I18nController,
    ],
})
export class ControllersModule {
}
