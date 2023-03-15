import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { IdentityRequest, User } from '../../interfaces';

@Injectable()
export class UsersHead {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    find(data: {
        identity: IdentityRequest,
        uuid?: string,
        username?: string,
    }): Observable<User | User[]> {
        if (data.uuid) {
            return this.usersService.findOne(data.identity.customerKey, data.uuid);
        } else if (data.username) {
            return this.usersService.findOneByLogin(data.identity.customerKey, data.username);
        } else {
            return this.usersService.findAll(data.identity.customerKey);
        }
    }

    create(data: {
        identity: IdentityRequest,
        user: User,
        ignoreEmail: boolean,
    }): Observable<User> {
        return this.usersService.create(data.identity.customerKey, data.user, data.ignoreEmail);
    }

    update(data: {
        identity: IdentityRequest,
        updateUserDto: User,
    }): Observable<User> {
        return this.find({ identity: data.identity, uuid: data.updateUserDto.uuid, username: data.updateUserDto.username }).pipe(
            mergeMap((user: User) => {
                return this.usersService.update(data.identity.customerKey, Object.assign(data.updateUserDto, { uuid: user.uuid, username: user.username }));
            }),
        );
    }

    updatePart(data: {
        identity: IdentityRequest,
        uuid: string,
        user: any,
    }): Observable<User> {
        return this.usersService.patch(data.identity.customerKey, data.uuid, data.user);
    }

    delete(data: {
        identity: IdentityRequest,
        uuid: string,
    }): Observable<boolean> {
        const obsDelete = this.usersService.delete(
            data.identity.customerKey,
            data.uuid,
        );
        return obsDelete.pipe(
            mergeMap((result: boolean) => {
                if (result === true) {
                    return of(result);
                } else {
                    return throwError(() => new BadRequestException('Delete user failed'));
                }
            }),
        );
    }

    assignMobileToken(customerKey: string, uuid: string, mobileToken: string): Observable<boolean> {
        if (!mobileToken) {
            return of();
        }
        return this.usersService.patch(customerKey, uuid, { mobileToken })
            .pipe(
                catchError(() => {
                    return throwError(() => new BadRequestException('Update mobileToken failed'));
                }),
                map(() => {
                    return true;
                }),
            );
    }

    removeMobileToken(data: {
        identity: IdentityRequest,
        uuid: string,
    }): Observable<boolean> {
        return this.usersService.removeMobileToken(data.identity.customerKey, data.uuid, data.identity.azp);
    }

    getMobileToken(data: {
        identity: IdentityRequest,
        to: string[],
        exclude: string,
    }): Observable<string[]> {
        return this.usersService.getMobileToken(data.identity.customerKey, data.to, data.exclude);
    }
}
