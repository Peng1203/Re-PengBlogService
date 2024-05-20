import { Injectable } from '@nestjs/common';
import IP2Region from 'ip2region';

@Injectable()
export class IpService {
  private query: IP2Region;

  constructor() {
    this.query = new IP2Region({ disableIpv6: true });
  }

  resolveIp(ip: string): {
    country: string;
    province: string;
    city: string;
    isp: string;
  } {
    try {
      return this.query.search(ip);
    } catch (e) {
      console.log('解析IP失败', e);
    }
  }
}
