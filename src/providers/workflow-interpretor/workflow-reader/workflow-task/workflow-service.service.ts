import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ServiceReturnModelDto } from '@algotech-ce/core';
import { SmartObjectDto, PairDto, WorkflowInstanceContextDto } from '@algotech-ce/core';
import { Observable, throwError } from 'rxjs';
import { InterpretorFormData, InterpretorService } from '@algotech-ce/interpretor';
import { map, catchError } from 'rxjs/operators';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { WorkflowServiceBridgeToHeadService } from './workflow-service-bridge-to-head.service';
import { ATHttpException } from '@algotech-ce/interpretor';

@Injectable()
export class WorkflowServiceService extends InterpretorService {

    constructor(
        private workflowServiceBridgeToHeadService: WorkflowServiceBridgeToHeadService,
        protected http: HttpService,
    ) {
        super();
        this.api = '';
    }

    serviceConnection(route: string, headers: any, body: any, type: string, responseType: 'blob' | 'json' = 'json'): Observable<any> {
        let obs: Observable<any> = null;
        const config: AxiosRequestConfig = {
            headers,
            responseType: responseType === 'blob' ? 'arraybuffer' : 'json'
        }

        switch (type) {
            case 'GET':
                obs = this.http.get<any>(route, config);
                break;
            case 'POST':
                obs = this.http.post<any>(route, body, config);
                break;
            case 'PUT':
                obs = this.http.put<any>(route, body, config);
                break;
            case 'PATCH':
                obs = this.http.patch<any>(route, body, config);
                break;
            case 'DELETE': {
                const options = config;
                if (body) {
                    const elementBody = 'body';
                    options[elementBody] = body;
                }
                obs = this.http.delete<any>(route, options);
                break;
            }
        }
        return obs;
    }

    call(url: string, headers: PairDto[], body: InterpretorFormData,
        type: 'get' | 'patch' | 'post' | 'put' | 'delete' | 'update',
        responseType: 'blob' | 'json' = 'json', handleError = true): Observable<any> {

        const bodyData = this._createCallBody(body, headers);
        const heads = this.getHeadersCall(headers);        
        if (body.type === 'formData') {
            const formDataHead = (bodyData as any).getHeaders();
            Object.keys(formDataHead).forEach((key: string) => {
                heads[key] = formDataHead[key];
            });
            heads['Content-Length'] = (bodyData as any).getLengthSync();
        }

        const obs = this.serviceConnection(url, heads, bodyData, type.toUpperCase(), responseType);
        return obs.pipe(
            map((res: AxiosResponse) => {
                if (responseType !== 'blob') {
                    return { headers: res.headers, body: res.data }
                }
                return this.responseBlob(res);
            }),
            catchError((e) => {
                if (e.response) {
                    if (handleError) {
                        return throwError(() => new ATHttpException(url, e.response.status, e.response.data, e.response.statusText));
                    }
                    return throwError(() => new HttpException(e.response.data, e.response.status));
                }
                return throwError(() => e);
            }),
        );
    }

    responseBlob(serviceResult: AxiosResponse) {
        const disposition = serviceResult.headers['content-disposition'];
        const mimeType = serviceResult.headers['content-type'];

        let fileName: string = disposition.split('=').pop();
        fileName = fileName.replace(/"/g, '');

        return {
            fileName,
            mimeType,
            data: serviceResult.data,
        };
    }

    _createCallBody(body: InterpretorFormData, headers: PairDto[]): any {
        if (body.type === 'formData') {
            const FormData = require('form-data');
            const formData = new FormData();

            for (const element of body.data) {
                if (element.fileName) {
                    formData.append(element.key, element.value, element.fileName);
                } else {
                    formData.append(element.key, element.value);
                }
            }
            return formData;
        }

        const urlencoded: boolean = !!headers.find((h: PairDto) =>
            h.key.trim().toLowerCase() === 'content-type'
            && h.value.trim().toLowerCase() === 'application/x-www-form-urlencoded');

        if (urlencoded) {
            let bodyParams: URLSearchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(body.data as PairDto)) {
                bodyParams.set(key, value);
            }
            return bodyParams;
        }
        return body.data;
    }

    callATService(route: string, body: object, type: string, typeReturn: ServiceReturnModelDto, smartObjects: SmartObjectDto[],
        context: WorkflowInstanceContextDto): Observable<any> {

        const headers = this.getHeaders(context);
        const obs: Observable<any> = this.workflowServiceBridgeToHeadService.toHead(route, headers, body, type, context);
        return obs.pipe(
            map((res: any) => {
                return this.mergeSmartObjectWithLocalData(res, typeReturn, smartObjects);
            }),
        );
    }

    protected getHeaders(context: WorkflowInstanceContextDto): any {
        return {
            'Accept': 'application/json', // afaik this one is not needed
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.jwt}`,
        };
    }

    protected getHeadersCall(headers: PairDto[]): any {
        const obj: any = {};
        for (const element of headers) {
            obj[element.key] = element.value;
        }
        return obj;
    }
}
