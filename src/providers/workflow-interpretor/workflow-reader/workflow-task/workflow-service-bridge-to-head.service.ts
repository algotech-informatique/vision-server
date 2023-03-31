import { Injectable } from '@nestjs/common';
import { WorkflowInstanceContextDto } from '@algotech-ce/core';
import { Observable, of, throwError } from 'rxjs';
import { SmartObjectsHead } from '../../../smart-objects/smart-objects.head';
import { WorkflowMessageService } from '../../workflow-message/workflow-message.service';
import { SmartFlowsHead } from '../../../smart-flows/smart-flows.head';
import { ModuleRef } from '@nestjs/core';
import { UsersHead } from '../../../users/users.head';
import { SearchHead } from '../../../search/search.head';

interface HeadResolveData {
    segment: string;
    urlParams: URLSearchParams;
    context: WorkflowInstanceContextDto;
    body: any;
}

@Injectable()
export class WorkflowServiceBridgeToHeadService {

    constructor(
        private moduleRef: ModuleRef,
        private workflowMessage: WorkflowMessageService,
    ) {
    }

    toHead(route: string, headers, body, type, context: WorkflowInstanceContextDto) {
        const config = [{
            baseUrl: '/smart-objects/model',
            resolve: (data: HeadResolveData) => this.smartObjectsModelDeprecated(data),
        }, {
            baseUrl: '/smart-objects/search',
            resolve: (data: HeadResolveData) => this.smartObjectsSearchDeprecated(data),
        }, {
            baseUrl: '/search/smart-objects',
            resolve: (data: HeadResolveData) => this.smartObjectsSearch(data),
        }, {
            baseUrl: '/smartflows/startsmartflows',
            resolve: (data: HeadResolveData) => this.startsmartflows(data),
        }, {
            baseUrl: '/users',
            resolve: (data: HeadResolveData) => this.users(data),
        }];

        const split = route.split('?');
        const urlParams = new URLSearchParams(split.length > 0 ? split[1] : route);

        const element = config.find((ele) => route.startsWith(ele.baseUrl));
        if (!element) {
            throw new Error('route not find : ' + route);
        }

        const segment = split[0].replace(`${element.baseUrl}/`, '');
        return new Observable((observer) => {
            // execute service
            let subscription;
            subscription = (element.resolve({ segment, urlParams, context, body }) as Observable<any>).subscribe((result: any) => {
                // next & complete
                observer.next(result);
                observer.complete();
            },
            (error) => {
                observer.error(error);
                observer.complete();
            },
            () => {
                // cut subscription finalize
                if (subscription) {
                    subscription.unsubscribe();
                }
            });
        });
    }

    // route model deprecated
    smartObjectsModelDeprecated(data: HeadResolveData) {
        return this.moduleRef.get(SmartObjectsHead).find({
            identity: this.workflowMessage.getIdentity(data.context),
            modelKey: data.segment,
            sort: data.urlParams.get('sort'),
            order: data.urlParams.get('order'),
            limit: +data.urlParams.get('limit'),
            skip: +data.urlParams.get('skip'),
        })
    }

    // route search deprecated
    smartObjectsSearchDeprecated(data: HeadResolveData) {
        return this.moduleRef.get(SmartObjectsHead).searchByModel({
            identity: this.workflowMessage.getIdentity(data.context),
            modelKey: data.segment,
            defaultOrder: data.urlParams.get('defaultOrder'),
            order: data.urlParams.get('order'),
            property: data.urlParams.get('property'),
            limit: +data.urlParams.get('limit'),
            skip: +data.urlParams.get('skip'),
            value: data.urlParams.get('value'),
        })
    }

    // route search
    smartObjectsSearch(data: HeadResolveData) {
        return this.moduleRef.get(SearchHead).searchSo(
            this.workflowMessage.getIdentity(data.context),
            +data.urlParams.get('skip'),
            +data.urlParams.get('limit'),
            data.urlParams.get('search'),
            data.body,
            false,
        );
    }

    // route startsmartflows
    startsmartflows(data: HeadResolveData) {
        return this.moduleRef.get(SmartFlowsHead).startSmartFlow({
            identity: this.workflowMessage.getIdentity(data.context),
            launchOptions: data.body,
        });
    }

    // route users
    users(data: HeadResolveData) {
        return this.moduleRef.get(UsersHead).find({
            identity: this.workflowMessage.getIdentity(data.context),
        });
    }
}
