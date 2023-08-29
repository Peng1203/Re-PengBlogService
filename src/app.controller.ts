import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  hello() {
    return `hello world --${this.configService.get<string>('NODE_ENV')}`;
  }
}
