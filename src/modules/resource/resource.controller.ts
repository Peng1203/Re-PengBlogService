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
import { createReadStream, createWriteStream } from 'fs'
@ApiTags('Resource')
@ApiBearerAuth()
@Controller('resource')
export class ResourceController {
  private readonly MAX_SIZE: number = 5
  private readonly UPLOAD_ROOT_DIR: string = path.join(process.cwd(), 'uploads')

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
  @ApiOperation({
    summary: '创建或检查分片上传目录，并支持断点续传',
  })
  async createChunkDir(@Body() data: CreateFileDirDto) {
    const UPLOAD_DIR = path.join(process.cwd(), 'uploads', data.uploadId)
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
  chunkUpload() {
    return {
      message: '分片上传成功',
      success: true,
    }
  }

  // @Public()
  // @Post('chunk/merge')
  // @ApiOperation({
  //   summary: '合并文件切片',
  // })
  // async mergeFileChunks(@Body() data: MergeFileChunksDto) {
  //   const targetDir = path.join(this.UPLOAD_ROOT_DIR, data.uploadId)
  //   const dirResult = await fs.readdir(targetDir)
  //   const outputPath = path.join(this.configService.get<string>('STATIC_RESOURCE_PATH'), `${nanoid(5)}.${data.extName}`)
  //   const writeStream = createWriteStream(outputPath)
  //   try {
  //     for (const fileName of dirResult) {
  //       const chunkPath = path.join(targetDir, fileName)
  //       const chunk = await fs.readFile(chunkPath)
  //       writeStream.write(chunk)
  //       // await fs.unlink(chunkPath) // 删除已合并的切片
  //     }
  //     writeStream.end()
  //     return { success: true, filePath: outputPath }
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to merge file chunks')
  //   }
  // }

  @Public()
  @Post('chunk/merge')
  @ApiOperation({
    summary: '合并文件切片',
  })
  async mergeFileChunks(@Body() data: MergeFileChunksDto) {
    try {
      const targetDir = path.join(this.UPLOAD_ROOT_DIR, data.uploadId)
      const dirResult = await fs.readdir(targetDir)

      // 判断是否有同样的文件名
      const fileExists = await fs
        .access(path.join(this.configService.get<string>('STATIC_RESOURCE_PATH'), data.fileName))
        .then(() => true)
        .catch(() => false)
      // 如果有同样的文件名，则生成新的文件名
      const fileName = fileExists ? `${nanoid(5)}.${data.extName}` : data.fileName

      const outputPath = path.join(this.configService.get<string>('STATIC_RESOURCE_PATH'), fileName)
      const fullPath = path.join(this.configService.get<string>('STATIC_RESOURCE_SERVE'), fileName)

      // 按文件名顺序排序，确保分片按正确顺序合并
      dirResult.sort((a, b) => parseInt(a) - parseInt(b))
      const writeStream = createWriteStream(outputPath)
      for (const fileName of dirResult) {
        const chunkPath = path.join(targetDir, fileName)

        // 读取并写入流
        await new Promise((resolve, reject) => {
          const readStream = createReadStream(chunkPath)
          readStream.pipe(writeStream, { end: false })
          readStream.on('end', resolve)
          readStream.on('error', reject)
        })

        // 删除已合并的切片
        await fs.unlink(chunkPath)
      }

      writeStream.end()

      // 确保写入完成
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
      })

      // 合并完成后删除临时目录
      fs.rmdir(targetDir)

      return fullPath
    } catch (error) {
      throw new InternalServerErrorException('Failed to merge file chunks')
    }
  }
}
