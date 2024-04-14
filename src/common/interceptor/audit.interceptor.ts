import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { Request, Response } from 'express';
import { AuditService } from '@/modules/audit/audit.service';
import { StatusEnum } from '@/helper/enums';
import { IS_PUBLIC_KEY } from '@/common/decorators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector, private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // console.log('isPublic ------', isPublic);

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    if (req.path.includes('login')) return next.handle();

    const requestTime = Date.now();
    return next.handle().pipe(
      tap(data => {
        const responseTime = Date.now();

        this.auditService.createAuditRecord(req, res, StatusEnum.TRUE, responseTime - requestTime);
      })
    );
  }
}
