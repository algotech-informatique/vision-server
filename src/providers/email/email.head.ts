import { Injectable } from '@nestjs/common';
import { EMailDto } from '@algotech-ce/core';
import { EmailService } from './email.service';
import { IdentityRequest } from '../../interfaces';

@Injectable()
export class EmailHead {
    constructor(
        private readonly emailService: EmailService) { }

    sendEmailWithDto(data: { identity: IdentityRequest, email: EMailDto }) {
        return this.emailService.sendEmailWithDto(data.identity, data.email);
    }
}
