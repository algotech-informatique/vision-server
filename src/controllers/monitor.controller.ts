import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MonitorHead, NatsService } from '../providers';
import { Observable } from 'rxjs';
import { KcAdmin } from '../common/@decorators/kcadmin/kcadmin.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';



@Controller('monitor')
@ApiTags('monitor')
export class MonitorController {

    constructor(
        private monitor: MonitorHead,
        private nats: NatsService
    ) { }


    @Get('*')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    getHealth(
        @Param() urlSegments): Observable<any> {
         return this.nats.httpResult(this.monitor.monitoring(urlSegments));
    }
}