import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAudit } from '@/common/entities';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { IpService } from '@/shared/ip/ip.service';
import { LoginMethodEnum } from '@/helper/enums';
import { formatDate } from '@/utils/date.util';

@Injectable()
export class LoginAuditService {
  constructor(
    @InjectRepository(LoginAudit)
    private readonly loginAuditRepository: Repository<LoginAudit>,
    private readonly ipService: IpService
  ) {}
  async createLoginRecord(
    req: Request,
    userInfo: { userId?: number; userName: string },
    options: {
      ip?: string;
      location?: string;
      loginStatus: number;
      failureReason: string;
      loginDuration: number;
      loginMethod: LoginMethodEnum;
      loginTime?: string | null;
    }
  ) {
    const record = new LoginAudit();

    const { userId, userName } = userInfo;
    const {
      ip,
      location,
      loginStatus,
      failureReason,
      loginDuration,
      loginMethod,
      loginTime,
    } = options;
    const ipAddr = ip || this.getClientIp(req);
    const { browser, version, userAgent, os, deviceTypes } =
      this.getClientInfo(req);

    record.userId = userId;
    record.userName = userName;
    record.ip = ipAddr;
    record.device = this.getDeviceType(deviceTypes);
    record.location = location || this.getLocationInfo(ipAddr);
    record.loginStatus = loginStatus;
    record.failureReason = failureReason;
    record.userAgent = userAgent;
    record.loginDuration = loginDuration;
    record.loginMethod = loginMethod;
    record.browser = `${browser} ${version}`;
    record.os = deviceTypes.includes('Android') ? 'Android' : os;
    record.loginTime = loginTime || formatDate();

    const loginRecord = await this.loginAuditRepository.create(record);
    return await this.loginAuditRepository.save(loginRecord);
  }

  getClientIp(req: Request) {
    const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
    const localIp = req.ip === '::1' ? '127.0.0.1' : req.ip;
    return (
      Array.isArray(clientIp) ? clientIp[0] : clientIp || localIp
    ).replace('::ffff:', '');
  }

  getLocationInfo(ip: string) {
    return JSON.stringify(this.ipService.resolveIp(ip));
  }

  getClientInfo(req: Request) {
    const { os, platform, browser, version, source, isAuthoritative, ...args } =
      req.useragent;
    const deviceTypes: string[] = [];
    for (const key in args) {
      if (!key.includes('is')) continue;

      if (!args[key]) continue;

      deviceTypes.push(key.replace('is', ''));
    }
    // return req.useragent;
    return {
      os,
      platform,
      browser,
      version,
      deviceTypes,
      authoritative: isAuthoritative,
      userAgent: source,
    };
  }

  getDeviceType(deviceTypes: string[]) {
    if (deviceTypes.includes('Desktop')) return 'PC';
    else if (deviceTypes.includes('Mobile')) return 'Mobile';
    else return 'Other';
  }
}
