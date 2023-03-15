import { MailerModule, PugAdapter } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { InitService } from './providers';
import { ProvidersModule } from './providers/providers.module';

@Module({
    imports: [
        HttpModule.register({
            timeout: 0,
            maxContentLength: Number.MAX_SAFE_INTEGER,
        }),
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
    providers: [
        InitService,
    ]
})
export class BackModule { }
