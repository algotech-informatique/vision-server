import { Controller, Post, Body, BadRequestException, Get, Query, Logger, Delete, UseGuards } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { CustomerDto, CustomerSearchDto, CustomerInitDto, CustomerInitResultDto } from '@algotech/core';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { AdminHead, DocumentsHead, NatsService, UtilsService } from '../providers';
import { Customer, IdentityRequest } from '../interfaces';
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
        private readonly utils: UtilsService,
    ) { }

    @Get('information')
    information(): Observable<any> {
        return of({
            date: new Date().toISOString(),
        });
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
    initCustomer(@Body() customer/* : CustomerInitDto */, @Query('keycloakOnly') keycloakOnly,
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

        let data = { identity };
        data = soUuid ? Object.assign(data, { soUuid }) : data;
        data = fileId ? Object.assign(data, { fileId }) : data;
        data = docUuid ? Object.assign(data, { docUuid }) : data;
        data = start ? Object.assign(data, { start }) : data;
        data = end ? Object.assign(data, { end }) : data;
        data = max ? Object.assign(data, { max: parseInt(max, 10) }) : data;

        const customer: CustomerInitDto = {
            customerKey: identity.customerKey, name: '', email: '', languages: [], licenceKey: '', login: '', password: '',
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
}