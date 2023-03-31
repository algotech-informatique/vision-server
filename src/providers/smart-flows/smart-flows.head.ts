import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { defer, Observable, of, throwError, zip } from 'rxjs';
import { mergeMap, map, catchError, finalize, tap } from 'rxjs/operators';
import {
    PatchPropertyDto, SmartObjectDto,
    WorkflowInstanceContextDto, WorkflowSettingsDto,
    WorkflowStackTaskDto, WorkflowInstanceDto, WorkflowDataDto, WorkflowLaunchOptionsDto, WorkflowVariableModelDto, SysFile,
} from '@algotech-ce/core';
import { SmartFlowsService } from './smart-flows.service';
import { InterpretorMetricsKeys, InterpretorTaskDto, WorkflowErrorUnauthorizedProfil } from '@algotech-ce/interpretor';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { WorkflowAbstractService, WorkflowMessageService, WorkflowUtilsService, WorkflowInterpretorService, WorkflowMetricsService } from '../workflow-interpretor';
import { IdentityRequest, UploadFile, WorkflowModel, WorkflowVariableModel } from '../../interfaces';
import { AuthHead } from '../auth/auth.head';
import * as jwt from 'jsonwebtoken';
import { SmartFlowsInput } from './interfaces/Smart-flows-input.interface';
import { DocumentsHead } from '../documents/documents.head';
import { HttpResponse } from '../@base/http.response';

@Injectable()
export class SmartFlowsHead {

    constructor(
        private readonly smartFlowsService: SmartFlowsService,
        private readonly workflowUtils: WorkflowUtilsService,
        private readonly workflowMessage: WorkflowMessageService,
        private readonly workflowAbstract: WorkflowAbstractService,
        private readonly workflowUtilsService: WorkflowUtilsService,
        private readonly workflowInterpretor: WorkflowInterpretorService,
        private readonly workflowMetrics: WorkflowMetricsService,
        private readonly authHead: AuthHead,
        private readonly documentsHead: DocumentsHead,
    ) {
    }

    find(data: {
        identity: IdentityRequest;
        uuid?: string;
        key?: string;
        snModelUuid?: string;
    }): Observable<WorkflowModel | WorkflowModel[]> {
        if (data.uuid) {
            return this.smartFlowsService.findOne(data.identity.customerKey, data.uuid);
        } else if (data.key) {
            return this.smartFlowsService.findOneByKey(data.identity.customerKey, data.key);
        } else if (data.snModelUuid) {
            return this.smartFlowsService.findOneBySnModel(data.identity.customerKey, data.snModelUuid).pipe(
                mergeMap((smartflow) => {
                    if (!smartflow) {
                        throw new BadRequestException('No smartFlow linked to this Model');
                    }
                    return of(smartflow);
                }),
            );
        } else {
            return this.smartFlowsService.findAll(data.identity.customerKey);
        }
    }

    create(data: { identity: IdentityRequest; smartflow: WorkflowModel }): Observable<WorkflowModel> {
        return this.smartFlowsService.create(data.identity.customerKey, data.smartflow);
    }

    cache(data: { identity: IdentityRequest, date: string }) {
        return this.smartFlowsService.cache(data.identity.customerKey, data.date);
    }

    patch(data: { identity: IdentityRequest; data: { uuid: string, patches: PatchPropertyDto[] } }): Observable<PatchPropertyDto[]> {
        return this.smartFlowsService.patchByUuid(data.identity.customerKey, data.data.uuid, data.data.patches);
    }

    delete(data: { identity: IdentityRequest; uuid?: string, snModelUuid?: string }): Observable<boolean> {
        const obsDelete = (data.uuid) ? this.smartFlowsService.delete(data.identity.customerKey, data.uuid)
            : this.smartFlowsService.deleteBySnModel(data.identity.customerKey, data.snModelUuid);

        return obsDelete.pipe(
            mergeMap((result: boolean) => {
                if (result === true) {
                    return of(result);
                } else {
                    return throwError(() => new BadRequestException('Delete SmartFlows failed'));
                }
            },
            ));
    }

