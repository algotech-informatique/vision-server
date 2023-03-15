import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthHead } from '../../providers';
import * as jwt from 'jsonwebtoken';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private reflector: Reflector, @Inject(AuthHead) private authHead?: AuthHead) { }

    canActivate(context: ExecutionContext): Observable<boolean> {
        const roles = this.reflector.get('roles', context.getHandler());
        const isKcAdmin = !!this.reflector.get('kcAdmin', context.getHandler());

        const ctxArgs = context.getArgs();
        const request = context.switchToHttp().getRequest();
        if (ctxArgs && ctxArgs.length > 0) {

            let token;
            if (ctxArgs[0].headers.authorization) {
                token = ctxArgs[0].headers.authorization.replace('Bearer ', '');
            } else if (ctxArgs[0].query.jwt) {
                token = ctxArgs[0].query.jwt;
            } else {
                return throwError(() => new UnauthorizedException());
            }

            const decoded = jwt.decode(token);

            const checkAuth$ = isKcAdmin ? this.authHead.validateTokenAdmin(token) : this.authHead.validateTokenUser(token);

            return checkAuth$.pipe(
                catchError((err) => {
                    return of(null);
                }),
                map((authenticated: boolean) => {
                    if (authenticated) {

                        if (!isKcAdmin) {
                            if (Array.isArray(roles)) {
                                if(!roles.some((group) => decoded.groups.includes(group))) {
                                    throw new ForbiddenException();
                                }
                            }
                        }

                        request.user = decoded;
                        return true;
                    } else {
                        throw new UnauthorizedException();
                    }
                }),
            );
        } else {
            return throwError(() => new UnauthorizedException());
        }
    }
}