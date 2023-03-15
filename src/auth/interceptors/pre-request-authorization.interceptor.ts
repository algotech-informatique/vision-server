import { NestInterceptor, ExecutionContext, CallHandler, Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Observable, of, throwError, } from 'rxjs';
import { catchError, map, mergeMap, } from 'rxjs/operators';
import { SmartObjectDto, GeoPOIDto } from '@algotech/core';
import { AuthorizationService } from '../services/authorization.service';
import * as _ from 'lodash';
import { identityDecode } from '../../common/@decorators';
import { SmartModel, SmartObject } from '../../interfaces';

@Injectable()
export class PreRequestAuthorizationInterceptor implements NestInterceptor {

    constructor(private readonly authorizationService: AuthorizationService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<SmartObjectDto | SmartObjectDto[] | GeoPOIDto[]> {
        const req = context.switchToHttp().getRequest();
        const currentUser = identityDecode(req);

        if (!currentUser) {
            throw new Error(`error during intercept, bearer incorrect ${context.getArgs()[0].headers.authorization}`);
        }
        const currentUserGroups = currentUser.groups;

        return of(null).pipe(
            mergeMap(() => {
                if (currentUserGroups.includes('sadmin')) {
                    return of(null);
                } else if (req.route.path.startsWith('/smart-objects/cache')) {
                    return of(null);
                } else if (!req.route.path.startsWith('/smart-objects/search') &&
                    !req.route.path.startsWith('/smart-objects/geo') &&
                    !req.route.path.startsWith('/smart-objects/magnets') &&
                    !req.route.path.startsWith('/smart-objects/tree-search')) {
                    if (req.method === 'POST') {
                        if (req.route.path.startsWith('/smart-objects/subdoc') ||
                            req.route.path.startsWith('/smart-objects/import')) {
                            return of(null);
                        }
                        const soAdd: SmartObjectDto = req.body;
                        return this.authorizationService.getSmartModel(soAdd.modelKey)
                            .pipe(
                                map((r: SmartModel) => {
                                    req.body = this.authorizationService.postSmartObjectChecker(soAdd, r, currentUserGroups, 'RW');
                                    return true;
                                }),
                            );
                    } else if (req.method === 'DELETE') {
                        return this.authorizationService.getSmartObject(req.body.uuid, currentUser).pipe(
                            catchError((e) => {
                                return throwError(() => new BadRequestException(e.message));
                            }),
                            mergeMap((smartObject: SmartObject) => {
                                return this.authorizationService.getSmartModel(smartObject.modelKey);
                            }),
                            map((smartModel: SmartModel) => {
                                if (this.authorizationService.deleteSmartObjectChecker(smartModel, currentUserGroups, 'RW')) {
                                    return true;
                                } else {
                                    throw new ForbiddenException(`Not allowed to perform RW operations on this object`);
                                }
                            }),
                            map(() => {
                                return null;
                            }),
                        );
                    } else if (req.method === 'PATCH') {
                        const soUuid = req.url.replace('/smart-objects/', '');
                        return this.authorizationService.getSmartObject(soUuid, currentUser).pipe(
                            catchError((e) => {
                                return throwError(() => new BadRequestException(e.message));
                            }),
                            mergeMap((smartObject: SmartObject) => {
                                return this.authorizationService.getSmartModel(smartObject.modelKey);
                            }),
                            map((smartModel: SmartModel) => {
                                try {
                                    this.authorizationService.patchSmartObjectChecker(req.body, smartModel, currentUserGroups, 'RW');
                                    return true;
                                }
                                catch (error) {
                                    throw new ForbiddenException(`Not allowed to perform RW operations on this object or property`);
                                }
                            }),
                        );
                    } else if (req.route.path.startsWith('/smart-objects/property') && (req.method === 'GET')) {
                        const soModelKey = req._parsedUrl.pathname.replace('/smart-objects/property/', '');
                        return this.authorizationService.getSmartModel(soModelKey)
                            .pipe(
                                map((smartModel: SmartModel) => {
                                    try {
                                        this.authorizationService.searchSmartObjectChecker(soModelKey,
                                            this.getParameterByName('property', req.url), smartModel, currentUserGroups, 'R');
                                        return true;
                                    }
                                    catch (error) {
                                        throw new ForbiddenException(error.response);
                                    }
                                }),
                            );
                    } else {
                        return of(null);
                    }
                } else {
                    if (req.method === 'GET') {
                        const soModelKey = req._parsedUrl.pathname.replace('/smart-objects/search/', '');
                        return this.authorizationService.getSmartModel(soModelKey)
                            .pipe(
                                map((smartModel: SmartModel) => {
                                    try {
                                        this.authorizationService.searchSmartObjectChecker(soModelKey,
                                            this.getParameterByName('property', req.url), smartModel, currentUserGroups, 'R');
                                        return null;
                                    }
                                    catch (error) {
                                        throw new ForbiddenException(error.response);
                                    }
                                }),
                            );
                    } else {
                        return of(null);
                    }
                }
            }),
            mergeMap(() => {
                return next.handle();
            })
        );

    }

    private getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

}
