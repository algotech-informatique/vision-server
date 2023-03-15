import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProvidersModule } from '../providers/providers.module';
import { AuthorizationService } from './services/authorization.service';

@Module({
    imports: [
        ProvidersModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthorizationService,
    ],
    exports: [
        AuthorizationService,
    ],
})
export class AuthModule { }
