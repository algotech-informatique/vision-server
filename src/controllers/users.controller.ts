import { Controller, Param, Body, Get, Post, Delete, Put, Patch, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AssignPasswordDto } from '@algotech-ce/core';
import { UserDto } from '@algotech-ce/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { NatsService, UsersHead } from '../providers';
import { ActionCode, Identity } from '../common/@decorators';
import { IdentityRequest } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private usersHead: UsersHead, private readonly nats: NatsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findAll(@Identity() identity: IdentityRequest): Observable<UserDto[]> {
        return this.nats.httpResult(this.usersHead.find({ identity }), UserDto);
    }

    @Get(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findOne(@Identity() identity: IdentityRequest, @Param('uuid') uuid): Observable<UserDto> {
        return this.nats.httpResult(this.usersHead.find({ identity, uuid }), UserDto);
    }

    @Get('login/:username')
    @UseGuards(JwtAuthGuard)
    @ActionCode('R')
    findOneByLogin(@Identity() identity: IdentityRequest, @Param('username') username): Observable<UserDto> {
        return this.nats.httpResult(this.usersHead.find({ identity, username }), UserDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    create(@Identity() identity: IdentityRequest, @Body() user: UserDto, @Query('ignoreEmail') ignoreEmail): Observable<UserDto> {
        return this.nats.httpResult(this.usersHead.create({ identity, user: user as any, ignoreEmail: ignoreEmail === 'true' }), UserDto);
    }

    @Put('')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    update(@Identity() identity: IdentityRequest, @Body() updateUserDto: UserDto) {
        return this.nats.httpResult(this.usersHead.update({ identity, updateUserDto: updateUserDto as any }), UserDto);
    }

    @Patch(':uuid')
    @UseGuards(JwtAuthGuard)
    @ActionCode('U')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    updatePart(@Identity() identity: IdentityRequest, @Param('uuid') uuid, @Body() partUser) {
        return this.nats.httpResult(this.usersHead.updatePart({ identity, uuid, user: partUser }), UserDto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ActionCode('D')
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    delete(@Identity() identity: IdentityRequest, @Body() data): Observable<boolean> {
        return this.nats.httpResult(this.usersHead.delete({ identity, uuid: data.uuid }));
    }

    @Post('assignMobileToken')
    @UseGuards(JwtAuthGuard)
    @ActionCode('')
    assignMobileToken(@Identity() identity: IdentityRequest, @Body() data: { uuid: string, mobileToken: string }): Observable<boolean> {
        return this.nats.httpResult(this.usersHead.assignMobileToken(identity.customerKey, data.uuid, data.mobileToken));
    }

    @Post('removeMobileToken')
    @UseGuards(JwtAuthGuard)
    @ActionCode('')
    removeMobileToken(@Identity() identity: IdentityRequest, @Body() data: { uuid: string }): Observable<boolean> {
        return this.nats.httpResult(this.usersHead.removeMobileToken({ identity, uuid: data.uuid }));
    }

}
