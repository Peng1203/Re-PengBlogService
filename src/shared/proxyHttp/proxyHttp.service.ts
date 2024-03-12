import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import tunnel from 'tunnel';

@Injectable()
export class ProxyHttpService {
  readonly proxyHttp: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const PROXY_HOST = this.configService.get<string>('PROXY_HOST');
    const PROXY_PORT = this.configService.get<string>('PROXY_PORT');
    const PROXY_USER = this.configService.get<string>('PROXY_USER');
    const PROXY_PWD = this.configService.get<string>('PROXY_PASSWORD');

    this.proxyHttp = axios.create({
      httpsAgent: tunnel.httpsOverHttp({
        proxy: {
          host: PROXY_HOST,
          port: PROXY_PORT,
          proxyAuth: `${PROXY_USER}:${PROXY_PWD}`,
        },
      }),
    });
  }

  request() {
    return this.proxyHttp;
  }
}
