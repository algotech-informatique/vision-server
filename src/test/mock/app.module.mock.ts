import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { ControllersModule } from '../../controllers/controllers.module';
import { ProvidersModule } from '../../providers/providers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditTrailInterceptor } from '../../common/@interceptors/audit-trail.interceptor';
import { serve } from 'swagger-ui-express';
import { WebSocketsModule } from '../../common/@websockets/web-sockets.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { InitService } from '../../providers';

@Module({
    imports: [
        HttpModule.register({
            timeout: 0,
            maxContentLength: Number.MAX_SAFE_INTEGER,
        }),
        ControllersModule,
        AuthModule,
        ProvidersModule,
        WebSocketsModule,
        MongooseModule.forRootAsync({
            useFactory: () => ({
                // tslint:disable-next-line:max-line-length
                uri: `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PWD)}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}`,
            }),
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        JwtAuthGuard,
        InitService,
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditTrailInterceptor,
        },
    ],
})
export class AppModuleMock {
    configure(consumer: MiddlewareConsumer) {
        // @ts-ignore because of "serve" middleware that is not resolved as a valid RequestHandler -> FIXME find out why, even if it's working like this
        consumer.apply(serve).forRoutes('/doc');
    }
}
