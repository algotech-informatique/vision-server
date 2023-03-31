import { Injectable } from '@nestjs/common';
import { SmartObjectTreeQuery, SmartObjectTreeNavigation } from '@algotech-ce/core';
import { Observable, of, zip } from 'rxjs';
import { SmartObjectsService } from './smart-objects.service';
import * as _ from 'lodash';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { SmartObject, SmartPropertyObject } from '../../interfaces';
import { RxExtendService } from '../../providers/rx-extend/rx-extend.service';

@Injectable()
export class SmartObjectTreeService {

    constructor(
        private readonly smartObjectService: SmartObjectsService,
        private readonly rxExtendService: RxExtendService) { }

    search(customerKey: string, query: SmartObjectTreeQuery): Observable<SmartObject[]> {
        if (query.inputUuids.length === 0) { return of([]); }
        const roots$: Observable<SmartObject[]> =
            zip(..._.map(query.inputUuids, (uuid) => this.smartObjectService.findOne(customerKey, uuid)) as Observable<SmartObject>[]);

        return roots$.pipe(
            mergeMap((roots: SmartObject[]) => {
                const resultsRaw: Observable<SmartObject[]>[] =
                    _.map(roots, (r: SmartObject) => this._browseTree(customerKey, r, query.navigationStrategy, query.depth));
                return this.rxExtendService.sequence(resultsRaw);
            }),
            map((results: SmartObject[][]) => _.uniqBy(_.flatten(results), 'uuid')),
        );
    }
    _browseTree(
        customerKey: string,
        root: SmartObject,
        navigationStrategy: SmartObjectTreeNavigation[],
        maxDepth: number = -1,
        currentDepth: number = -1,
        results: SmartObject[] = []): Observable<SmartObject[]> {

        currentDepth++;
        results.push(root);

        if (currentDepth === maxDepth) {
            return of(results);
        }

        const navStrats = this._findNav(root, navigationStrategy);
        if (!navStrats || navStrats.length === 0) {
            return of(results);
        }

        const mustStop = _.reduce(navStrats, (rs, nav: SmartObjectTreeNavigation) => {
            return rs || (nav.conditionPropertyKey &&
                !this._checkProperty(root, nav.conditionPropertyKey, nav.conditionPropertyValue, nav.conditionInclude));

        }, false);

        if (mustStop) {
            return of(results);
        }

        const next$: Observable<SmartObject>[] = _.compact(_.reduce(navStrats, (rs, nav: SmartObjectTreeNavigation) => {
            const prop: SmartPropertyObject = _.find(root.properties, { key: nav.propertyKey });
            if (!prop) { return rs; }
            if (Array.isArray(prop.value)) {
                if (prop.value.length > 0) {
                    if (nav.conditionNextInclude) {
                        const conds$ = _.reduce(prop.value, (rv, v) => {
                            if (v) {
                                rv.push(this._checkCondition(customerKey,
                                    v, nav.conditionNextPropertyKey, nav.conditionNextPropertyValue, nav.conditionNextInclude));
                            }
                            return rv;
                        }, []);
                        rs = rs.concat(conds$);
                    } else {
                        const multi$ = _.reduce(prop.value, (rv, v) => {
                            if (v) {
                                rv.push(this.smartObjectService.findOne(customerKey, v));
                            }
                            return rv;
                        }, []);
                        rs = rs.concat(multi$);
                    }
                }
            } else if (prop.value) {

                if (nav.conditionNextPropertyValue) {
                    rs.push(this._checkCondition(customerKey,
                        prop.value, nav.conditionNextPropertyKey, nav.conditionNextPropertyValue, nav.conditionNextInclude));
                } else {
                    rs.push(this.smartObjectService.findOne(customerKey, prop.value));
                }
            }
            return rs;
        }, []));
        if (next$.length === 0) {
            return of(results);
        }
        return this.rxExtendService.sequence(next$).pipe(
            mergeMap((sos: SmartObject[]) => {
                const ret$: Observable<SmartObject[]>[] =
                    _.reduce(sos, (rso, so) => {
                        if (so && _.findIndex(results, { uuid: so.uuid }) === -1) { // avoid infinit loop
                            rso.push(this._browseTree(customerKey, so, navigationStrategy, maxDepth, currentDepth, results));
                        }
                        return rso;
                    }, []);

                if (ret$.length === 0) {
                    return of(results);
                }
                return this.rxExtendService.sequence(ret$).pipe(map((fullRet: SmartObject[][]) => _.flatten(fullRet)));
            }),
        );
    }
    _findNav(so: SmartObject, navigationStrategy: SmartObjectTreeNavigation[]): SmartObjectTreeNavigation[] {
        return _.filter(navigationStrategy, (nav: SmartObjectTreeNavigation) => nav.modelKey === so.modelKey);
    }
    _checkCondition(customerKey: string, uuid: string, propertyKey: string, propertyValue: any, include: boolean): Observable<SmartObject> {
        const find$ = this.smartObjectService.findOne(customerKey, uuid);
        return find$.pipe(
            catchError(() => of(null)),
            map((so: SmartObject) => {
                if (!so) { return null; }
                if (this._checkProperty(so, propertyKey, propertyValue, include)) {
                    return so;
                } else {
                    return null;
                }
            }),
        );
    }
    _checkProperty(so: SmartObject, propertyKey: string, propertyValue: string, include: boolean): boolean {
        const prop: SmartPropertyObject = _.find(so.properties, { key: propertyKey });
        if (!prop) { return false; }
        const regex = prop.value.match(new RegExp(propertyValue));
        return ((regex && regex.length > 0 && include) ||
            (!include && !regex));
    }

}