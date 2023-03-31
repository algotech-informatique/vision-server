import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { PatchPropertyDto, SmartPropertyModelDto, WorkflowLaunchOptionsDto } from '@algotech-ce/core';
import { WorkflowModel, WorkflowVariableModel } from '../../interfaces';
import { BaseService } from '../@base/base.service';
import { SoUtilsService } from '../../providers/workflow-interpretor/@utils/so-utils.service';
import { SmartFlowsInput } from './interfaces/Smart-flows-input.interface';

@Injectable()
export class SmartFlowsService extends BaseService<WorkflowModel> {

    constructor(
        @InjectModel('SmartflowModel') private readonly smartflowModel: Model<WorkflowModel>,
        private soUtilsService: SoUtilsService,
    ) {
        super(smartflowModel);
    }

    create(customerKey: string, smartflow: WorkflowModel): Observable<WorkflowModel> {
        return this.findByKey(customerKey, smartflow.key).pipe(
            mergeMap((findFlows: WorkflowModel) => {
                if (findFlows !== null) {
                    throw new BadRequestException('SmartFlows Key already exists');
                } else {
                    return super.create(customerKey, smartflow, true);
                }
            }),
        );
    }

    public publish(customerKey: string, smartflow: WorkflowModel): Observable<WorkflowModel> {
        const obsFindOne = from(this.smartflowModel.findOne(
            { customerKey, snModelUuid: smartflow.snModelUuid, deleted: false }),
        );
        return obsFindOne.pipe(
            mergeMap((findSmartFlow: WorkflowModel) => {
                if (findSmartFlow) {
                    return super.update(customerKey, _.assign(smartflow, { uuid: findSmartFlow.uuid }));
                } else {
                    return super.create(customerKey, smartflow, true);
                }
            }),
        );
    }

    findOne(customerKey: string, uuid: string): Observable<WorkflowModel> {
        const findFlows = super.findOne(customerKey, uuid);
        return findFlows.pipe(
            map((smartflow: WorkflowModel) => {
                if (smartflow) {
                    return smartflow;
                } else {
                    throw new BadRequestException('SmartFlows unknown');
                }
            }),
        );
    }

    _getformattedValue(prop: SmartPropertyModelDto, value) {
        let formattedVal;
        try {
            formattedVal = this.soUtilsService.formatProperty(prop.keyType, value);
        } catch (error) {
            formattedVal = null;
        }
        return (prop.keyType === 'number' && isNaN(formattedVal)) ? null : formattedVal;
    }

    _tryGetSimpleValue(prop: SmartPropertyModelDto, value, reason?): SmartFlowsInput {
        if (prop.keyType.startsWith('so:')) {
            return this._isUUID(value) ? { value: value } : { error: true, reason };
        }
        else if (prop.keyType === 'string') {
            return _.isString(value) ? { value: value } : { error: true, reason };
        }
        else if (prop.keyType === 'boolean') {
            return (_.isString(value) && ['true', 'false'].indexOf(value?.toLowerCase()) !== -1) ? { value: (value.toLowerCase() === 'true') } :
                _.isBoolean(value) ? { value: value } : { error: true, reason };
        }
        else {
            const formatted = this._getformattedValue(prop, value);
            return formatted ? { value: formatted } : { error: true, reason };
        }
    };


    _tryGetMultipleValue(prop: SmartPropertyModelDto, value): SmartFlowsInput {
        const reason = `INVALID-${prop.keyType.toUpperCase()}-ARRAY`;
        const newValues = _.map(((!_.isString(value)) && Array.isArray(value)) ? value : [value], (v) => this._tryGetSimpleValue(prop, v));
        return _.every(newValues, (newValue) => (!newValue.error)) ? { value: _.map(newValues, 'value') } : { error: true, reason };
    }

    _tryGetValue(v: WorkflowVariableModel, keyExists, value): SmartFlowsInput {

        if (!keyExists && v.required) {
            return {
                error: true,
                reason: `REQUIRED-PARAMETER`
            }
        }

        if ((value == null) && keyExists && !v.allowEmpty) {
            return {
                error: true,
                reason: `EMPTY-VALUE`
            }
        }

        if (!keyExists && value == null) {
            return {
                ignore: true
            }
        }

        const prop: SmartPropertyModelDto = {
            uuid: '',
            key: '',
            displayName: [],
            keyType: v.type,
            multiple: v.multiple,
            required: v.required,
            system: false,
            hidden: false,
            permissions: {
                R: [],
                RW: []
            }
        }
        const reason = `INVALID-${prop.keyType.toUpperCase()}`;
        if (prop.multiple) {
            return this._tryGetMultipleValue(prop, value);
        }

        return this._tryGetSimpleValue(prop, value, reason);
    }

    _getUrlSegments(variables, urlSegments, inputErrors: SmartFlowsInput[]): SmartFlowsInput[] {
        const urlSegmentsVars = _.reduce(variables, (results, v: WorkflowVariableModel) => {
            if (v.use === 'url-segment') {
                results.push(v);
            }
            return results;
        }, []);

        return _.reduce(urlSegmentsVars, (results, v: WorkflowVariableModel, index) => {
            const keyExists = index < urlSegments.length;
            const val = urlSegments[index]
            const input = {
                key: v.key,
                ...this._tryGetValue(v, keyExists, val)
            };

            if (input.error) {
                delete input.error;
                inputErrors.push({
                    key: v.key,
                    msg: 'ERROR-URL-SEGMENT',
                    ...input
                });
            } else if (!input.ignore) {
                results.push(input);
            }

            return results;
        }, [])
    }

