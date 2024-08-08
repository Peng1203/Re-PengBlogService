import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UploadedFile,
  Put,
  Req,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public, UploadFileAggregation } from '@/common/decorators'
import { ConfigService } from '@nestjs/config'
import path from 'path'
import { Request, Response } from 'express'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@ApiTags('Resource')
@ApiBearerAuth()
@Controller('resource')
export class ResourceController {
  private readonly MAX_SIZE: number = 5

  constructor(private readonly resourceService: ResourceService, private readonly configService: ConfigService) {}

  @Get()
  findAll() {
    return this.resourceService.findAll()
  }

  @Post()
  @UploadFileAggregation({ maxSize: 5 })
  @ApiOperation({ summary: '上传文件' })
  upload(@Res({ passthrough: true }) res: Response, @UploadedFile() file: Express.Multer.File) {
    const RESOURCE_SERVE = this.configService.get<string>('STATIC_RESOURCE_SERVE')
    const fullPath = `${RESOURCE_SERVE}/${path.basename(file.path)}`
    res.resMsg = '文件上传成功'
    return `${fullPath}`
  }

  @Public()
  @Post('chunk/upload')
  @ApiOperation({ summary: '上传大文件前创建一个合成分片的目录' })
  createChunkDir(@Body() data: { dirName: string }) {
    console.log('data.dirName ------', data.dirName)
    return {
      message: '合成目录创建成功',
      success: true,
    }
  }

  @Public()
  @Put('chunk/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/chunks',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(null, `${file.originalname}.${uniqueSuffix}${path.extname(file.originalname)}`)
        },
      }),
    })
  )
  @ApiOperation({ summary: '上传大文件' })
  chunkUpload(@Req() req: Request, @UploadedFiles() files: Express.Multer.File[]) {
    console.log('files ------', files)

    return {
      message: '分片上传成功',
      success: true,
    }
  }
}
