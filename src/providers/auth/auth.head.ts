import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { KeycloakService } from '../admin/keycloak.service';
import { SignInDto } from '@algotech/core';

@Injectable()
export class AuthHead {

    constructor(private readonly keycloakService: KeycloakService) { }

    validateTokenUser(jwt: string): Observable<boolean> {
        return this.keycloakService.validateTokenUser(jwt);
    }

    validateTokenAdmin(jwt: string): Observable<boolean> {
        return this.keycloakService.validateTokenAdmin(jwt);
    }

    signInAdmin(object: SignInDto): Observable<any> {
        return this.keycloakService.signInAdmin(object.login, object.password);
    }
}
