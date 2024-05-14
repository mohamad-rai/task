import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const isProduction =
      this.configService.get<string>('PRODUCTION_MODE') === 'true';

    console.error(`Exception: ${exception.message}, status: ${status}`);
    console.error(exception.stack);

    response.status(status === 500 ? HttpStatus.BAD_REQUEST : status).json(
      isProduction
        ? {
            statusCode: 400,
            message:
              'Something went wrong, please try again later or call Mr.Ahmadi 🤷‍♂️',
          }
        : {
            statusCode: status,
            message: exception.message,
          },
    );
  }
}
