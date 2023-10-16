import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/auth.module';
import { ControllersModule } from '../../controllers/controllers.module';
import { ProvidersModule } from '../../providers/providers.module';
import { WebSocketBaseGateway } from './web-sockets.gateway';
import { WebSocketService } from './web-sockets.service';

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
                // tslint:disable-next-line:max-line-length
                uri: `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PWD)}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}`,
            }),
        }),
    ],
    providers: [
        WebSocketBaseGateway,
        WebSocketService,
    ],
    exports: [
        WebSocketBaseGateway,
        WebSocketService,
    ],
})
export class WebSocketsModule { }
