import { ATHttpException, InterpretorTaskDto, TaskUtils, NgComponentError } from '@algotech-ce/interpretor';
import { Injectable } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { throwError } from 'rxjs';
@Injectable()
export class TaskUtilsService extends TaskUtils {

    public handleHttpError(e: ATHttpException, task: InterpretorTaskDto, clsError: ClassConstructor<NgComponentError>) {
        const errData = this._getErrorData(task);
        if (!errData) {
            return throwError(() => new clsError('ERR-152', `${e.url}\n${e.error ? e.error : e.message ? e.message : ''}`));
        }

        return super.handleHttpError(e, task, clsError);
    }
}