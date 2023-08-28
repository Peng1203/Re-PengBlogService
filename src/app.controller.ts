import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) { }
  @Get()
  getHello(): string {
    console.log('.env 加载变量 ----->', this.configService.get<string>('APP_HOST'))
    console.log('.env 加载变量 ----->', this.configService.get<string>('DATABASE_NAME'))
    console.log('ts配置文件加载变量 ----->', this.configService.get<string>('database'))
    return '你好';
  }
}
