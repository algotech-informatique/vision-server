import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CountMetric } from "../interfaces";
import { MetricsHead, NatsService } from "../providers";
import { Observable } from "rxjs";
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { KcAdmin } from '../common/@decorators/kcadmin/kcadmin.decorator';

@Controller('metrics')
@ApiTags('Metrics')
export class MetricsController {
    constructor(
        private readonly nats: NatsService,
        private readonly metricsHead: MetricsHead
    ) { }

    @Get('/count/:type')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    getCountAll(
        @Param('type') type: string,
        @Query('deleted') deleted?: string,
        @Query('environment') appEnvironment?: 'web' | 'mobile' | undefined
    ): Observable<CountMetric> {
        return this.nats.httpResult(this.metricsHead.getCount(type, deleted === 'true', appEnvironment));
    }

    @Get('/count/:type/:customerKey')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    getCount(
        @Param('type') type: string,
        @Param('customerKey') customerKey: string,
        @Query('deleted') deleted?: string,
        @Query('environment') appEnvironment?: 'web' | 'mobile' | undefined
    ): Observable<CountMetric> {
        return this.nats.httpResult(this.metricsHead.getCount(type, deleted === 'true', appEnvironment, customerKey));
    }
}