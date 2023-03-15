import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LokiLogger extends ConsoleLogger {

    public trace(type: string, payload: any) {
        process.stdout.write(JSON.stringify(Object.assign({ msec: Date.now(), log_type: type }, payload)) + '\n');
    }

}