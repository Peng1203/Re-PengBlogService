import { ApiResponseMessageEnum, StatusEnum } from '@/helper/enums';
import { AuditService } from '@/modules/audit/audit.service';
import { formatDate } from '@/utils/date.util';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly auditService: AuditService) {}

  catch(exception: HttpException & unknown, host: ArgumentsHost) {
    const exceptionRes = exception.getResponse() as any;
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const code = exceptionRes.code || status;
    Logger.error('触发 Http 异常过滤器 ----->', exceptionRes, exceptionRes.response, exception.message);

    this.auditService.createAuditRecord(req, res, StatusEnum.FALSE, 0, exceptionRes.msg, status);

    res.status(status).json({
      code,
      error: exception.message,
      path: req.url,
      method: req.method,
      message: exceptionRes.msg || ApiResponseMessageEnum[exceptionRes.code],
      timestamp: formatDate(),
    });
  }
}
