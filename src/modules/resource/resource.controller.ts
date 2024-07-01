import { Controller, Get, Post, Body, Res, UploadedFile } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadFileAggregation } from '@/common/decorators';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { Response } from 'express';

@ApiTags('Resource')
@ApiBearerAuth()
@Controller('resource')
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  findAll() {
    return this.resourceService.findAll();
  }

  @Post()
  @UploadFileAggregation({ maxSize: 2 })
  @ApiOperation({ summary: '上传文件' })
  upload(
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    const RESOURCE_SERVE = this.configService.get<string>(
      'STATIC_RESOURCE_SERVE'
    );
    const fullPath = `${RESOURCE_SERVE}/${path.basename(file.path)}`;
    res.resMsg = '文件上传成功';
    return `${fullPath}`;
  }
}
