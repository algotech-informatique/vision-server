import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const monitor_url = process.env.MONITOR_URL ? process.env.MONITOR_URL : '';

@Injectable()
export class MonitorHead {
    constructor(private readonly httpService: HttpService) { }

    monitoring(urlSegments): Observable<any> {
        if (!monitor_url) {
            throw new NotFoundException('no monotring')
        }
        
        
        return this.httpService.get(`${monitor_url}/${urlSegments['0']}`).pipe(
            mergeMap((resHttp: AxiosResponse) => {
                return (resHttp && resHttp.data) ?
                    of(resHttp.data) : of(null);
            }),
        );
    }
}