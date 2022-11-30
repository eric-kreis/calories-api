import { Request, Response } from 'express';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { NotFoundError } from '@prisma/client/runtime';

@Catch(NotFoundError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly _logger = new Logger('EXCEPTION');

  public catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.NOT_FOUND;

    const body = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    };

    response.status(status).json(body);
  }
}
