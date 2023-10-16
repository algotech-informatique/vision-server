import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AnyExceptionFilter } from './providers/@base/any-exception.filter';
import { LokiLogger } from './providers/@base/loki-logger';
import * as os from 'os';
import { WebSocketsModule } from './common/@websockets/web-sockets.module';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { BackModule } from './back.module';
import { Worker } from 'cluster';
import { WorkerMessage } from './interfaces';
import cluster from 'node:cluster';

const cpus = os.cpus();
const workers: Worker[] = [];

async function bootstrap() {
    if (cluster.isPrimary) {
        // schedule tasks
        workers.push(
            cluster.fork({
                utility: 'schedule',
            }),
        );

        // socket
        workers.push(
            cluster.fork({
                utility: 'socket',
            }),
        );

        // // multi-core
        workers.push(
            ...cpus.map(() => {
                return cluster.fork({
                    utility: 'server',
                });
            }),
        );

        // receive from worker, emit to each workers
        workers.forEach((w) => {
            w.on('message', function (msg) {
                for (const child of workers) {
                    if (child !== w) {
                        child.process.send({
                            cmd: msg.cmd,
                            data: msg.data,
                            broadcast: true,
                        });
                    }
                }
            });
        })
    } else if (cluster.isWorker) {
        // receive from process, emit to master
        process.on('message', function (msg: WorkerMessage) {
            if (msg.cmd && !msg.broadcast) {
                process.send(msg);
            }
        });

        console.log(`Worker ${process.pid} started`);
        console.log('process', process.title, process.argv, process.execArgv, process.pid, process.ppid);
        console.log('process.env', process.env.utility);

        switch (process.env.utility) {
            case 'schedule':
                {
                    // schedule tasks
                    const app = await getApp(BackModule);
                    app.listen(3002);
                }
                break;
            case 'socket':
                {
                    // socket
                    const app = await getApp(WebSocketsModule);
                    app.useWebSocketAdapter(new WsAdapter(app));
                    app.listen(0);
                }
                break;
            default: {
                // multi-core
                const app = await getApp(AppModule);
                app.listen(3000);
            }
        }
    }
}

async function getApp(module) {
    const app = await NestFactory.create(module, { logger: ['verbose'] });
    app.useLogger(new LokiLogger());

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transformOptions: { ignoreDecorators: true } }));
    app.useGlobalFilters(new AnyExceptionFilter());
    app.use(bodyParser.json({ limit: '500mb' }));
    app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

    return app;
}

bootstrap();
