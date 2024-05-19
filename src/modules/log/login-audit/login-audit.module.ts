import { Module } from '@nestjs/common';
import { LoginAuditService } from './login-audit.service';
import { LoginAuditController } from './login-audit.controller';

@Module({
  controllers: [LoginAuditController],
  providers: [LoginAuditService],
  exports: [LoginAuditService],
})
export class LoginAuditModule {}
