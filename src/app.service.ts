import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Observable, of, zip } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { KeycloakService } from './providers/admin/keycloak.service';

const es_url = process.env.ES_URL ? process.env.ES_URL : false;
@Injectable()
export class AppService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        protected http: HttpService,
        private keycloakService: KeycloakService) { }

    getHello(): string {
        return 'Hello World!';
    }

    isAlive(): boolean {
        return true;
    }

    isReady(): Observable<boolean> {
        let  $eslatic = of(true);
        if (es_url) {
            const headers = { 'Content-Type': 'application/json' };
            const url: string = `${es_url}/_cluster/health?pretty`;
            $eslatic = this.http.get(url).pipe(
                catchError(() => of({ data: { status: 'red' } })),
                mergeMap((ealticHeath) => {
                    return of(ealticHeath.data.status !== 'red');
                }));
        }
        return zip($eslatic, this.keycloakService.checkKeyCloak()).pipe(
            mergeMap(data => {
                return of(data[0] && data[1] && this.connection.readyState === 1);
            }) 
        ) 
    }

}
