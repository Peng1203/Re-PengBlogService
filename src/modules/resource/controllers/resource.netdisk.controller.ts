import { Public } from '@/common/decorators';
import { CosService } from '@/shared/COS/cos.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { FindNetdiskDirDto } from '../dto';

@ApiTags('Resource')
@ApiBearerAuth()
@Controller('resource/netdisk')
export class NetDiskController {
  constructor(
    private readonly COSService: CosService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Public()
  async getNetdist(@Query() params: FindNetdiskDirDto) {
    const fullPath = join(
      this.configService.get<string>('NETDISK_ROOT_DIR'),
      params.path || '',
    ).toString();
    const result = await this.COSService.getDirBucket(fullPath);
    return {
      path: (result as any).Prefix,
      list: result.data,
    };
  }
}
