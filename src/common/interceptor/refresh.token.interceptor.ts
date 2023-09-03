import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/user/entities';
import dayjs from '@/utils/date.util';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 跳过 无需jwt校验的请求
    if (isPublic) return next.handle();

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const user = req.user;

    const isRefresh = await this.isRefreshToken(user);
    if (!isRefresh) return next.handle();
    const refreshToken = await this.authService.refreshToken(user.id, user.userName);
    console.log('refreshToken ----->', refreshToken);
    res.setHeader('refresh-token', refreshToken);
    return next.handle();
  }

  // 是否需要刷新token
  async isRefreshToken(user: User): Promise<boolean> {
    const token = await this.authService.getRedisToken(user.id, user.userName);
    const payload = await this.authService.parseToken(token);
    // token 剩余有效秒
    const effectiveSeconds = payload.exp - dayjs().unix();
    const refreshInterval = Number(this.configService.get<string>('JWT_REFRESH_INTERVAL'));

    return effectiveSeconds < refreshInterval;
  }
}
