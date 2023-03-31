import { Injectable } from '@nestjs/common';
import { PairDto, UserDto, WorkflowInstanceContextDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IdentityRequest, SettingsData } from '../../../interfaces';
import { SettingsDataService } from '../../@base/settings-data.service';

@Injectable()
export class WorkflowMessageService {

    messageSubject: PairDto[] = [];

    constructor(
        private settingsDataService: SettingsDataService,
    ) {
    }

    getIdentity(context: WorkflowInstanceContextDto): IdentityRequest {
        if (!context.user) {
            throw new Error(`context incorrect ${context}`);
        }
        return {
            customerKey: context.customerKey,
            groups: context.user.groups,
            login: context.user.username,
            sessionId: '',
        };
    }

    payload(context: WorkflowInstanceContextDto, payload?: any) {
        const data = { identity: this.getIdentity(context) };
        return payload ? _.assign(data, payload) : data;
    }

    getUser(): UserDto {
        return {
            customerKey: '',
            uuid: '4fe124fc-a723-4799-ab5e-e1dc5b9a3499',
            enabled: true,
            preferedLang: 'fr-FR',
            username: 'sadmin',
            groups: [
                'sadmin',
            ],
            email: 'commercial@mail.fr',
            firstName: 'Vision',
            lastName: 'Vision',
            following: [
            ],
            favorites: null,
        };
    }

    initializeContext(identity: IdentityRequest, contextType: string): Observable<WorkflowInstanceContextDto> {
        return this.settingsDataService.getContext().pipe(
            catchError((e) => {
                return throwError(() => new Error('error when initialize context workflow'));
            }),
            map((data: SettingsData) => {
                const context: WorkflowInstanceContextDto = {
                    customerKey: identity.customerKey,
                    jwt: null,
                    settings: data.settings,
                    user: this.getUser(),
                    apps: data.apps,
                    smartmodels: data.smartmodels,
                    glists: data.glists,
                    groups: data.groups,
                    type: contextType,
                    custom: {
                        indexes: {}
                    },
                };

                return context;
            }),
        );
    }
}