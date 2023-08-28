import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();
        // 当设置了响应头时 返回原始数据
        if (response.getHeader('Content-Type')) return data;
        return {
          code: response.statusCode,
          message: response.resMsg ?? 'Success',
          data,
        };
      }),
    );
  }
}
