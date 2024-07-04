import { Controller, Get, Query } from '@nestjs/common'
import { CommonService } from './common.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { GetIPInfoDto } from './dto'
import { IpService } from '@/shared/ip/ip.service'

@ApiTags('Common')
@ApiBearerAuth()
@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly ipService: IpService
  ) {}

  @Get('ipParse')
  @ApiOperation({ summary: 'ip解析' })
  ipParse(@Query() { ip }: GetIPInfoDto) {
    return this.ipService.resolveIp_v2(ip)
  }
}
