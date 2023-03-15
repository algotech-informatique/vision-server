import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // TODO : SendTree

        // Si l'exception est une instance de HttpException, renvoi l'exception telle quelle
        if (exception instanceof HttpException) {
            response
                .status(exception.getStatus())
                .json(
                    exception.getResponse(),
                );
        }
        // Si l'exception est une exception classique, renvoi une erreur 500 avec le message  de l'exception
        else {
            response
                .status(500)
                .json(
                    {
                        statusCode: 500,
                        error: 'Internal server error',
                        message: exception.message,
                    },
                );
        }
    }
}