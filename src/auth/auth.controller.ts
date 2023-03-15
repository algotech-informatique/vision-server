import { Controller, Post, Body } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SignInDto } from '@algotech/core';
import { AuthHead, NatsService } from '../providers';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {

    constructor(private readonly authHead: AuthHead, private readonly nats: NatsService) { }

    @Post('signin')
    signInAdmin(@Body() object: SignInDto): Observable<any> {
        return this.nats.httpResult(
            this.authHead.signInAdmin(object));
    }

}
