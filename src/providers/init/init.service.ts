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
        this.applyMongoIndexes();
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
            .pipe(mergeMap(() => this.smartNodesHead.tryIndexsnModels())) //update snModels index au démarrage
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

    applyMongoIndexes() {
        const indexes$ = [
            this._indexCreator('customers', { customerKey: 1 }),
            this._indexCreator('document', { uuid: 1 }),
            this._indexCreator('document', { createdDate: 1 }),
            this._indexCreator('document', { updateDate: 1 }),
            this._indexCreator('document', { name: 'text' }),
            this._indexCreator('document', { indexStatus: 1 }),
            this._indexCreator('document', { lastIndexDate: 1 }),
            this._indexCreator('documents.chunks', { files_id: 1 }),
            this._indexCreator('documents.files', {
                'metadata.uuid': 1,
                'metadata.customerKey': 1,
            }),
            this._indexCreator('domains', { key: 1 }),
            this._indexCreator('domains', { customerKey: 1 }),
            this._indexCreator('genericlists', { key: 1 }),
            this._indexCreator('genericlists', { customerKey: 1 }),
            this._indexCreator('groups', { key: 1 }),
            this._indexCreator('groups', { customerKey: 1 }),
            this._indexCreator('icons', { tags: 1 }),
            this._indexCreator('notifications', { uuid: 1 }),
            this._indexCreator('notifications', { customerKey: 1 }),
            this._indexCreator('schedules', { customerKey: 1 }),
            this._indexCreator('schedules', { beginPlannedDate: 1 }),
            this._indexCreator('schedules', { endPlannedDate: 1 }),
            this._indexCreator('schedules', { emitterUuid: 1 }),
            this._indexCreator('settings', { customerKey: 1 }),
            this._indexCreator('smartflowmodels', { uuid: 1 }),
            this._indexCreator('smartflowmodels', { customerKey: 1 }),
            this._indexCreator('smartflowmodels', { key: 1 }),
            this._indexCreator('smartmodelconfigs', { uuid: 1 }),
            this._indexCreator('smartmodelconfigs', { customerKey: 1 }),
            this._indexCreator('smartmodelconfigs', { domainKey: 1 }),
            this._indexCreator('smartmodelconfigs', { modelKey: 1 }),
            this._indexCreator('smartmodels', { key: 1 }),
            this._indexCreator('smartmodels', { customerKey: 1 }),
            this._indexCreator('smartobjects', { uuid: 1 }),
            this._indexCreator('smartobjects', { createdDate: 1 }),
            this._indexCreator('smartobjects', { updateDate: 1 }),
            this._indexCreator('smartobjects', { modelKey: 1 }),
            this._indexCreator('smartobjects', { deleted: 1 }),
            this._indexCreator('smartobjects', { 'skills.atDocument.documents': 1 }),
            this._indexCreator('smartobjects', {
                'skills.atGeolocation.geo.geometries.0.coordinates': '2d',
                customerKey: 1,
                modelKey: 1,
            }),
            this._indexCreator('smartobjects', { 'properties.$**': 1 }),
            this._indexCreator('smartobjects', {
                'skills.atMagnet.zones.appKey': 'text',
                'skills.atMagnet.zones.magnetsZoneKey': 'text',
                'skills.atMagnet.zones.boardInstance': 'text',
            }),
            this._indexCreator('tags', { customerKey: 1 }),
            this._indexCreator('tags', { uuid: 1 }),
            this._indexCreator('tags', { 'tags.key': 1 }),
            this._indexCreator('tiles.chunks', { files_id: 1 }),
            this._indexCreator('tiles.files', {
                'metadata.rasterUuid': 1,
                'metadata.x': 1,
                'metadata.y': 1,
                'metadata.z': 1,
            }),
            this._indexCreator('users', { uuid: 1 }),
            this._indexCreator('users', { email: 1 }),
            this._indexCreator('users', { customerKey: 1 }),
            this._indexCreator('workflowinstances', { uuid: 1 }),
            this._indexCreator('workflowinstances', { customerKey: 1 }),
            this._indexCreator('workflowinstances', { state: 1 }),
            this._indexCreator('workflowinstances', { 'workflowModel.uuid': 1 }),
            this._indexCreator('workflowmodels', { uuid: 1 }),
            this._indexCreator('workflowmodels', { customerKey: 1 }),
            this._indexCreator('workflowmodels', { key: 1 }),
            this._indexCreator('indexationErrors', { createdDate: 1 }),
            this._indexCreator('indexationErrors', { updateDate: 1 }),
            this._indexCreator('monitoring', { createdDate: 1 }),
            this._indexCreator('monitoring', { updateDate: 1 }),
            this._indexCreator('monitoring', { uuid: 1 }),
            this._indexCreator('monitoring', { processType: 1 }),
            this._indexCreator('monitoring', { processState: 1 }),
            this._indexCreator('snsynoticsearches', { updateDate: 1 }),
            this._indexCreator('snsynoticsearches', { type: 1 }),
            this._indexCreator('snsynoticsearches', { elementUuid: 1 }),
            this._indexCreator('snsynoticsearches', { snViewUuid: 1 }),
            this._indexCreator('snsynoticsearches', { snModelUuid: 1 }),
            this._indexCreator('snsynoticsearches', { texts: 1 }),
        ];
        zip(...indexes$).subscribe();
    }

    _indexCreator(collection, conf: any): Observable<any> {
        const index$ = from(this.connection.collection(collection).createIndex(conf));
        return index$.pipe(
            catchError(() => of('!!!!!!!!!! No index')),
            tap((res) => Logger.log(`${res} has been created`)),
        );
    }
}