    publish(data: { identity: IdentityRequest, smartflow: WorkflowModel }): Observable<WorkflowModel> {
        return this.smartFlowsService.publish(data.identity.customerKey, data.smartflow);
    }

    _getSysFiles(identity: IdentityRequest,
        variables: WorkflowVariableModel[],
        canStart: boolean,
        files): Observable<{ canStart: boolean, files: SmartFlowsInput[] }> {
        if (!canStart) {
            return of({ canStart, files: [] });
        }

        const fileVars = _.reduce(variables, (results, v: WorkflowVariableModel) => {
            if (v.use === 'formData' && v.type === 'sys:file') {
                results.push(v);
            }
            return results;
        }, []);

        return (fileVars.length > 0) ? zip(..._.map(fileVars, (v: WorkflowVariableModel) => {
            const fs: UploadFile[] = _.filter(files, (f) => f.fieldname === v.key);
            return (fs.length > 0) ?
                zip(..._.map((v.multiple) ? fs : [fs[0]], (f) => {
                    const file: UploadFile = { buffer: f.buffer, originalname: f.originalname, size: f.size, mimetype: f.mimetype };
                    return this.documentsHead.uploadDocument({ identity, file, cache: true, sysfile: true }).pipe(
                        catchError(() => of(null)),
                        mergeMap((file: SysFile) => {
                            return (file) ? of({ key: v.key, value: file }) : of({
                                error: true,
                            })
                        }))
                })).pipe(
                    mergeMap((sysFiles: SmartFlowsInput[]) => {
                        const error = _.find(sysFiles, f => f.error);
                        return (sysFiles.length === 0 || error) ? of({
                            key: v.key,
                            error: true,
                            msg: 'ERROR-FORM-DATA',
                            reason: 'FILE(S)-IMPORT-ERROR'
                        }) :
                            of({
                                key: v.key,
                                value: (v.multiple) ? _.map(sysFiles, f => f.value) : sysFiles[0].value
                            })
                    })
                ) :
                of({
                    key: v.key,
                    error: true,
                    msg: 'ERROR-FORM-DATA',
                    reason: 'FILE(S)-NOT-FOUND'
                })
                ;
        })).pipe(
            mergeMap((inputs: SmartFlowsInput[]) => {
                return of({ canStart, files: inputs })
            })
        ) : of({ canStart, files: [] });
    };

    getSmartFlowLanchOptions(routeVerb: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH', key: string,
        body, headers, queryStrings, urlSegments: string[], files): Observable<{
            canStart: boolean,
            identity: IdentityRequest,
            launchOptions: WorkflowLaunchOptionsDto,
            inputErrors: SmartFlowsInput[]
        }> {
        return this.smartFlowsService.getSmartFlow(routeVerb, key).pipe(
            mergeMap((smartFlow: WorkflowModel) => {
                const identity: IdentityRequest = {
                    login: 'sadmin',
                    groups: ['sadmin'],
                    customerKey: process.env.CUSTOMER_KEY,
                };
                if (smartFlow.api.auth.jwt && headers?.authorization) {
                    const token = headers.authorization.split('Bearer ')[1];
                    return this.authHead.validateTokenUser(token).pipe(
                        catchError(() => {
                            return of(false);
                        }),
                        map((active: boolean) => {
                            if (!active) {
                                return false;
                            }

                            if (!smartFlow.api.auth.groups || smartFlow.api.auth.groups.length === 0) {
                                return true;
                            }

                            const decoded = jwt.decode(token);
                            return _.intersection(smartFlow.api.auth.groups, decoded.groups)?.length > 0;

                        }),
                        mergeMap((canStart: boolean) => this._getSysFiles(identity, smartFlow.variables, canStart, files)),
                        mergeMap((data) => {
                            return (data.canStart) ? of({
                                canStart: data.canStart,
                                identity,
                                ...this.smartFlowsService.getLauchOptions(smartFlow, body, headers, queryStrings, urlSegments, data.files)
                            }) : of({ canStart: false, identity, inputErrors: [], launchOptions: {} })
                        }));

                } else if (smartFlow.api.auth.webhook?.key !== undefined && smartFlow.api.auth.webhook?.value !== undefined &&
                    _.trim(smartFlow.api.auth.webhook?.key) !== '' && _.trim(smartFlow.api.auth.webhook?.value) !== '') {
                    const header = smartFlow.api.auth.webhook.key.toLowerCase();
                    const token = smartFlow.api.auth.webhook.value;
                    const canStart = headers[header] === token;

                    return this._getSysFiles(identity, smartFlow.variables, canStart, files).pipe(
                        mergeMap((data: { canStart: boolean, files: SmartFlowsInput[] }) => {
                            return (data.canStart) ? of({
                                canStart: data.canStart,
                                identity,
                                ...this.smartFlowsService.getLauchOptions(smartFlow, body, headers, queryStrings, urlSegments, data.files)
                            }) : of({ canStart: false, identity, inputErrors: [], launchOptions: {} });
                        }));
                } else {
                    return of({ canStart: false, identity, inputErrors: [], launchOptions: {} });
                }
            }));
    }

