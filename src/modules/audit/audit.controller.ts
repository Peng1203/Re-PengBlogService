import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { FindAllAuditDto } from './dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Query() query: FindAllAuditDto) {
    return this.auditService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.remove(+id);
  }
}
