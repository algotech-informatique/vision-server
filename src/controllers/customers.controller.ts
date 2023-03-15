import { Controller, Get, Post, Put, UseGuards, Body, Param, Delete, UnauthorizedException, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Observable } from 'rxjs';
import { CustomerDto, PatchPropertyDto } from '@algotech/core';
import { ActionCode, Identity } from '../common/@decorators';
import { NatsService, CustomerHead } from '../providers';
import { Customer, IdentityRequest } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';

@Controller('customers')
@ApiTags('Customers')
export class CustomersController {
    constructor(
        private customerHead: CustomerHead,
        private readonly nats: NatsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findAll(@Identity() identity: IdentityRequest): Observable<CustomerDto[]> {
        return this.nats.httpResult(this.customerHead.findAll({ identity }), CustomerDto);
    }

    @Get('self')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    getByCustomerKey(@Identity() identity: IdentityRequest): Observable<CustomerDto> {
        return this.nats.httpResult(this.customerHead.findByCustomerKey({ identity }), CustomerDto);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findOneByUuid(@Identity() identity: IdentityRequest, @Param('uuid') uuid: string): Observable<CustomerDto | {}> {
        return this.nats.httpResult(this.customerHead.findOneByUuid({ identity, uuid }), CustomerDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['sadmin', 'admin'])
    create(@Identity() identity: IdentityRequest, @Body() customer: CustomerDto): Observable<CustomerDto> {
        return this.nats.httpResult(this.customerHead.create({ identity, customer: customer as Customer }), CustomerDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['sadmin', 'admin'])
    update(@Identity() identity: IdentityRequest, @Body() customer: CustomerDto) {
        return this.nats.httpResult(this.customerHead.update({ identity, customer: customer as Customer }), CustomerDto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['sadmin', 'admin'])
    delete(@Identity() identity: IdentityRequest, @Body() data: { uuid: string }): Observable<boolean> {
        return this.nats.httpResult(this.customerHead.delete({ identity, uuid: data.uuid }));
    }

    @Get('licence/get')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    @Roles(['sadmin', 'admin'])
    getLicence(@Identity() identity: IdentityRequest): Observable<any> {
        return this.nats.httpResult(this.customerHead.getLicence({ identity }));
    }

    @Post('licence')
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['sadmin', 'admin'])
    setLicence(@Identity() identity: IdentityRequest, @Body() payload: { desktop: number; mobile: number; space: number }): Observable<any> {
        return this.nats.httpResult(this.customerHead.setLicence({ identity, payload }));
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @Roles(['sadmin', 'admin'])
    patchCustomer(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() patches: PatchPropertyDto[]): Observable<any> {
        return this.nats.httpResult(this.customerHead.patchCustomer({ identity, uuid, patches }));
    }

}