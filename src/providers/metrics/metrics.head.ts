import { Injectable } from "@nestjs/common";
import { CountMetric } from "../../interfaces";
import { Observable } from "rxjs";
import { MetricsService } from "./metrics.service";

@Injectable()
export class MetricsHead {
    constructor(private readonly metricsService: MetricsService) { }

    getCount(
        type: string, 
        deleted: boolean, 
        appEnvironment?: 'web' | 'mobile' | undefined, 
        customerKey?: string
    ): Observable<CountMetric> {
        return this.metricsService.getCount(type, deleted, appEnvironment, customerKey);
    }
}