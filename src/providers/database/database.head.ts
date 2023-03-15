import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IdentityRequest } from '../../interfaces';
import { DatabaseService } from './database.service';

@Injectable()
export class DatabaseHead {
    constructor(
        private databaseService: DatabaseService,
    ) {
    }

    dbRequest(data: {
        identity: IdentityRequest,
        connection: any,
        request: string,
    }): Observable<any> {
        return this.databaseService.dbRequest(data.connection, data.request);
    }
}
