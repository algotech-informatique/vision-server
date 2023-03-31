import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { WorkflowInterpretorService } from './workflow-interpretor.service';
import {
    WorkflowInstanceContextDto, WorkflowSettingsDto, WorkflowModelDto, SettingsDto,
    WorkflowSettingsSecurityGroupsDto, TaskModelDto, WorkflowLaunchOptionsDto,
} from '@algotech-ce/core';
import { zip } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { InterpretorTaskDto, WorkflowErrorUnauthorizedProfil } from '@algotech-ce/interpretor';
import { WorkflowDataService } from './workflow-data/workflow-data.service';
import { WorkflowUtilsService } from './workflow-utils/workflow-utils.service';
import { WorkflowMessageService } from './workflow-message/workflow-message.service';
import { IdentityRequest } from '../../interfaces';
import { SettingsHead } from '../settings/settings.head';

@Injectable()
export class WorkflowInterpretorHead {
    constructor(
        private readonly settignsHead: SettingsHead,
        private readonly workflowMessage: WorkflowMessageService,
        private readonly workflowData: WorkflowDataService,
        private readonly workflowUtilsService: WorkflowUtilsService,
        private readonly workflowInterpretor: WorkflowInterpretorService,
    ) {
    }

    startWorkflow(data: {
        identity: IdentityRequest,
        launchOptions: WorkflowLaunchOptionsDto,
    }): Observable<any> {

        return this.workflowMessage.initializeContext(data.identity, 'workflow').pipe(
                mergeMap((context: WorkflowInstanceContextDto) =>
                    this._findSettings(context, data.launchOptions.key).pipe(
                        map((settings: WorkflowSettingsDto) => {
                            return {
                                settings,
                                context,
                            };
                        }),
                    ),
                ),
                mergeMap((res) =>
                    this.workflowInterpretor.startWorkflow(data.launchOptions.key,
                        res.settings, res.context, data.launchOptions.inputs),
                ),
                mergeMap((res: InterpretorTaskDto) => {
                    return of({
                        uuid: res.instance.uuid,
                        state: res.instance.state,
                    });
                }),
                catchError((e) => this._catchError(e)),
                map((d) => {
                    if (data.launchOptions.fromScheduler){
                        return ( d && (d.state === 'finished' || d.state === 'canceled' )) ? true : false;
                    }
                    return d;
                }),
            );
    }

    runInstance(data: { identity: IdentityRequest, uuid: string }): Observable<any> {

        return this.workflowMessage.initializeContext(data.identity, 'workflow').pipe(
                mergeMap((context: WorkflowInstanceContextDto) => this.workflowInterpretor.runInstance(data.uuid, context)),
                mergeMap((res: InterpretorTaskDto) => {
                    return of({
                        uuid: res.instance.uuid,
                        state: res.instance.state,
                    });
                }),
                catchError((e) => this._catchError(e)),
            );
    }

    _catchError(err) {
        if (err instanceof WorkflowErrorUnauthorizedProfil) {
            return of({
                state: 'running',
                instance: err.instance.uuid,
            });
        }

        throw err;
    }

    _findSettings(context: WorkflowInstanceContextDto, workflowModelKey: string): Observable<WorkflowSettingsDto> {
        return zip(
            this.settignsHead.findOne(this.workflowMessage.payload(context)),
            this.workflowData.getModel(workflowModelKey, context),
        ).pipe(
            map((res: any[]) => {
                if (res[0].hasError) {
                    throw new Error('failed when get settings');
                }
                if (!res[1]) {
                    throw new Error('failed when get workflowModel');
                }
                const settings: SettingsDto = res[0];
                const workflow: WorkflowModelDto = res[1];

                const findSettings = _.find(settings.workflows, (wSetting: WorkflowSettingsDto) => {
                    const wfi: any = { workflowModel: workflow };
                    let firstTask: TaskModelDto = null;
                    try {
                        firstTask = this.workflowUtilsService.findFirstTaskModel(wfi).task as TaskModelDto;
                    } catch {
                    }

                    const profil: WorkflowSettingsSecurityGroupsDto = _.find(wSetting.securityGroup, (sGroup) => {
                        return firstTask && sGroup.profil === firstTask.general.profil;
                    });

                    if (!context.user) {
                        throw new Error(`context incorrect ${context}`);
                    }
                    return profil && (context.user.groups.indexOf(profil.group) > -1 || context.user.username === profil.login);
                });

                if (!findSettings) {
                    throw new Error(`no workflow settings display for ${context.user.username}`);
                }

                return findSettings;
            }),
        );
    }
}
