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
  InternalServerErrorException,
} from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public, UploadFileAggregation } from '@/common/decorators'
import { ConfigService } from '@nestjs/config'
import path from 'path'
import fs from 'fs/promises'
import { Request, Response } from 'express'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { CreateFileDirDto, MergeFileChunksDto, UploadChunkDto } from './dto'
import { nanoid } from 'nanoid'
import { createWriteStream, unlinkSync } from 'fs'
@ApiTags('Resource')
@ApiBearerAuth()
@Controller('resource')
export class ResourceController {
  private readonly MAX_SIZE: number = 5
  private readonly UPLOAD_ROOT_DIR: string = path.join(process.cwd(), 'uploads')

  constructor(private readonly resourceService: ResourceService, private readonly configService: ConfigService) {
    console.log('this.UPLOAD_ROOT_DIR ------', this.UPLOAD_ROOT_DIR)
  }

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
  @ApiOperation({
    summary: '创建或检查分片上传目录，并支持断点续传',
  })
  async createChunkDir(@Body() data: CreateFileDirDto) {
    console.log('data.dirName ------', data.dirName)

    const UPLOAD_DIR = path.join(process.cwd(), 'uploads', data.dirName)
    const existingChunks = await fs.readdir(UPLOAD_DIR).catch(() => false)
    if (existingChunks) {
      // 过滤出已经上传过的分片进行返回
      return {
        existingChunks,
        message: '部分分片已存在，支持断点续传。',
      }
    } else {
      await fs.mkdir(UPLOAD_DIR)
      return { message: '合成目录创建成功' }
    }
  }

  @Public()
  @Put('chunk/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination(req, file, cb) {
          const uploadPath = path.join(process.cwd(), 'uploads', req.query.uploadId as string)
          cb(null, uploadPath)
        },
        filename(req, file, cb) {
          cb(null, req.query.index as string)
        },
      }),
    })
  )
  @ApiOperation({ summary: '上传大文件' })
  chunkUpload(@Req() req: Request, @Query() params: UploadChunkDto, @UploadedFiles() files: Express.Multer.File[]) {
    console.log('params ------', params)
    console.log('files ------', files)

    return {
      message: '分片上传成功',
      success: true,
    }
  }

  @Public()
  @Post('chunk/merge')
  @ApiOperation({
    summary: '合并文件切片',
  })
  async mergeFileChunks(@Body() data: MergeFileChunksDto) {
    const targetDir = path.join(this.UPLOAD_ROOT_DIR, data.uploadId)
    const dirResult = await fs.readdir(targetDir)
    const outputPath = path.join(this.configService.get<string>('STATIC_RESOURCE_PATH'), `${nanoid(5)}.${data.extName}`)

    const writeStream = createWriteStream(outputPath)

    try {
      for (const fileName of dirResult) {
        const chunkPath = path.join(targetDir, fileName)
        const chunk = await fs.readFile(chunkPath)
        writeStream.write(chunk)
        // await fs.unlink(chunkPath) // 删除已合并的切片
      }
      writeStream.end()

      return { success: true, filePath: outputPath }
    } catch (error) {
      throw new InternalServerErrorException('Failed to merge file chunks')
    }
  }
}
