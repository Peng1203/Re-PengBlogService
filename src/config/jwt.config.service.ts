import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export class JwtConfigService implements JwtOptionsFactory {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      global: true,
      signOptions: {
        expiresIn: this.configService.get<string>('JWT_EXPIRES'),
        issuer: this.configService.get<string>('JWT_ISSUER'),
      },
    };
  }
}
