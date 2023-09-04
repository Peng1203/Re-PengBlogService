import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * 设置暴露响应头的中间件
 */
@Injectable()
export class ExposeHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Expose-Headers', 'refresh-token, test');
    next();
  }
}
