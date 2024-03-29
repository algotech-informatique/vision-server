import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './controllers/controllers.module';
import { ProvidersModule } from './providers/providers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditTrailInterceptor } from './common/@interceptors/audit-trail.interceptor';
import { serve } from 'swagger-ui-express';
import { JwtAuthGuard } from './auth/guards/jwt-auth-guard';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        HttpModule.register({
            timeout: 0,
            maxContentLength: Number.MAX_SAFE_INTEGER,
        }),
        ControllersModule,
        AuthModule,
        ProvidersModule,
        MongooseModule.forRootAsync({
            useFactory: () => ({
                // tslint:disable-next-line:max-line-length
                uri: `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PWD)}@${
                    process.env.MONGO_HOST
                }/${process.env.MONGO_DB}`,
            }),
        }),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT,
            },
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        JwtAuthGuard,
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditTrailInterceptor,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        // @ts-ignore because of "serve" middleware that is not resolved as a valid RequestHandler -> FIXME find out why, even if it's working like this
        consumer.apply(serve).forRoutes('/documentation');
    }
}
