import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError, mapAppErrorToHttp } from '../../../shared/errors';
import { HEADERS } from '../../../shared/constants';

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const mapped = mapAppErrorToHttp(exception);
    const requestId = req.header(HEADERS.REQUEST_ID);

    res.status(mapped.statusCode).json({
      statusCode: mapped.statusCode,
      code: mapped.code,
      message: mapped.message,
      details: mapped.details,
      path: req.url,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
