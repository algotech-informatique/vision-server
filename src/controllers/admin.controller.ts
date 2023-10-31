import { Controller, Post, Body, BadRequestException, Get, Query, Logger, Delete, UseGuards } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { CustomerDto, CustomerSearchDto, CustomerInitDto, CustomerInitResultDto, InformationDto } from '@algotech-ce/core';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AdminHead, CustomerHead, DocumentsHead, NatsService, UtilsService } from '../providers';
import { Customer, CustomerInit, IdentityRequest } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';
import { Identity } from '../common/@decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { KcAdmin } from '../common/@decorators/kcadmin/kcadmin.decorator';


@Controller('admin')
@ApiTags('Admin')
export class AdminController {

    constructor(
        private readonly nats: NatsService,
        private readonly documentsHead: DocumentsHead,
        private readonly adminHead: AdminHead,
        private readonly customerHead: CustomerHead,
        private readonly utils: UtilsService,
    ) { }

    @Get('information')
    information(): Observable<InformationDto> {
        return this.customerHead.find().pipe(
            map((customer) => {
                const info: InformationDto = {
                    date: new Date().toISOString(),
                };
                if (customer.restoreId) {
                    info.restoreId = customer.restoreId;
                }
                if (customer.version) {
                    info.version = customer.version;
                }
                return info;
            })
        );
    }

    @Post('customers')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    findCustomers(@Body() customerSearch: CustomerSearchDto): Observable<CustomerDto[]> {
        console.log('customerSearch : ', customerSearch);
        return this.nats.httpResult(this.adminHead.findAllCustomers({ customerSearch }), CustomerDto);
    }

    @Delete('customers/delete/es')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    deleteESindexAndPipiline(@Query('customerKey') customerKey: string): Observable<CustomerInitResultDto[]> {
        return this.nats.httpResult(this.adminHead.deleteESindexAndPipeline(customerKey));
    }

    @Delete('customers/delete/kc')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    deleteKeyCloakRealm(): Observable<CustomerInitResultDto[]> {
        return this.nats.httpResult(this.adminHead.deleteKeyCloakRealm());
    }

    @Post('customers/init')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    initCustomer(@Body() customer: CustomerInit, @Query('keycloakOnly') keycloakOnly,
        @Query('ignoreEmail') ignoreEmail): Observable<any/* CustomerInitResultDto[] */> {
        const customerSearch: CustomerSearchDto = { customerKey: [] };
        customerSearch.customerKey.push(customer.customerKey);
        return this.nats.httpResult(
            this.adminHead.findAllCustomers({ customerSearch }).pipe(
                mergeMap((customers: Customer[]) => {
                    return of(customers.length === 0);
                }),
                mergeMap((init: boolean) => {
                    Logger.log(init, 'init');

                    if (init === true || this.utils.strToBool(keycloakOnly)) {
                        return this.adminHead.initDataBase(customer, this.utils.strToBool(keycloakOnly), this.utils.strToBool(ignoreEmail)).pipe(
                            catchError((err) => {
                                return throwError(() => new BadRequestException('customer init failed'));
                            }),
                        );
                    } else {
                        return throwError(() => new BadRequestException('customer already set up'));
                    }
                })),
        );
    }

    @Get(':customerKey/indexation')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    indexation(
        @Identity() identity: IdentityRequest,
        @Query('soUuid') soUuid?: string,
        @Query('fileId') fileId?: string,
        @Query('docUuid') docUuid?: string,
        @Query('start') start?: string,
        @Query('end') end?: string,
        @Query('max') max?: string): Observable<any> {

        if (!process.env.ES_URL) {
            return of(false)
        }

        let data = { identity };
        data = soUuid ? Object.assign(data, { soUuid }) : data;
        data = fileId ? Object.assign(data, { fileId }) : data;
        data = docUuid ? Object.assign(data, { docUuid }) : data;
        data = start ? Object.assign(data, { start }) : data;
        data = end ? Object.assign(data, { end }) : data;
        data = max ? Object.assign(data, { max: parseInt(max, 10) }) : data;

        const customer: CustomerInit = {
            customerKey: identity.customerKey, firstName: '', lastName: '', email: '', languages: [], login: '', password: '', defaultapplications: []
        };
        if (soUuid || fileId || docUuid) {
            return this.nats.httpResult(this.documentsHead.indexation(data).pipe(
                tap(() => console.log('----End of Indexation----')),
            ));
        }

        return this.nats.httpResult(
            this.adminHead.resetdocIndex(customer).pipe(
                mergeMap((res) => this.documentsHead.indexation(data).pipe(
                    tap(() => console.log('----End of Indexation----')),
                )),
            ),
        );
    }

    @Post('restore')
    @UseGuards(JwtAuthGuard)
    @KcAdmin()
    restore(@Identity() identity: IdentityRequest): Observable<boolean> {
        return this.adminHead.applyRestore().pipe(
            mergeMap(() => {
                const customer: CustomerInitDto = {
                    customerKey: process.env.CUSTOMER_KEY, name: '', email: '', languages: [], licenceKey: '', login: '', password: '',
                };
                return this.adminHead.resetdocIndex(customer).pipe(
                    mergeMap(() => this.documentsHead.indexation({ identity }).pipe(
                        tap(() => console.log('----End of Indexation----')),
                    )),
                );
            }),
        );
    }
}