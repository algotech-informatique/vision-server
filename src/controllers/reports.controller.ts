import { Controller, Get, UseGuards } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { NatsService } from '../providers';
import { IdentityRequest } from '../interfaces';
import { Identity } from '../common/@decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('reports')
@ApiTags('Reports')
export class ReportsController {
    constructor(private nats: NatsService) { }

    // TODO rm
    @Get()
    @UseGuards(JwtAuthGuard)
    listReports(@Identity() identity: IdentityRequest): Observable<string[]> {
        return this.nats.httpResult(of([]));
    }
}
