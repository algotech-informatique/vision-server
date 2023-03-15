import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { NatsService } from '../providers';
import { IdentityRequest } from '../interfaces';
import { ActionCode, Identity } from '../common/@decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('store')
@ApiTags('Store')
export class StoreController {

    constructor(
        private readonly nats: NatsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ActionCode('C')
    create(@Identity() identity: IdentityRequest, @Body() payload): Observable<any> {
        if (identity) {
            process.emit('message', { cmd: 'socket.unicast', data: { cmd: 'store.send.article', payload, client: identity } }, null);
            return this.nats.httpResult(of(true));
        } else {
            return this.nats.httpResult(of(false));
        }
    }

}
