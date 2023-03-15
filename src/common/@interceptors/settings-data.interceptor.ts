import {
    NestInterceptor, ExecutionContext, CallHandler, Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { SettingsDataService } from '../../providers';
const cluster = require('cluster');
@Injectable()
export class SettingsDataInterceptor implements NestInterceptor {

    constructor(
        private settingsDataService: SettingsDataService
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = Date.now();
        return next.handle()
            .pipe(
                tap((handlerData) => this.handle({ context, handlerData, start }))
            );
    }

    private handle(data: { context, handlerData?, err?, start }) {
        const method = data.context.getArgByIndex(0).method;
        if (_.isString(method) && ['POST', 'PATCH', 'PUT'].includes(method.toUpperCase())) {
            
            if (cluster.isWorker) {
                process.emit('message', { cmd: 'clear-data-cache' }, this);
            }
        }
    }
}
