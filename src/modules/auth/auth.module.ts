import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService, PassportConfigService } from '@/config';
import { LocalStrategy, JwtStrategy } from './strategys';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    PassportModule.registerAsync({ useClass: PassportConfigService }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
    forwardRef(() => UserModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [PassportModule]
})
export class AuthModule { }
