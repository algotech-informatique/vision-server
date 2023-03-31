import { BadRequestException, Injectable } from '@nestjs/common';
import { concat, Observable, zip } from 'rxjs';
import { catchError, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { SettingsDataService } from '../@base/settings-data.service';
import { SmartNodesService } from '../smart-nodes/smart-nodes.service';
import { TagsService } from '../tags/tags.service';
import * as _ from 'lodash';
import { CustomerService } from '../customers/customers.service';
import { LangDto, PairDto } from '@algotech-ce/core';
import { Customer, SnModel } from '../../interfaces';
import { Readable } from 'stream';
import { i18nLanguages } from './i18n.languages';
import { GenericListsSevice } from '../glists/glists.service';
import { SettingsService } from '../settings/settings.service';
import { I18nImportResultDto } from '@algotech-ce/core';
import { ProcessMonitoring } from '../../interfaces/process-monitoring/process-monitoring.interface';
import { UUID } from 'angular2-uuid';
import { ProcessMonitoringHead } from '../process-monitoring/process-monitoring.head';
@Injectable()
export class I18nService {

    constructor(
        private customer: CustomerService,
        private gLists: GenericListsSevice,
        private settingsService: SettingsService,
        private snModel: SmartNodesService,
        private tags: TagsService,
        private settingsData: SettingsDataService,
        private processMonitoringHead: ProcessMonitoringHead) { }

    import(customerKey: string, file: Buffer): Observable<boolean> {
        return zip(
            this.customer.findByCustomerKey(customerKey),
            this._bowseCollection(customerKey),
        ).pipe(
            mergeMap(([customer, data]) => {
                const papa = require('papaparse');
                const stream = Readable.from(file.toString());

                return new Observable<boolean>((observer) => {
                    papa.parse(stream, {
                        skipEmptyLines: true,
                        header: true,
                        complete: (res) => {
                            let import$: Observable<boolean>;
                            try {
                                import$ = this._doImport(customerKey, res.data, data, customer);
                            } catch (err) {
                                observer.error(err);
                                observer.complete();
                                return;
                            }

                            if (!import$) {
                                observer.next(false);
                                observer.complete();
                                return;
                            }

                            // async
                            import$.subscribe();
                            observer.next(true);
                            observer.complete();
                        },
                        error: (err) => {
                            observer.error(err);
                            observer.complete();
                        }
                    });
                })
            })
        );
    }

    export(customerKey: string): Observable<Buffer> {
        const papa = require('papaparse');
        return zip(
            this.customer.findByCustomerKey(customerKey),
            this._bowseCollection(customerKey),
        ).pipe(
            map(([customer, data]) => {
                const fields = ['context', ...customer.languages.map((l) => l.lang), 'id'];
                const values = data.map((d) => {
                    return fields.map((field) => {
                        const find = d.find((lang) => lang.key === field);
                        return find ? find.value : '';
                    });
                });
                const csv = papa.unparse({
                    fields: fields,
                    data: values
                });
                return csv;
            })
        )
    }

    _doImport(customerKey: string, csvData: any[], dbData: PairDto[][], customer: Customer): Observable<boolean> {
        if (csvData.length === 0) {
            return null;
        }

        // check error
        [...customer.languages.map((l) => l.lang), 'id']
            .forEach((value) => {
                if (!Object.keys(csvData[0]).some((key) => key === value)) {
                    throw new BadRequestException(`langs or columns missing: ${value}`);
                }
            })

        // update customer
        let updateCustomer = false;
        for (const lang of Object.keys(csvData[0])) {
            const findLang = i18nLanguages.find((languages) => languages.lang === lang);
            if (findLang && !customer.languages.some((l) => l.lang === findLang.lang)) {
                customer.languages.push(findLang);
                updateCustomer = true;
            }
        }
        if (updateCustomer) {
            this.customer.update(customerKey, customer).subscribe();
        }

        // update resource
        return this._updateResources(customerKey, csvData, dbData, customer);
    }

    _updateResources(customerKey: string, csvData: any[], dbData: PairDto[][], customer: Customer): Observable<any> {
        const updateValues = [];
        const result: I18nImportResultDto = csvData.reduce((rows: I18nImportResultDto, row) => {
            if (row.id) {
                const item: PairDto[] = dbData.find((item) => item.find((pair) => pair.key === 'id')?.value === row.id);
                if (item) {
                    const custom = (item.find((p) => p.key === 'custom') as any)?.value;
                    const resource = custom.resource;
                    const context = custom.context;
                    const lang: LangDto[] = custom.lang;
                    // reassign

                    let update = false;

                    for (const language of customer.languages) {
                        // push lang
                        const findLang = lang.find((l) => l.lang === language.lang);
                        const value = row[language.lang];
                        if (!findLang) {
                            lang.push({
                                lang: language.lang,
                                value,
                            });
                            update = true;
                            updateValues.push({ context, resource });
                        } else {
                            if (findLang.value !== value) {
                                findLang.value = value;

                                update = true;
                                updateValues.push({ context, resource });
                            }
                        }
                    }
                    if (update) {
                        rows.updatedRows++;
                    } else {
                        rows.ignoreRows++;
                    }
                } else {
                    rows.unknownRows++;
                }
            }
            return rows;
        }, { unknownRows: 0, updatedRows: 0, ignoreRows: 0 });

        // save resource
        return this._saveResources(result, customerKey, updateValues);
    }

    _saveResources(result: I18nImportResultDto, customerKey: string, updateValues: { context: string, resource: any }[]) {

        // save resource

        const save$ = _.uniqBy(updateValues, 'resource').map((ele) => {
            switch (ele.context) {
                case 'glists': {
                    return this.gLists.update(customerKey, ele.resource);
                }
                case 'settings': {
                    return this.settingsService.update(customerKey, ele.resource);
                }
                case 'tags': {
                    return this.tags.update(customerKey, ele.resource);
                }
                default:
                    return this.snModel.update(customerKey, ele.resource);
            }
        });

        if (save$.length === 0) {
            return null;
        }

        const monitoring: ProcessMonitoring = {
            uuid: UUID.UUID(),
            customerKey: customerKey,
            deleted: false,
            processState: 'inProgress',
            processType: 'importI18n',
            current: 0,
            total: save$.length,
            result: {}
        };

        this.processMonitoringHead.create(customerKey, monitoring);
        return concat(...save$).pipe(
            mergeMap(() => {
                monitoring.current++;
                return this.processMonitoringHead.update(customerKey, monitoring);
            }),
            toArray(),
            mergeMap(() => {
                monitoring.processState = 'succeeded';
                monitoring.result = result;
                return this.processMonitoringHead.update(customerKey, monitoring);
            }),
            catchError((err) => {
                monitoring.processState = 'error';
                monitoring.result = err;
                return this.processMonitoringHead.update(customerKey, monitoring);
            }),
            tap(() => process.emit('message', { cmd: 'clear-data-cache' }, this)),
        );
    }

    _bowseCollection(customerKey: string): Observable<PairDto[][]> {
        const all$ = zip(this.settingsData.getContext(), this.snModel.findAll(customerKey), this.tags.findAll(customerKey)).pipe(
            map(([context, snModels, tags]) => ([
                {
                    context: 'snModel',
                    values: snModels.sort((a, b) => a.type.localeCompare(b.type))
                },
                {
                    context: 'glists',
                    values: context.glists
                }, {
                    context: 'settings',
                    values: [context.settings]
                }, {
                    context: 'tags',
                    values: tags
                }]))
        )

        const results = [];
        return all$.pipe(
            map((resources) => {
                for (const item of resources) {
                    for (const value of item.values) {
                        switch (item.context) {
                            case 'snModel':
                                this._browse(value, results, [], (value as SnModel).type, value);
                                break;
                            default:
                                this._browse(value, results, [], item.context, value);
                                break;
                        }
                    }
                }
                return results;
            })
        );
    }

    _browse(element: any, results: PairDto[][] = [], ids: PairDto[], context: string, resource: any, previous = ''): void {
        if (Array.isArray(element)) {
            if (element.length > 0 && element[0].lang != null && element[0].value != null) {
                const item: PairDto[] = [];
                item.push({
                    key: 'context',
                    value: context,
                });
                item.push({
                    key: 'id',
                    value: this._calculId(ids, context, previous),
                });
                item.push({
                    key: 'custom',
                    value: { resource, lang: element, context }
                });
                item.push(...(element as LangDto[]).map((ele) => ({
                    key: ele.lang,
                    value: ele.value,
                })));

                results.push(item);
                return;
            }

            element.forEach((item) => {
                this._browse(item, results, ids, context, resource, previous);
            }, []);

            return;
        }
        if (_.isObject(element)) {
            const concat = [...ids, {
                key: previous,
                value: element?.uuid || element?.id || element.key || previous
            }];
            Object.entries<any>(element).forEach(([key, value]) => {
                this._browse(value, results, concat, context, resource, key);
            }, []);

            return;
        }

        return;
    }

    _calculId(ids: PairDto[], context: string, key: string) {
        if (context === 'app') {
            // cut array (reject since "pages" to "widgets" (last))
            const index = ids.indexOf(ids.find((id) => id.key === 'pages' || id.key === 'shared'));
            if (ids.some((id) => id.key === 'shared')) {
                key = `${key}:shared`;
            }
            const lastIndex = ids.lastIndexOf([...ids].reverse().find((ele) => ele.key === 'widgets'));
            if (lastIndex > -1 && index > -1) {
                ids = [..._.take(ids, index), ..._.drop(ids, lastIndex)];
            }
        }

        return ids.map((id) => `${id.key}:${id.value}`).join('-') + '-' + key;
    }
}
