import { ExecutionContext, Injectable } from '@nestjs/common';
import { PassPortStrategyEnum } from '@/helper/enums';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard(PassPortStrategyEnum.LOCAL) {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    console.log('执行了 localAuthGuard----->', req.body);
    // 校验验证码

    return this.activate(context);
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
