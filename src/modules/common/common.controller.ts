import path from 'path'
import { Response } from 'express'
import { Controller, Get, Post, Query, Res, UploadedFile } from '@nestjs/common'
import { CommonService } from './common.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { GetIPInfoDto } from './dto'
import { IpService } from '@/shared/ip/ip.service'
import { ConfigService } from '@nestjs/config'
import { UploadImageAggregation } from '@/common/decorators'

@ApiTags('Common')
@ApiBearerAuth()
@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly ipService: IpService,
    private readonly configService: ConfigService
  ) {}

  @Get('ipParse')
  @ApiOperation({ summary: 'ip解析' })
  ipParse(@Query() { ip }: GetIPInfoDto) {
    return this.ipService.resolveIp_v2(ip)
  }

  @Post('upload/image')
  @UploadImageAggregation({ maxSize: 10 })
  @ApiOperation({ summary: '上传图片资源' })
  async upload(@Res({ passthrough: true }) res: Response, @UploadedFile() file: Express.Multer.File) {
    const RESOURCE_SERVE = this.configService.get<string>('STATIC_RESOURCE_SERVE')
    const fullPath = `${RESOURCE_SERVE}/${path.basename(file.path)}`
    res.resMsg = '图片上传成功!'
    return fullPath
  }
}
