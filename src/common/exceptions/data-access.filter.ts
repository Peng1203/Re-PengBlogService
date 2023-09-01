import { ServerError } from '@/common/errors/server.error';
import { ApiResponseMessageEnum } from '@/helper/enums';
import { formatDate } from '@/utils/date.util';
import { ArgumentsHost, Catch, ExceptionFilter, InternalServerErrorException, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
// 处理 TypeORM 抛出错误
@Catch(InternalServerErrorException)
export class DataAccessFilter implements ExceptionFilter {
  catch(exception: HttpException & ServerError, host: ArgumentsHost) {
    // const [req, res, next]: [Request, Response, Function] = host.getArgs();
    const exceptionRes = exception.getResponse() as any;
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let reason = '';
    // 当没有传入响应信息是 使用通用错误信息返回
    switch (exception.errCode) {
      case 'ER_DUP_ENTRY':
        reason = '该记录已经存在。';
        break;
      case 'ER_NO_REFERENCED_ROW':
        reason = '无法找到关联的父级记录。';
        break;
      case 'ER_ROW_IS_REFERENCED':
        reason = '操作被其他记录引用，无法执行删除或更新操作。';
        break;
      case 'ER_NO_DEFAULT_FOR_FIELD':
        reason = '必需的字段缺少值。';
        break;
    }

    console.log('触发 DAO层 异常过滤器 ----->', exceptionRes.e, exception.message);

    // 写入错误的logger日志

    res.status(status).json({
      code: exceptionRes.code || status,
      path: req.url,
      error: exception.message,
      methods: req.method,
      message: exceptionRes.msg,
      timestamp: formatDate(),
    });
  }
}
