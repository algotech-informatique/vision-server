import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Injectable, BadRequestException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass, ClassTransformOptions } from 'class-transformer';
import { ClassConstructor } from 'class-transformer';
import { NatsResponse } from '../../interfaces';
import * as _ from 'lodash';
import { getMetadataStorage, validateSync } from 'class-validator';
import { Response } from 'express';
import { HttpResponse } from './http.response';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

@Injectable()
export class NatsService {

    constructor() { }

    decoreResponse(asyncResult: Observable<any>): Observable<NatsResponse> {
        return asyncResult.pipe(
            mergeMap(result => {
                const response: NatsResponse = {
                    hasError: false,
                    httpCode: 200,
                    deliveryDate: new Date().valueOf(),
                    response: result,
                };
                return of(response);
            }),
            catchError((err: BadRequestException) => {
                const response: NatsResponse = {
                    hasError: true,
                    httpCode: 400,
                    deliveryDate: new Date().valueOf(),
                    errorMsg: err.message,
                };
                return of(response);
            }),
            catchError((err: Error) => {
                const response: NatsResponse = {
                    hasError: true,
                    httpCode: 500,
                    deliveryDate: new Date().valueOf(),
                    errorMsg: err.message,
                };
                return of(response);
            }),
        );
    }

    errorResponse(codeErr: number, message: string): NatsResponse {
        const response: NatsResponse = {
            hasError: true,
            httpCode: codeErr,
            deliveryDate: new Date().valueOf(),
            errorMsg: message, // TODO Gérer les erreurs multilingues
        };
        return response;
    }

    sendResponse(resolve$: Observable<any>, response: Response) {
        // complete response express
        resolve$.pipe(
            catchError((e) => {
                if (e instanceof HttpException) {
                    return throwError(() => e);
                }
                return throwError(() => new InternalServerErrorException(e.message));
            })
        ).subscribe({
            next: (res) => {
                if (res instanceof HttpResponse) {
                    response.status(res.status ? res.status : HttpStatus.OK).json(res.response === null ? undefined : res.response);
                } else {
                    response.status(HttpStatus.OK).json(res === null ? undefined : res);
                }
            },
            error: (err: HttpException) => {
                const res = err.getResponse();
                response.status(err.getStatus()).json(res === null ? undefined : res);
            }
        });
    }

    httpResult(asyncNatsResponse: Observable<any>, dtoType?: ClassConstructor<{}>, groupFilter?: string, decore = true): Observable<any> {
        const options: ClassTransformOptions = groupFilter ?
            { groups: _.split(groupFilter, ','), strategy: 'excludeAll' } :
            { ignoreDecorators: true };

        const natsResult$ = (decore ? this.decoreResponse(asyncNatsResponse) : asyncNatsResponse);
        return natsResult$.pipe(
            map((natsResult: NatsResponse) => {
                switch (natsResult.httpCode) {
                    case 200:
                        if (natsResult.response == null) {
                            return null;
                        }
                        if (dtoType && groupFilter) {
                            if (Array.isArray(natsResult.response)) {
                                if (natsResult.response.length > 0) {
                                    return natsResult.response.map((element) => {
                                        const value = plainToClass(dtoType, JSON.parse(JSON.stringify(element)), options);
                                        validateSync(value, { whitelist: true });
                                        return value;
                                    });
                                } else {
                                    return [];
                                }
                            } else {
                                const value = plainToClass(dtoType, JSON.parse(JSON.stringify(natsResult.response)), options);
                                validateSync(value, { whitelist: true });
                                return value;
                            }
                        }
                        const response = natsResult.response;
                        let metadata: ValidationMetadata[];
                        if (dtoType) {
                            metadata = getMetadataStorage().getTargetValidationMetadatas(dtoType, undefined, undefined, undefined);
                        }
                        const canDeleteDeleted = metadata ? !metadata.find((validationMetadata: ValidationMetadata) => (validationMetadata.propertyName === 'deleted')) : true;
                        const canDeleteCustomerKey = metadata ? !metadata.find((validationMetadata: ValidationMetadata) => (validationMetadata.propertyName === 'customerKey')) : true;
                        
                        if (Array.isArray(response)) {
                            return _.map(response, (item: any) => {
                                if (_.isObject(item)) {
                                    delete item._id;

                                    if (canDeleteDeleted) {
                                        delete item.deleted;
                                    }
                                    if (canDeleteCustomerKey) {
                                        delete item.customerKey;
                                    }
                                    delete item.__v;
                                }
                                return item;
                            });
                        } else if (_.isObject(response)) {
                            delete response._id;
                            if (canDeleteDeleted) {
                                delete response.deleted;
                            }
                            if (canDeleteCustomerKey) {
                                delete response.customerKey;
                            }
                            delete response.__v;
                        }
                        return response;


                    case 400:
                        throw new BadRequestException(natsResult.errorMsg);
                    case 500:
                        throw new InternalServerErrorException(natsResult.errorMsg);
                }
            }),
        );
    }
}
