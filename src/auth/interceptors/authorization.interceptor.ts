import { NestInterceptor, ExecutionContext, CallHandler, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable, zip, throwError, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { SmartObjectDto, SmartModelDto, GeoPOIDto } from '@algotech-ce/core';
import { AuthorizationService } from '../services/authorization.service';
import * as _ from 'lodash';
import { IdentityRequest, SmartModel } from '../../interfaces';
import { identityDecode } from '../../common/@decorators';

@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {

    constructor(private readonly authorizationService: AuthorizationService) { }

    private _getModel(smKey: string) {
        return this.authorizationService.getSmartModel(smKey).pipe(
            catchError((error) => {
                return throwError(() => error);
            }),
        );
    }

    private _handleArray(sos: SmartObjectDto[], currentUser: IdentityRequest, currentUserGroups: any, method: string, operation: 'RW' | 'R' = 'R')
        : Observable<SmartObjectDto[]> {
        const obsArrData: Observable<any>[] =
            sos.map((so: SmartObjectDto) => {
                return this._handleSingle(so, currentUser, currentUserGroups, method, operation).pipe(
                    catchError(() => {
                        return of(null);
                    }),
                );
            });
        return zip(...obsArrData).pipe(map((data) => data.filter((so) => so)));
    }

    private _handleSingle(so: any, currentUser: IdentityRequest, currentUserGroups: any, method: string, operation: 'RW' | 'R' = 'R')
        : Observable<SmartObjectDto> {
        return this._getModel(so.modelKey).pipe(
            mergeMap((model) => {
                return of(this.authorizationService.getSmartObjectChecker(so, model, currentUserGroups, operation));
            }),
        );
    }

    private _handleModels(soArray: SmartObjectDto[], currentUser): Observable<SmartModelDto[] | never> {
        const uniqSmKeys = _.uniqBy(soArray, 'modelKey').map((so) => so.modelKey);
        const obsModels: Observable<SmartModelDto | never>[] = uniqSmKeys.map((smKey: string) =>
            this._getModel(smKey),
        );
        return zip(...obsModels);
    }

    private _handleGeo(sm: any, soBox: any[], request, currentUserGroups): Observable<GeoPOIDto[]> {
        if (!this.authorizationService.permissionResolver(sm.permissions, currentUserGroups, 'R')) {
            throw new ForbiddenException('You need R permission on the smart object "' + sm.key + '"');
        }
        const findPropKeyFilter = _.find(sm.properties, (prop) => prop.key === request.propKeyFilter);
        if (findPropKeyFilter) {
            if (!this.authorizationService.permissionResolver(findPropKeyFilter.permissions, currentUserGroups, 'R')) {
                throw new ForbiddenException('You need R permission on the property "' + request.propKeyFilter + '"');
            }
        }
        if (request.propKey) {
            const findPropKey = _.find(sm.properties, (prop) => prop.key === request.propKey);
            if (findPropKey) {
                if (!this.authorizationService.permissionResolver(findPropKey.permissions, currentUserGroups, 'R')) {
                    throw new ForbiddenException('You need R permission on the property "' + request.propKey + '"');
                }
            }
        }
        return of(soBox);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<SmartObjectDto | SmartObjectDto[] | GeoPOIDto[]> {
        const req = context.switchToHttp().getRequest();
        const currentUser = identityDecode(req);
        if (!currentUser) {
            throw new Error(`error during intercept, bearer incorrect ${context.getArgs()[0].headers.authorization}`);
        }
        const currentUserGroups = currentUser.groups;

        // Recupere le controller appelant intercepteur
        const requestMethod = context.getArgs()[0].method;
        const args = context.getArgs()[0];

        return next.handle()
            .pipe(
                mergeMap((handlerData: SmartObjectDto | SmartObjectDto[]) => {
                    if (currentUserGroups.includes('sadmin')) {
                        return of(handlerData);
                    }

                    if (Array.isArray(handlerData)) {
                        if (handlerData.length > 0) {
                            if (args.url === '/smart-objects/geo') {
                                if (args.body.geobox?.modelKey) {
                                    const soBox: any[] = handlerData;
                                    return this._getModel(args.body.geobox.modelKey).pipe(
                                        mergeMap((model) => {
                                            return this._handleGeo(model, soBox, args.body.geobox, currentUserGroups);
                                        }),
                                    );
                                } else {
                                    throw new BadRequestException('Missing modelKey property in request');
                                }
                            } else {
                                const soArray: SmartObjectDto[] = handlerData as SmartObjectDto[];
                                return this._handleModels(soArray, currentUser).pipe(
                                    mergeMap(() => {
                                        return this._handleArray(handlerData, currentUser, currentUserGroups, requestMethod, 'R');
                                    }),
                                );
                            }
                        } else {
                            return of([]);
                        }
                    } else {
                        if (handlerData?.modelKey) {
                            return this._getModel(handlerData.modelKey).pipe(
                                catchError((error) => {
                                    return throwError(() => error);
                                }),
                                mergeMap(() => this._handleSingle(handlerData, currentUser, currentUserGroups, requestMethod, 'R')),
                            );
                        } else {
                            return of(null);
                        }
                    }
                }),
            );
    }

}
