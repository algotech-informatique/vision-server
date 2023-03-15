import { Injectable } from '@nestjs/common';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class RxExtendService {
    sequence(arr: Observable<any>[], previous: Observable<any> = null, values: any[] = []): Observable<any[]> {
        if (arr.length === 0) {
            if (!previous) {
                return of([]);
            }
            return previous.pipe(map((ret) => {
                values.push(ret);
                return values;
            }));
        }
        const currentObs = arr.shift();
        if (previous) {
            return previous.pipe(mergeMap((ret: any) => {
                values.push(ret);
                return this.sequence(arr, currentObs, values);
            }));
        } else {
            return this.sequence(arr, currentObs, values);
        }
    }

    genericRetryStrategy(maxRetryAttempts = 3, scalingDuration = 1000, excludedStatusCodes = []) {
        return (attempts: Observable<any>) => {
            return attempts.pipe(
                mergeMap((error, i) => {
                    const retryAttempt = i + 1;
                    // if maximum number of retries have been met
                    // or response is a status code we don't wish to retry, throw error
                    if (
                        retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)
                    ) {
                        return throwError(() => error);
                    }
                    console.log(`Attempt ${retryAttempt}: retrying in ${scalingDuration}ms`);
                    // retry after 1s, 2s, etc...
                    return timer(scalingDuration);
                }),
            );
        };
    }
}
