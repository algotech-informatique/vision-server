import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ManifestHead, NatsService } from '../providers';
import { ActionCode } from '../common/@decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('manifest')
@ApiTags('Manifest')
export class ManifestController {

    constructor(private manifestHead: ManifestHead, private readonly nats: NatsService) { }

    @Get()
    @ActionCode('R')
    findOne(): Observable<any> {
        return this.nats.httpResult(this.manifestHead.get(process.env.CUSTOMER_KEY ? process.env.CUSTOMER_KEY : 'vision'));
    }
}