    getLauchOptions(
        smartFlow: WorkflowModel,
        body,
        headers,
        queryStrings,
        urlSegments: string[],
        files: SmartFlowsInput[]): { inputErrors: SmartFlowsInput[], launchOptions: WorkflowLaunchOptionsDto } {
        const inputErrors: SmartFlowsInput[] = _.reduce(files, (results, file: SmartFlowsInput) => {
            if (file.error) {
                results.push({ key: file.key, msg: file.msg, reason: file.reason });
            }
            return results;
        }, []);

        const launchOptions = {
            key: smartFlow.key,
            inputs: [
                ..._.reduce(files, (results, file: SmartFlowsInput) => {
                    if (!file.error) {
                        results.push(file);
                    }
                    return results;
                }, []),
                ...this._getUrlSegments(smartFlow.variables, urlSegments, inputErrors),
                ..._.reduce(smartFlow.variables, (results, v: WorkflowVariableModel) => {
                    let input: SmartFlowsInput;
                    if (v.use !== 'url-segment' && (v.use !== 'formData' || v.type !== 'sys:file')) {
                        if (body && v.use === 'body') {
                            input = {
                                key: v.key,
                                value: (v.multiple && !Array.isArray(body)) ? [body] : body,
                                error: (!body && v.required) || (!body && !v.allowEmpty),
                                reason: (!body && v.required) ? 'BODY-REQUIRED' : (!body && !v.allowEmpty) ? 'BODY-EMPTY' : null
                            };
                        } else {
                            const keyExists = (body && (!v.use || v.use === 'formData') && Object.keys(body).indexOf(v.key) !== -1) ||
                                (headers && v.use === 'header' && Object.keys(headers).indexOf(v.key.toLowerCase()) !== -1) ||
                                (queryStrings && v.use === 'query-parameter' && Object.keys(queryStrings).indexOf(v.key) !== -1);

                            const val = (body && (!v.use || v.use === 'formData')) ? body[v.key] : (headers && v.use === 'header') ? headers[v.key.toLowerCase()] :
                                (queryStrings && v.use === 'query-parameter') ? queryStrings[v.key] : null;
                            input = {
                                key: v.key,
                                ...this._tryGetValue(v, keyExists, val)
                            };

                        }


                        if (input.error) {
                            delete input.error;
                            inputErrors.push({
                                key: v.key,
                                msg: (!v.use || v.use === 'body') ? 'ERROR-BODY' :
                                    (v.use === 'formData') ? 'ERROR-FORM-DATA' :
                                        (v.use === 'header') ? 'ERROR-HEADER' :
                                            'ERROR-QUERY-PARAMETER',
                                ...input
                            });
                        } else if (!input.ignore) {
                            results.push(input);
                        }
                    }

                    return results;
                }, [])]
        };
        return { inputErrors, launchOptions };
    }

    getSmartFlow(routeVerb: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH', name: string): Observable<WorkflowModel> {
        return from(this.smartflowModel.findOne({ 'api.route': name, 'api.type': routeVerb, deleted: false })).pipe(
            map((smartflow: WorkflowModel) => {
                if (smartflow) {
                    return smartflow;
                } else {
                    throw new BadRequestException('SmartFlows unknown');
                }
            }));

    }

    findOneByKey(customerKey: string, key: string): Observable<WorkflowModel> {
        return from(
            this.smartflowModel.findOne({ customerKey, key, deleted: false }).lean(),
        ).pipe(
            map((smartflow: WorkflowModel) => {
                if (smartflow) {
                    return smartflow;
                } else {
                    throw new BadRequestException('SmartFlows unknown');
                }
            }),
        );
    }

    private findByKey(customerKey: string, key: string): Observable<WorkflowModel> {
        const ObsModel: Observable<Array<WorkflowModel>> = super.list(customerKey, { key, deleted: false });
        return ObsModel.pipe(
            map((smartflows: Array<WorkflowModel>) => {
                if (smartflows.length === 0) {
                    return null;
                } else {
                    return smartflows[0];
                }
            }),
        );
    }

    delete(customerKey: string, id: string, real?: boolean) {
        const findFlowsToDelete = super.findOne(customerKey, id);
        return findFlowsToDelete.pipe(
            mergeMap((smartflow: WorkflowModel) => {
                if (!smartflow) {
                    throw new BadRequestException('No SmartFlows to delete');
                } else {
                    return super.delete(customerKey, id, real);
                }
            }),
        );
    }

    findOneBySnModel(customerKey: string, snModelUuid: string): Observable<WorkflowModel> {
        return from(
            this.smartflowModel.findOne({ customerKey, snModelUuid, deleted: false }),
        ).pipe(
            map((smartflow: WorkflowModel) => {
                if (smartflow) {
                    return smartflow;
                } else {
                    return null;
                }
            }),
        );
    }

    deleteBySnModel(customerKey: string, snModelUuid: string, real?: boolean) {
        const findFlowsToDelete = this.findOneBySnModel(customerKey, snModelUuid);
        return findFlowsToDelete.pipe(
            mergeMap((smartFlow: WorkflowModel) => {
                if (smartFlow) {
                    return super.delete(customerKey, smartFlow.uuid, real);
                } else {
                    return of(false);
                }
            }),
        );
    }

    patchByUuid(customerKey: string, uuid: string, patches: PatchPropertyDto[]): Observable<PatchPropertyDto[]> {
        return from(
            this.smartflowModel.findOne({ customerKey, uuid, deleted: false }),
        ).pipe(
            mergeMap((smartflow: WorkflowModel) => {
                if (smartflow) {
                    return super.patchProperty(customerKey, uuid, patches);
                } else {
                    throw new BadRequestException('SmartFlows unknown');
                }
            }),
        );
    }

    _isUUID(str: string) {
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        return regexExp.test(str); // true
    }
}
