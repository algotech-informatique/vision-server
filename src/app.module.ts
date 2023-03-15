import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './controllers/controllers.module';
import { ProvidersModule } from './providers/providers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule, PugAdapter } from '@nest-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditTrailInterceptor } from './common/@interceptors/audit-trail.interceptor';
import { serve } from 'swagger-ui-express';
import { JwtAuthGuard } from './auth/guards/jwt-auth-guard';

@Module({
    imports: [
        HttpModule.register({
            timeout: 0,
            maxContentLength: Number.MAX_SAFE_INTEGER,
        }),
        ControllersModule,
        AuthModule,
        ProvidersModule,
        MailerModule.forRoot({
            transport: {
                service: 'ovh',
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            },
            template: {
                dir: './src/common/email-templates',
                adapter: new PugAdapter(), // or new PugAdapter()
                options: {
                    strict: true,
                },
            },
        }),
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
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditTrailInterceptor,
        }],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        // @ts-ignore because of "serve" middleware that is not resolved as a valid RequestHandler -> FIXME find out why, even if it's working like this
        consumer.apply(serve).forRoutes('/documentation');
    }
}
