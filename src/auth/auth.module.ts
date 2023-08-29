import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService, PassportConfigService } from '@/config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.registerAsync({ useClass: PassportConfigService }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
})
export class AuthModule {}
