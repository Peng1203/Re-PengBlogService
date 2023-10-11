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
    const rootDir = this.configService.get<string>('NETDISK_ROOT_DIR');
    const fullPath = join(rootDir, (params.path || '').replaceAll('netdisk/', '')).toString();
    const result = await this.COSService.getDirBucket(fullPath);
    return {
      path:
        (result as any).Prefix === rootDir ? '' : (result as any).Prefix.replaceAll('netdisk/', ''),
      list: result.data,
    };
  }
}
