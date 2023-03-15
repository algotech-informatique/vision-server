import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { DatabaseHead, NatsService } from '../providers';
import { IdentityRequest } from '../interfaces';
import { Identity } from '../common/@decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('database')
@ApiTags('Database')
export class DatabaseController {
    constructor(
        private readonly databaseHead: DatabaseHead,
        private readonly nats: NatsService) { }

    @Post('')
    @UseGuards(JwtAuthGuard)
    dbRequest(@Identity() identity: IdentityRequest, @Body() data: { connection: any, request: string }): Observable<any> {
        return this.nats.httpResult(
            this.databaseHead.dbRequest({ identity, connection: data.connection, request: data.request }),
        );
    }
}
