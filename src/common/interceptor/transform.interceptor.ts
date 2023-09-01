import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { ApiResponseCodeEnum, ApiResponseMessageEnum } from '@/helper/enums';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse<Response>();
        const success = res.success ?? true;
        const code = res.apiResponseCode ?? ApiResponseCodeEnum.SUCCESS;
        // 当设置了响应头时 返回原始数据
        if (res.getHeader('Content-Type')) return data;
        return {
          code,
          success,
          message: ApiResponseMessageEnum[code],
          data,
        };
      }),
    );
  }
}
