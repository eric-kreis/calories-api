import { Request, Response } from 'express';
import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly _logger = new Logger('EXCEPTION');

  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const body = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      reasons: [],
    };

    if (status === HttpStatus.BAD_REQUEST) {
      body.reasons = (exception['response']['message'] as any);
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      body.message = HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];
      this._logger.log(exception);
    }

    response.status(status).json(body);
  }
}
