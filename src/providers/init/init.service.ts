import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Observable, from, of, zip } from 'rxjs';
import { tap, catchError, retryWhen, mergeMap, retry } from 'rxjs/operators';
import { AdminHead } from '../admin/admin.head';
import { SmartTasksHead } from '../smart-tasks/smart-tasks.head';
import { ProcessMonitoringHead } from '../process-monitoring/process-monitoring.head';
import { CustomerInit, WorkerMessage } from '../../interfaces';
import { SmartNodesHead } from '../smart-nodes/smart-nodes.head';

@Injectable()
export class InitService implements OnApplicationBootstrap {
    constructor(
        @InjectConnection() private readonly connection,
        private readonly adminHead: AdminHead,
        private readonly smartTasks: SmartTasksHead,
        private readonly monitoringHead: ProcessMonitoringHead,
        private readonly smartNodesHead: SmartNodesHead,
    ) {
        process.on('message', (msg: WorkerMessage) => {
            if (msg.cmd === 'reload-schedule-tasks') {
                this.smartTasks.unlockAndBindJobs().subscribe((started) => {
                    if (started) {
                        process.stdout.write('jobs unlocked and binded, Agenda started');
                    } else {
                        process.stdout.write('Agenda failed to start');
                    }
                });
            }
        });
    }

    onApplicationBootstrap() {
        InitService.applyMongoIndexes(this.connection);
        this.createPipelineAndTemplates();
        this.smartTasks.unlockAndBindJobs().subscribe((started) => {
            if (started) {
                process.stdout.write('jobs unlocked and binded, Agenda started');
            } else {
                process.stdout.write('Agenda failed to start');
            }
        });
        this.monitoringHead
            .cancelAllRunningProcess()
            .pipe(mergeMap(() => this.smartNodesHead.tryIndexsnModels(true))) //update snModels index au démarrage
            .subscribe();
    }

    createPipelineAndTemplates() {
        if (process.env.ES_URL) {
            const customer: CustomerInit = {
                customerKey: '', firstName: '', lastName: '', email: '', languages: [], login: '', password: '', defaultapplications: []
            };

            this.adminHead
                .resetESPipelineAndTempates(customer)
                .pipe(
                    // retryWhen deprcated relplacé par retry
                    retry({
                        count: 8,
                        delay: 15000,
                    }),
                    tap((res) => {
                        Logger.log('Reset ES Pipeine And templates');
                        res.forEach((res) => Logger.log(`${res.key}: ${res.value}`));
                    }),
                    catchError((e) => {
                        Logger.log('Error: Reset ES Pipeine And templates ' + e);
                        return of({});
                    }),
                )
                .subscribe();
        }
    }