    startSmartFlow(data: {
        identity: IdentityRequest,
        launchOptions: WorkflowLaunchOptionsDto,
        httpResponse?: boolean
    }): Observable<any> {

        let metrics;
        if (data.launchOptions.metrics) {
            metrics = [];
        }
        this.workflowMetrics.start(metrics, InterpretorMetricsKeys.InterpretorPrepare);
        return (this.workflowMessage.initializeContext(data.identity, 'smartflow')).pipe(
            map((context: WorkflowInstanceContextDto) => {
                this.workflowMetrics.stop(metrics, InterpretorMetricsKeys.InterpretorPrepare);
                context.metrics = metrics;
                return context;
            }),
            mergeMap((cont: WorkflowInstanceContextDto) => {
                return this.smartFlowsService.findOneByKey(data.identity.customerKey, data.launchOptions.key).pipe(
                    map((object: WorkflowModel) => {
                        return {
                            context: cont,
                            settings: this.createSettings(object.uuid, data.launchOptions.readonly),
                        };
                    }),
                );
            }),
            mergeMap((contextSettings) => {
                return this.workflowInterpretor.startWorkflow(data.launchOptions.key,
                    contextSettings.settings, contextSettings.context, data.launchOptions.inputs);
            }),
            mergeMap((res: InterpretorTaskDto) => {
                return of(res.instance);
            }),
            catchError((e) => {
                return this._catchError(e)
            }),
            mergeMap((instance: WorkflowInstanceDto) => {
                if (data.launchOptions.fromScheduler) {
                    return (instance && (instance.state === 'finished' || instance.state === 'canceled')) ? of(true) : of(false);
                }
                this.workflowMetrics.start(metrics, InterpretorMetricsKeys.InterpretorFinalize);
                let result = null;
                result = this._getRequestResult(instance, data.launchOptions.toData, data.httpResponse);
                if (!result) {
                    result = this._getSmartObject(instance, data.launchOptions.toData);
                }
                this.workflowMetrics.stop(metrics, InterpretorMetricsKeys.InterpretorFinalize);

                if (data.launchOptions.metrics) {
                    return of({
                        process: this.workflowMetrics.getMetrics(instance.context.metrics, 'process'),
                        tasks: this.workflowMetrics.getMetrics(instance.context.metrics, 'tasks')
                    });
                }
                return result ? result : of({});
            }),
        );
    }

