// import { Public } from '@/common/decorators';
import { MethodNotAllowedException, UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UpdateAvaterDto } from '../dto';
import { diskStorage } from 'multer';
import { Request } from 'express';
import path from 'path';
import { nanoid } from 'nanoid';
import mime from 'mime-types';

/**
 * 上传头像装饰器聚合
 */
export function UploadAvaterAggregation() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination(req: Request, file, callback) {
            const { STATIC_RESOURCE_PATH } = process.env;
            callback(null, path.resolve(STATIC_RESOURCE_PATH));
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
