import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import mime from 'mime-types';
import { nanoid } from 'nanoid';
import { Request } from 'express';
import { diskStorage } from 'multer';
// import { Public } from '@/common/decorators';
import { MethodNotAllowedException, UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UpdateAvaterDto } from '../dto';

const mkdirAsync = promisify(fs.mkdir);
/**
 * 上传头像装饰器聚合
 */
export function UploadAvaterAggregation() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          async destination(req: Request, file, callback) {
            const { STATIC_RESOURCE_PATH } = process.env;
            const uploadPath = path.resolve(STATIC_RESOURCE_PATH);
            const hasDir = fs.existsSync(uploadPath);
            if (!hasDir) await mkdirAsync(uploadPath);

            callback(null, uploadPath);
          },
          filename(req: Request, file, callback) {
            const extname = mime.extension(file.mimetype);

            const fileName = `${nanoid(10)}.${extname}`;
            callback(null, fileName);
          },
        }),
        limits: {
          fileSize: Math.pow(1024, 2) * 2,
        },
        fileFilter(req, file, callback) {
          if (!file.mimetype.includes('image')) callback(new MethodNotAllowedException('请选择图片类型的文件'), false);
          else callback(null, true);
        },
      })
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '',
      type: UpdateAvaterDto,
    }),
    ApiOperation({ summary: '上传用户头像' })
  );
}
