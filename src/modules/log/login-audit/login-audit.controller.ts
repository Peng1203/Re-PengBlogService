import { Controller, Get, Query } from '@nestjs/common';
import { LoginAuditService } from './login-audit.service';
import { PermissionEnum } from '@/helper/enums';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser, RequirePermissions } from '@/common/decorators';
import { User } from '@/common/entities';
import { FindAllLoginAuditDto } from './dto';

@ApiTags('Log')
@ApiBearerAuth()
@Controller('login/audit')
export class LoginAuditController {
  constructor(private readonly loginAuditService: LoginAuditService) {}

  @Get()
  @RequirePermissions(PermissionEnum.GET_LOGIN_LOG)
  @ApiOperation({ summary: '查询登录日志' })
  findAll(@Query() query: FindAllLoginAuditDto, @ReqUser() user: User) {
    return this.loginAuditService.findAll(query, user.id);
  }
}
