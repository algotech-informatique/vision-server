import { Model } from 'mongoose';
import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, from, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { DefaultEnvironment } from './default-environment';
import { Environment, CustomerInitResult, CustomerInit } from '../../interfaces';
import { BaseService } from '../@base/base.service';
import { EnvironmentConnectorDto } from '@algotech-ce/core';

@Injectable()
export class EnvironmentService extends BaseService<Environment> {
    constructor(
        @InjectModel('Environment') private readonly environmentModel: Model<Environment>,
    ) {
        super(environmentModel);
    }

    init(customer: CustomerInit): Observable<CustomerInitResult> {
        const result: CustomerInitResult = {
            key: 'environment',
            value: 'ko',
        };
        return this.create(customer.customerKey, DefaultEnvironment.defaultEnvironment).pipe(
            map((environment) => {
                Logger.log('environment/init');
                if (environment) {
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

    create(customerKey: string, data: Environment): Observable<Environment> {

        return from(this.environmentModel.findOne({ customerKey, deleted: false }).lean()
        ).pipe(mergeMap((findEnvironment: Environment) => {
            if (findEnvironment !== null) {
                throw new BadRequestException('Environment already exist');
            } else {
                return super.create(customerKey, data, true);
            }
        }),
        );
    }

    findOneByCustomerKey(customerKey: string): Observable<Environment> {
        return from(
            this.environmentModel.findOne({ customerKey, deleted: false }).lean(),
        ).pipe(
            mergeMap((environment: Environment) => {
                if (environment) {
                    return of(environment);
                } else {
                    throw new BadRequestException('Environment name unknown');
                }
            }),
        );
    }

    getParameters(customerKey: string): Observable<EnvironmentConnectorDto[]> {
        return this.findOneByCustomerKey(customerKey).pipe(
            map((env) => {
                return env.smartflows.map((connector) => {
                    const item: EnvironmentConnectorDto = {
                        name: connector.name,
                        uuid: connector.uuid,
                        parameters: connector.custom,
                    }

                    return item;
                })
            })
        );
    }

    setParameters(customerKey: string, connectors: EnvironmentConnectorDto[]): Observable<EnvironmentConnectorDto[]> {
        return this.findOneByCustomerKey(customerKey).pipe(
            mergeMap((env) => {

                for (const connector of connectors) {
                    const find = env.smartflows.find((sf) => sf.uuid === connector.uuid);
                    if (find) {
                        Object.assign(find, { custom: connector.parameters });
                    } else {
                        env.smartflows.push({
                            name: connector.name,
                            uuid: connector.uuid,
                            custom: connector.parameters,
                            subDirectories: [],
                        })
                    }
                }

                return this.update(customerKey, env);
            }),
            map(() => connectors)
        );
    }

    encryptPassword(password: string) {
        const Cryptr = require('cryptr');
        if (!process.env.CRYPTR_SECRET) {
            throw new Error('CRYPTR_SECRET is not defined')
        }
        const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

        return cryptr.encrypt(password);
    }

    decryptPassword(encryptedString: string) {
        const Cryptr = require('cryptr');
        if (!process.env.CRYPTR_SECRET) {
            throw new Error('CRYPTR_SECRET is not defined')
        }
        const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

        return cryptr.decrypt(encryptedString);
    }
}
