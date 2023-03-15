import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, OpenAPIObject } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Identity } from './common/@decorators';
import { generateHTML } from 'swagger-ui-express';
import { OpenAPIGeneratorService } from './providers';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from './auth/guards/jwt-auth-guard';
import { IdentityRequest } from './interfaces';
import { Roles } from './common/@decorators/roles/roles.decorator';
import { map } from 'rxjs/operators';

@Controller()
@ApiTags('Index')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly openApiGeneratorService: OpenAPIGeneratorService
    ) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('live')
    apiAlive(): boolean {
        return this.appService.isAlive();
    }

    @Get('ready')
    apiReady(): Observable<boolean> {
        return this.appService.isReady();
    }

    @Get('documentation')
    @UseGuards(JwtAuthGuard)
    @Roles(['sadmin', 'doc'])
    documentation(@Identity() identity: IdentityRequest) {
        return this.openApiGeneratorService
            .generateSmartflowsDocumentation(identity)
            .pipe(
                map((doc: OpenAPIObject) => {
                    return generateHTML(doc);
                })
            );
    }
}
