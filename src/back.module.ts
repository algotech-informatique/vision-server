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
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PWD)}@${
                    process.env.MONGO_HOST
                }/${process.env.MONGO_DB}`,
            }),
        }),
    ],
    providers: [InitService],
})
export class BackModule {}
