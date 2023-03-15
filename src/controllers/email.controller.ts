import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { EMailDto } from '@algotech/core';
import { ActionCode, Identity } from '../common/@decorators';
import { NatsService, EmailHead } from '../providers';
import { IdentityRequest } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';

@Controller('email')
@ApiTags('Email')
export class EmailController {
    constructor(
        private emailHead: EmailHead,
        private readonly nats: NatsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('E')
    sendEmail(@Identity() identity: IdentityRequest, @Body() email: EMailDto): Observable<boolean> {
        return this.nats.httpResult(
            this.emailHead.sendEmailWithDto({ identity, email }),
        );
    }
}
