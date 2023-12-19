import { formatDate } from '@/utils/date.util';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const statusCode = res.statusCode;
    const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
    const logFormat = `
###########################################################
Date: ${formatDate()}
RequestUrl: ${req.originalUrl}
Method: ${req.method}
IP: ${req.ip}
ClientIP: ${clientIp}
StatusCode: ${statusCode}
Params: ${JSON.stringify(req.params)}
Query: ${JSON.stringify(req.query)}
Body: ${JSON.stringify(req.body)}
###########################################################
`;
    Logger.log(logFormat);
    this.writeLog(logFormat);
    next();
  }

  private writeLog(logInfo: string) {}
}
