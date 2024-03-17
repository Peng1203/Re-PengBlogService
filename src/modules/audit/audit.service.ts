import { Injectable } from '@nestjs/common';
import { StatusEnum, RequestMethodEnum } from '@/helper/enums';
import { Response, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Audit } from '@/common/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(Audit) private readonly auditRepository: Repository<Audit>) {}

  async createAuditRecord(
    req: Request,
    res: Response,
    operationStatus: StatusEnum,
    responseTime?: number,
    errMessage?: string,
    statusCode?: number,
  ) {
    try {
      const { method, originalUrl, useragent, query, body, path, ip } = req;
      // const { statusCode } = res;

      const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
      const audit = new Audit();

      audit.method = RequestMethodEnum[method];
      // audit.router = originalUrl;
      audit.router = path;
      audit.ip = (Array.isArray(clientIp) ? clientIp[0] : clientIp) || ip;
      audit.userAgent = useragent.source;
      audit.statusCode = statusCode || res.statusCode;
      audit.responseTime = responseTime;
      audit.requestQueryParams = JSON.stringify(query);
      audit.requestBodyParams = JSON.stringify(body);
      audit.operationStatus = operationStatus;
      errMessage && (audit.errMessage = errMessage);
      audit.description = '';
      audit.user = req.user;

      const auditRecord = await this.auditRepository.create(audit);
      return await this.auditRepository.save(auditRecord);
    } catch (e) {
      console.log('审计记录创建失败 ------', e);
    }
  }

  findAll() {
    return `This action returns all audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }
}
