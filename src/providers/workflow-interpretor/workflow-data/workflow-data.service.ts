import { Injectable } from '@nestjs/common';
import {
    WorkflowInstanceDto, WorkflowModelDto, WorkflowInstanceContextDto, EnvironmentParameterDto,
} from '@algotech-ce/core';
import { Observable, of, concat, throwError } from 'rxjs';
import * as _ from 'lodash';
import { WorkflowSoService } from '../workflow-reader/workflow-so/workflow-so.service';
import { InterpretorData, InterpretorMetricsKeys, SaveOperationMode } from '@algotech-ce/interpretor';
import { map, first, catchError, reduce, tap, mergeMap } from 'rxjs/operators';
import { WorkflowDataApiService } from './workflow-data-api.service';
import { SmartFlowsService } from '../../smart-flows/smart-flows.service';
import { WorkflowInstancesService } from '../../workflow-instances/workflow-instances.service';
import { WorkflowModelsService } from '../../workflow-models/workflow-models.service';
import { WorkflowUtilsService } from '../workflow-utils/workflow-utils.service';
import { WorkflowMetricsService } from '../workflow-metrics/workflow-metrics.service';
import { SettingsDataService } from '../../@base/settings-data.service';

@Injectable()
export class WorkflowDataService extends InterpretorData {
    constructor(
        protected workflowDataApi: WorkflowDataApiService,
        protected workflowSoService: WorkflowSoService,
        protected workflowUtilsService: WorkflowUtilsService,
        private workflowModels: WorkflowModelsService,
        private smartflows: SmartFlowsService,
        private workflowInstance: WorkflowInstancesService,
        protected workflowMetricsService: WorkflowMetricsService,
        private settingsData: SettingsDataService) {
        super(workflowUtilsService, workflowDataApi, workflowSoService);
    }

    public getModel(model: string, context: WorkflowInstanceContextDto): Observable<WorkflowModelDto> {
        if (context.type === 'workflow') {
            return this.workflowModels.findOneByKey(context.customerKey, model) as Observable<WorkflowModelDto>;
        } else {
            return (this.smartflows.findOneByKey(context.customerKey, model) as Observable<WorkflowModelDto>).pipe(
                mergeMap((smartflow) => this.injectParameters(smartflow))
            );
        }
    }

    public getInstance(uuid: string, context: WorkflowInstanceContextDto): Observable<WorkflowInstanceDto> {
        return (this.workflowInstance.findOne(context.customerKey, uuid) as Observable<any>)
            .pipe(
                map((res: WorkflowInstanceDto) => {
                    const instance: WorkflowInstanceDto = res;
                    instance.context = context;
                    return instance;
                }),
            );
    }

    public save(instance: WorkflowInstanceDto): Observable<any> {
        this.workflowMetricsService.start(instance.context.metrics, InterpretorMetricsKeys.InterpretorSave);
        return this.saveApi(instance).pipe(
            tap(() => this.workflowMetricsService.stop(instance.context.metrics, InterpretorMetricsKeys.InterpretorSave))
        );
    }

    public saveInstance(instance: WorkflowInstanceDto): Observable<any> {
        return (instance.context.type === 'workflow') ?
            this.workflowDataApi.save(instance) : of(instance);
    }

    public saveFinalOperations(instance: WorkflowInstanceDto) {
        const operations = this.getOperations(instance);
        // zip op
        return concat(...
            (
                _.map(
                    operations, (operation) => {
                        return this.workflowApiService.saveOperation(instance, operation, SaveOperationMode.End).pipe(
                            first(), // force complete for concat
                        );
                    })
            ),
        ).pipe(
            catchError((err) => throwError(() => err)),
            reduce((acc, value) => acc, []),
        );
    }

    private injectParameters(smartflow: WorkflowModelDto): Observable<WorkflowModelDto> {
        return this.settingsData.getContext().pipe(
            map((data) => {
                const parameters: EnvironmentParameterDto[] = data.environment.smartflows.find((connector) =>
                    connector.uuid === smartflow.connectorUuid
                )?.custom;

                if (!parameters) {
                    return smartflow;
                }

                return Object.assign(smartflow, {
                    parameters: parameters.filter((param) => param.active) ?? []
                });
            })
        )
    }
}
