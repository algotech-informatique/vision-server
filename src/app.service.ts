import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

const es_url = process.env.ES_URL ? process.env.ES_URL : 'http://ms-search:9200';
@Injectable()
export class AppService {
    constructor(@InjectConnection() private readonly connection: Connection,
        protected http: HttpService) { }

    getHello(): string {
        return 'Hello World!';
    }

    isAlive(): boolean {
        return true;
    }

    isReady(): Observable<boolean> {
        const headers = { 'Content-Type': 'application/json' };
        const url: string = `${es_url}/_cluster/health?pretty`;
        return this.http.get(url).pipe(
            catchError(() => of({ data: { status: 'red' } })),
            mergeMap((ealticHeath) => {
                return of(ealticHeath.data.status !== 'red' && this.connection.readyState === 1);
            }));
    }

}
