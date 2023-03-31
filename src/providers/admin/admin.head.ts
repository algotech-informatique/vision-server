import { CustomerInitDto, CustomerInitResultDto } from '@algotech-ce/core';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Customer, CustomerInit, CustomerInitResult, CustomerSearch } from '../../interfaces';
import { EnvironmentHead } from '../environment/environment.head';
import { GroupHead } from '../groups/groups.head';
import { SettingsHead } from '../settings/settings.head';
import { SmartNodesHead } from '../smart-nodes/smart-nodes.head';
import { AdminService } from './admin.service';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class AdminHead {
    constructor(
        private readonly environmentHead: EnvironmentHead,
        private readonly smartnodesHead: SmartNodesHead,
        private readonly groupHead: GroupHead,
        private readonly settingsHead: SettingsHead,
        private readonly adminService: AdminService,
        private readonly keycloakService: KeycloakService) { }

    findAllCustomers(data: { customerSearch: CustomerSearch }): Observable<Customer[]> {
        return this.adminService.listCustomer(data.customerSearch);
    }

    initCustomer(data: { customer: CustomerInit }): Observable<CustomerInitResult> {
        return this.adminService.initCustomer(data.customer);
    }

    initKeyCloak(data: { customer: CustomerInit }): Observable<CustomerInitResult> {
        return this.keycloakService.initKeyCloakRealm(data.customer);
    }

    deleteKeyCloakRealm(): Observable<any/* CustomerInitResult */> {
        return this.keycloakService.deleteKeyCloakRealm();
    }

    /* findAllUsers(data: { userSearch: UserSearch }): Observable<User[]> {
        return this.adminService.listUser( data.userSearch );
    } */

    initUser(data: { customer: CustomerInit, ignoreEmail: boolean }): Observable<CustomerInitResult> {
        return this.adminService.initUser(data.customer, false, data.ignoreEmail);
    }

    initsadminUser(data: { customer: CustomerInit, ignoreEmail: boolean }): Observable<CustomerInitResult> {
        return this.adminService.initUser(data.customer, true, data.ignoreEmail);
    }

    deleteESindexAndPipeline(customerKey: string): Observable<CustomerInitResultDto[]> {
        return this.adminService.deleteESindexAndPipeline(customerKey);
    }

    initDataBase(customer: CustomerInitDto, keycloakOnly: boolean, ignoreEmail: boolean): Observable<CustomerInitResultDto[]> {
        const cmds$ = [
            this.initKeyCloak({ customer }),
            this.groupHead.init({ customer }),
            this.initsadminUser({ customer, ignoreEmail }),
        ];

        if (!keycloakOnly) {
            cmds$.push(
                this.initCustomer({ customer }),
                this.settingsHead.init({ customer }),
                this.environmentHead.init({ customer }),
                this.smartnodesHead.init({ customer }),
            );
        }

        return this.adminService.initDataBase(customer, cmds$, keycloakOnly);
    }

    resetESPipelineAndTempates(customer: CustomerInitDto): Observable<CustomerInitResultDto[]> {
        return this.adminService.resetESPipelineAndTempates(customer);
    }

    resetdocIndex(customer: CustomerInitDto): Observable<CustomerInitResultDto[]> {
        return this.adminService.resetdocIndex(customer);
    }
}