    static applyMongoIndexes(connection) {
        const indexCreator = (connection, collection, conf: any): Observable<any> => {
            const index$ = from(connection.collection(collection).createIndex(conf));
            return index$.pipe(
                catchError(() => of('!!!!!!!!!! No index')),
                tap((res) => Logger.log(`${res} has been created`)),
            );
        }

        const indexes$ = [
            indexCreator(connection, 'customers', { customerKey: 1 }),
            indexCreator(connection, 'document', { uuid: 1 }),
            indexCreator(connection, 'document', { createdDate: 1 }),
            indexCreator(connection, 'document', { updateDate: 1 }),
            indexCreator(connection, 'document', { name: 'text' }),
            indexCreator(connection, 'document', { indexStatus: 1 }),
            indexCreator(connection, 'document', { lastIndexDate: 1 }),
            indexCreator(connection, 'documents.chunks', { files_id: 1 }),
            indexCreator(connection, 'documents.files', {
                'metadata.uuid': 1,
                'metadata.customerKey': 1,
            }),
            indexCreator(connection, 'domains', { key: 1 }),
            indexCreator(connection, 'domains', { customerKey: 1 }),
            indexCreator(connection, 'genericlists', { key: 1 }),
            indexCreator(connection, 'genericlists', { customerKey: 1 }),
            indexCreator(connection, 'groups', { key: 1 }),
            indexCreator(connection, 'groups', { customerKey: 1 }),
            indexCreator(connection, 'icons', { tags: 1 }),
            indexCreator(connection, 'notifications', { uuid: 1 }),
            indexCreator(connection, 'notifications', { customerKey: 1 }),
            indexCreator(connection, 'schedules', { customerKey: 1 }),
            indexCreator(connection, 'schedules', { beginPlannedDate: 1 }),
            indexCreator(connection, 'schedules', { endPlannedDate: 1 }),
            indexCreator(connection, 'schedules', { emitterUuid: 1 }),
            indexCreator(connection, 'settings', { customerKey: 1 }),
            indexCreator(connection, 'smartflowmodels', { uuid: 1 }),
            indexCreator(connection, 'smartflowmodels', { customerKey: 1 }),
            indexCreator(connection, 'smartflowmodels', { key: 1 }),
            indexCreator(connection, 'smartmodelconfigs', { uuid: 1 }),
            indexCreator(connection, 'smartmodelconfigs', { customerKey: 1 }),
            indexCreator(connection, 'smartmodelconfigs', { domainKey: 1 }),
            indexCreator(connection, 'smartmodelconfigs', { modelKey: 1 }),
            indexCreator(connection, 'smartmodels', { key: 1 }),
            indexCreator(connection, 'smartmodels', { customerKey: 1 }),
            indexCreator(connection, 'smartobjects', { uuid: 1 }),
            indexCreator(connection, 'smartobjects', { createdDate: 1 }),
            indexCreator(connection, 'smartobjects', { updateDate: 1 }),
            indexCreator(connection, 'smartobjects', { modelKey: 1 }),
            indexCreator(connection, 'smartobjects', { deleted: 1 }),
            indexCreator(connection, 'smartobjects', { 'skills.atDocument.documents': 1 }),
            indexCreator(connection, 'smartobjects', {
                'skills.atGeolocation.geo.geometries.0.coordinates': '2d',
                customerKey: 1,
                modelKey: 1,
            }),
            indexCreator(connection, 'smartobjects', { 'properties.$**': 1 }),
            indexCreator(connection, 'smartobjects', {
                'skills.atMagnet.zones.appKey': 'text',
                'skills.atMagnet.zones.magnetsZoneKey': 'text',
                'skills.atMagnet.zones.boardInstance': 'text',
            }),
            indexCreator(connection, 'tags', { customerKey: 1 }),
            indexCreator(connection, 'tags', { uuid: 1 }),
            indexCreator(connection, 'tags', { 'tags.key': 1 }),
            indexCreator(connection, 'tiles.chunks', { files_id: 1 }),
            indexCreator(connection, 'tiles.files', {
                'metadata.rasterUuid': 1,
                'metadata.x': 1,
                'metadata.y': 1,
                'metadata.z': 1,
            }),
            indexCreator(connection, 'users', { uuid: 1 }),
            indexCreator(connection, 'users', { email: 1 }),
            indexCreator(connection, 'users', { customerKey: 1 }),
            indexCreator(connection, 'workflowinstances', { uuid: 1 }),
            indexCreator(connection, 'workflowinstances', { customerKey: 1 }),
            indexCreator(connection, 'workflowinstances', { state: 1 }),
            indexCreator(connection, 'workflowinstances', { 'workflowModel.uuid': 1 }),
            indexCreator(connection, 'workflowmodels', { uuid: 1 }),
            indexCreator(connection, 'workflowmodels', { customerKey: 1 }),
            indexCreator(connection, 'workflowmodels', { key: 1 }),
            indexCreator(connection, 'indexationErrors', { createdDate: 1 }),
            indexCreator(connection, 'indexationErrors', { updateDate: 1 }),
            indexCreator(connection, 'monitoring', { createdDate: 1 }),
            indexCreator(connection, 'monitoring', { updateDate: 1 }),
            indexCreator(connection, 'monitoring', { uuid: 1 }),
            indexCreator(connection, 'monitoring', { processType: 1 }),
            indexCreator(connection, 'monitoring', { processState: 1 }),
            indexCreator(connection, 'snsynoticsearches', { updateDate: 1 }),
            indexCreator(connection, 'snsynoticsearches', { type: 1 }),
            indexCreator(connection, 'snsynoticsearches', { elementUuid: 1 }),
            indexCreator(connection, 'snsynoticsearches', { snViewUuid: 1 }),
            indexCreator(connection, 'snsynoticsearches', { snModelUuid: 1 }),
            indexCreator(connection, 'snsynoticsearches', { texts: 1 }),
        ];
        zip(...indexes$).subscribe();
    }
}
