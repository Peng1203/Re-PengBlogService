import { formatDate } from '@/utils/date.util';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException & unknown, host: ArgumentsHost) {
    const exceptionRes = exception.getResponse() as any
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    console.log('触发 Http 异常过滤器 ----->', exceptionRes.response, exception.message)

    res.status(status).json({
      code: status,
      error: exceptionRes!.error,
      path: req.url,
      method: req.method,
      message: exception.message,
      timestamp: formatDate(),
    });
  }
}
