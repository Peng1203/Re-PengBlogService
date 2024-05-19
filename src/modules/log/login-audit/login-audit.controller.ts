import { Controller } from '@nestjs/common';
import { LoginAuditService } from './login-audit.service';

@Controller('log/login')
export class LoginAuditController {
  constructor(private readonly loginAuditService: LoginAuditService) {}
}
