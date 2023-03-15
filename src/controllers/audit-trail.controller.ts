import { Controller, Post, UseGuards, Body, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Observable } from 'rxjs';
import { Parser } from 'json2csv';
import { map } from 'rxjs/operators';
import { AuditTrailHead, NatsService } from '../providers';
import { Identity } from '../common/@decorators';
import { IdentityRequest } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/@decorators/roles/roles.decorator';

@Controller('audit-trail')
@ApiTags('Audit Trail')
export class AuditTrailController {
    constructor(
        public auditTrailHead: AuditTrailHead,
        private nats: NatsService
    ) { }

    @Post('generate')
    @UseGuards(JwtAuthGuard)
    @Roles(['admin', 'sadmin', 'plan-editor', 'process-manager'])
    generate(@Identity() identity: IdentityRequest, @Res() res, @Body() data: { dateBegin: string, dateEnd: string }): Observable<any> {
        return this.nats.httpResult(this.auditTrailHead.getLogs(data.dateBegin, data.dateEnd, identity).pipe(
            map((logs) => {
                const fields = [
                    'eventId',
                    'eventActionCode',
                    'eventDate',
                    'httpStatusCode',
                    'userId',
                    'customerKey',
                    'networkAccessPoint',
                    'objectUuid',
                    'objectTypeCode',
                    'objectModelKey',
                ];
                const parser = new Parser({ fields });
                const csv = parser.parse(logs);

                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename="logs.csv"`);
                res.send(csv);
            }),
        ));
    }
}