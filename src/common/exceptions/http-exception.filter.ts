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
    let msg = '';
    switch (exception.message) {
      case 'File too large':
        msg = '上传文件过大';
        break;
      case 'Too many files':
        msg = '文件数量过多';
        break;
      default:
        msg = exception.message;
        break;
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const defalueResponse = exception.getResponse() as any;

    res.status(status).json({
      code: status,
      error: defalueResponse!.error,
      path: req.url,
      method: req.method,
      message: msg,
      timestamp: formatDate(),
    });
  }
}
