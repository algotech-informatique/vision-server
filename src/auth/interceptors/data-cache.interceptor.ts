import {
    NestInterceptor, ExecutionContext, CallHandler, Injectable, HttpException, HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class DataCacheInterceptor implements NestInterceptor {

    constructor() { }

    private isUpToDate(baseDate: string, dataDate: string) {
        return new Date(baseDate).getTime() >= new Date(dataDate).getTime();
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const date = context.getArgs()[0].query.date;

        return next.handle()
            .pipe(
                map((handlerData) => {
                    if (!date) {
                        return handlerData;
                    }

                    if (Array.isArray(handlerData)) {
                        return _.reduce(handlerData, (objects, object) => {
                            if (!this.isUpToDate(date, object.updateDate)) {
                                objects.push(object);
                            }
                            return objects;
                        }, []);
                    } else {
                        if (this.isUpToDate(date, handlerData.updateDate)) {
                            throw new HttpException({
                                status: HttpStatus.NOT_MODIFIED,
                            }, 304);
                        } else {
                            return handlerData;
                        }
                    }
                }),
            );
    }

}
