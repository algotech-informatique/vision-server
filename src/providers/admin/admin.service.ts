import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from, of } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { UsersService } from '../users/users.service';
import { Customer, CustomerInit, CustomerInitResult, CustomerSearch, User } from '../../interfaces';
import { RxExtendService } from '../rx-extend/rx-extend.service';
import { CustomerInitDto, CustomerInitResultDto } from '@algotech-ce/core';
import { deleteDocQuery, deletequeries, docIndexQuery, putqueries, postqueries, pipelineQuery } from './init-cmd';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel('Customer') private readonly customerModel: Model<Customer>,
        private readonly usersService: UsersService,
        private readonly httpService: HttpService,
        protected rxExt: RxExtendService,
    ) { }

    private aggregatefromSearch(search): Observable<[]> {
        const aggregates = _.assign(this.getPipelineFromSearch(search));
        return from(this.customerModel.aggregate(aggregates)) as Observable<[]>;
    }

    /* private aggregateUsersfromSearch(search): Observable<[]>{
        const aggregates = _.assign(this.getPipelineFromSearch(search));
        return from(this.userModel.aggregate(aggregates)) as Observable<[]>;
    } */

    listCustomer(customerSearch: CustomerSearch): Observable<Customer[]> {
        if (customerSearch.all) {
            return from(this.customerModel.find({ deleted: false }, { _id: 0, __v: 0, deleted: 0 })) as Observable<Customer[]>;
        } else {
            return this.aggregatefromSearch(customerSearch);
        }
    }

    initCustomer(object: CustomerInit): Observable<CustomerInitResult> {
        const result: CustomerInitResult = {
            key: 'customers',
            value: 'ko',
        };
        const newObject: CustomerInit = _.assign(_.cloneDeep(object), {
            uuid: UUID.UUID(),
            deleted: false,
            createdDate: '',
            updateDate: '',
        });
        const obsCreate$: Observable<Customer> = this.listCustomer({ customerKey: [object.customerKey] }).pipe(
            mergeMap((customers: Customer[]) => {
                if (customers.length === 0) {
                    return from(new this.customerModel(newObject).save());
                } else {
                    return of(null);
                }
            }),
            catchError(() => {
                throw new BadRequestException('customerKey error');
            }),
        );
        Logger.log('customers/init ');
        return this.cleanMongo(obsCreate$).pipe(
            map((customer) => {
                if (customer) {
                    result.value = 'ok';
                } else {
                    result.value = 'ko';
                }
                return result;
            }),
            catchError(() => {
                result.value = 'ko';
                throw new InternalServerErrorException(result);
            }),
        );
    }

    /* listUser(userSearch: UserSearch): Observable<User[]> {
        if (userSearch.all) {
            return from(this.userModel.find({ deleted: false }, { _id: 0, __v: 0, deleted: 0 }));
        } else {
            return this.aggregateUsersfromSearch(userSearch);
        }
    } */

    initUser(object: CustomerInit, sadmin: boolean, ignoreEmail: boolean): Observable<CustomerInitResult> {
        const result: CustomerInitResult = {
            key: 'users',
            value: 'ko',
        };
        const newUser: User = {
            uuid: '',
            groups: sadmin ? ['sadmin'] : ['admin'],
            deleted: false,
            createdDate: '',
            updateDate: '',
            enabled: true,
            preferedLang: _.size(object.languages) > 0 ? object.languages[0].lang : 'fr-FR',
            username: object.login,
            email: object.email,
            firstName: '',
            lastName: '',
            customerKey: object.customerKey,
            pictureUrl: 'https://',
            following: [],
            favorites: {
                documents: [],
                smartObjects: [],
            },
        };
        Logger.log('users/init');
        return this.usersService.create(object.customerKey, newUser, ignoreEmail).pipe(
            map((user) => {
                if (user) {
                    result.value = 'ok';
                } else {
                    result.value = 'ko';
                }
                return result;
            }),
            catchError(() => {
                result.value = 'ko';
                throw new InternalServerErrorException(result);
            }));
    }

    private cleanMongo(obs: Observable<any>): Observable<any> {
        return obs.pipe(
            map((obj: any) => {
                return Object.assign({}, obj._doc, { _id: undefined, __v: undefined });
            }));
    }

    private getStringQuery(fieldName: string, values: string[]): {} {
        const inTab = {};
        inTab[fieldName] = { $in: [] };
        inTab[fieldName].$in = _.concat(inTab[fieldName].$in, values);
        return inTab;
    }

    getPipelineFromSearch(filter): {} {
        const match = { $match: _.assign({ $and: [] }) };
        const pripeline = [];
        let keys = [];

        if (filter) {
            keys = Object.keys(filter);
        }
        match.$match.$and.push({ deleted: false });
        if (_.size(keys) > 0) {
            for (const key of keys) {
                if (filter[key]) {
                    if (Array.isArray(filter[key])) {
                        match.$match.$and.push(this.getStringQuery(key, filter[key]));
                    }
                }
            }
            pripeline.push(match);
        }
        return pripeline;
    }

    _setPutESQuery(customer: CustomerInitDto, query: CustomerInitResultDto): Observable<CustomerInitResultDto> {
        const result: CustomerInitResultDto = {
            key: query.key,
            value: 'ko',
        };
        return this.httpService.put(query.query.replace('$', customer.customerKey), query.data)
            .pipe(
                map((response) => {
                    if (response.data) {
                        if (response.data.result && response.data.result === 'created') {
                            result.value = 'ok';
                            return result;
                        }
                        if (response.data.acknowledged) {
                            result.value = 'ok';
                            return result;
                        }
                    }
                }, (err) => { result.value = 'ko'; return result; }));
    }

    _setPostESQuery(customer: CustomerInitDto, query: CustomerInitResultDto): Observable<CustomerInitResultDto> {
        const result: CustomerInitResultDto = {
            key: query.key,
            value: 'ko',
        };
        return this.httpService.post(query.query.replace('$', customer.customerKey), query.data)
            .pipe(
                map((response) => {
                    if (response.data) {
                        if (response.data.result && response.data.result === 'created') {
                            result.value = 'ok';
                            return result;
                        }
                        if (response.data.acknowledged) {
                            result.value = 'ok';
                            return result;
                        }
                    }
                }, (err) => { result.value = 'ko'; return result; }));
    }

    _setDeleteESQuery(customerKey: string, query: CustomerInitResultDto): Observable<CustomerInitResultDto> {
        const result: CustomerInitResultDto = {
            key: query.key,
            value: 'ko',
        };
        return this.httpService.delete(query.query.replace('$', customerKey))
            .pipe(
                map((response) => {
                    if (response.data) {
                        if (response.data.result && response.data.result === 'created') {
                            result.value = 'ok';
                            return result;
                        }
                        if (response.data.acknowledged) {
                            result.value = 'ok';
                            return result;
                        }
                    }
                }),
                catchError(() => {
                    result.value = 'ko'; result.query = query.query.replace('$', customerKey);
                    throw new InternalServerErrorException(result);
                }));
    }

    initDataBase(customer: CustomerInitDto, cmds$: Observable<CustomerInitResultDto>[], keycloakOnly: boolean): Observable<CustomerInitResultDto[]> {
        if (!keycloakOnly) {
            // Set ES indexes & pipeline
            _.forEach(putqueries, (putQuery) => cmds$.push(this._setPutESQuery(customer, putQuery)));
        }

        return this.rxExt.sequence(cmds$).pipe(
            catchError((err) => {
                console.log(err);
                return of(err);
            }),
        );
    }

    deleteESindexAndPipeline(customerKey: string): Observable<CustomerInitResultDto[]> {
        return this.rxExt.sequence(_.map(deletequeries, (deleteQuery) => this._setDeleteESQuery(customerKey, deleteQuery)));
    }

    resetdocIndex(customer: CustomerInitDto): Observable<CustomerInitResultDto[]> {
        const cmds$: Observable<CustomerInitResultDto>[] = [
            this._setDeleteESQuery(customer.customerKey, deleteDocQuery).pipe(
                catchError(() => of(deleteDocQuery))),
            this._setPutESQuery(customer, docIndexQuery)];

        return this.rxExt.sequence(cmds$);
    }

    resetESPipelineAndTempates(customer: CustomerInitDto): Observable<CustomerInitResultDto[]> {
        const cmds$: Observable<CustomerInitResultDto>[] = [this._setPutESQuery(customer, pipelineQuery)];

        _.forEach(postqueries, (query) => cmds$.push(this._setPostESQuery(customer, query)));

        return this.rxExt.sequence(cmds$);
    }
}