    private getLastTask(instance: WorkflowInstanceDto, task: string) {
        const tasks: WorkflowStackTaskDto[] = instance.stackTasks.filter((t) => this.workflowUtils.getTaskModel(instance, t).type === task);
        if (tasks.length === 0) {
            return null;
        }
        const stack: WorkflowStackTaskDto = tasks[tasks.length - 1];
        const taskModel = this.workflowUtilsService.getTaskModel(instance, stack);
        return taskModel;
    }

    private getStatus(instance: WorkflowInstanceDto, task: string) {
        const taskModel = this.getLastTask(instance, task);
        if (!taskModel) {
            return null;
        }
        if (taskModel.properties.transitions.length === 0 || taskModel.properties.transitions[0].data.length < 2) {
            return null;
        }

        const statusKey = taskModel.properties.transitions[0].data[1].key;
        return instance.data.find((d: WorkflowDataDto) => d.key === statusKey)?.value;
    }

    private getData(instance: WorkflowInstanceDto, task: string) {
        const taskModel = this.getLastTask(instance, task);
        if (!taskModel) {
            return null;
        }
        if (taskModel.properties.transitions.length === 0 || taskModel.properties.transitions[0].data.length === 0) {
            return null;
        }

        const dataKey = taskModel.properties.transitions[0].data[0].key;
        return instance.data.find((d: WorkflowDataDto) => d.key === dataKey);
    }

    private getSmartObjects(instance: WorkflowInstanceDto, findData: WorkflowDataDto, toData: boolean): Observable<any> {
        const multiple = _.isArray(findData.value);
        const datas = multiple ? findData.value : [findData.value];

        const smartObjects: SmartObjectDto[] = _.reduce(datas, (resultSOs, soUuid) => {
            const find = _.find(instance.smartobjects, (so: SmartObjectDto) => so.uuid === soUuid);
            if (find) {
                resultSOs.push(find);
            }
            return resultSOs;
        }, []);

        if (toData) {
            const uuids = _.map(smartObjects, 'uuid');
            return this.workflowAbstract.getSubDoc(instance.context, { smartObjects }, false, false).pipe(
                map((smartobjects: SmartObjectDto[]) => {
                    return {
                        data: multiple ? uuids : (uuids.length === 0 ? null : uuids[0]),
                        smartobjects: smartobjects,
                        type: findData.type,
                    };
                }),
            );
        }

        if (multiple) {
            return of(smartObjects);
        }
        return of(smartObjects.length === 0 ? null : smartObjects[0]);
    }


    _getRequestResult(instance: WorkflowInstanceDto, toData: boolean, httpResponse: boolean): Observable<any> {
        const findData: WorkflowDataDto = this.getData(instance, 'TaskRequestResult');
        const status: number = this.getStatus(instance, 'TaskRequestResult');

        if (!findData && !status) {
            return null;
        }

        return defer(() => {
            if (findData.type.startsWith('so:')) {
                return this.getSmartObjects(instance, findData, toData);
            }
            if (toData) {
                return of({ data: findData.value, type: findData.type });
            }
            return of(findData.value);
        }).pipe(
            map((data) => {
                if (status >= 400) {
                    throw new HttpException(data, status);
                }
                if (httpResponse) {
                    return new HttpResponse(data, status);
                }
                return data;
            }),
        )
    }

    _getSmartObject(instance: WorkflowInstanceDto, toData?: boolean): Observable<SmartObjectDto | SmartObjectDto[]> {
        const findData = this.getData(instance, 'TaskMapped');

        if (!findData) {
            return null;
        }
        return this.getSmartObjects(instance, findData, toData);
    }

    _catchError(err) {
        if (err instanceof WorkflowErrorUnauthorizedProfil) {
            return of(err.instance);
        }

        throw err;
    }

    private createSettings(sfUuid: string, readonly = false): WorkflowSettingsDto {
        return {
            uuid: UUID.UUID(),
            context: 'smartflow',
            platforms: ['mobile', 'desktop'],
            filters: [],
            savingMode: readonly ? 'DEBUG' : 'END',
            securityGroup: [],
            workflowUuid: sfUuid,
            unique: true,
        };
    }
}
