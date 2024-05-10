import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { FindAllAuditDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '@/common/decorators';
import { User } from '@/common/entities';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: '查询审计' })
  findAll(@Query() query: FindAllAuditDto, @ReqUser() user: User) {
    return this.auditService.findAll(query, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除审计' })
  remove(@Param('id') id: string) {
    return this.auditService.remove(+id);
  }
}
