import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '@/config';
import { PassPortStrategyEnum } from '@/helper/enums';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: [PassPortStrategyEnum.JWT] }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
