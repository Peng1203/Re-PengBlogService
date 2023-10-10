import { ApiResponseCodeEnum } from '@/helper/enums';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import COS, { type CosObject, GetBucketResult } from 'cos-nodejs-sdk-v5';
import { DirFileDataItem, ExtendBucketResult } from './types';
import { extname, basename } from 'path';
import dayjs, { formatDate } from '@/utils/date.util';

@Injectable()
export class CosService {
  // 存储对象实例
  private cos: COS;
  private Bucket: string;
  private Region: string;

  constructor(private readonly configService: ConfigService) {
    const SecretId = this.configService.get<string>('COS_SECRET_ID');
    const SecretKey = this.configService.get<string>('COS_SECRET_KEY');
    const Bucket = this.configService.get<string>('COS_BUCKET');
    const Region = this.configService.get<string>('COS_REGION');

    this.Bucket = Bucket;
    this.Region = Region;

    this.cos = new COS({
      SecretId,
      SecretKey,
    });

    // CosObject;
  }

  /**
   * 获取指定目录下的存储对象
   * @date 2023/10/10 - 09:54:22
   * @author Peng
   *
   * @async
   * @param {?string} [dirPath]
   * @returns {Promise<ExtendBucketResult>}
   */
  async getDirBucket(dirPath?: string): Promise<ExtendBucketResult> {
    return new Promise((resolve, reject) => {
      this.cos.getBucket(
        {
          Bucket: this.Bucket,
          Region: this.Region,
          Prefix: dirPath.replace(/\\+/g, '/') || '',
        },
        (err, data) => {
          if (err)
            throw new InternalServerErrorException({
              code: ApiResponseCodeEnum.INTERNALSERVERERROR_REDIS,
              e: err,
            });
          console.log('data', JSON.parse(JSON.stringify(data)));
          resolve(this.handleDirData(data));
        },
      );
    });
  }

  // 处理目录查询响应的结构
  private handleDirData(result: GetBucketResult): ExtendBucketResult {
    if (!result.Contents.length) return { ...result, data: [] };
    // 排除自身文件夹结果 并排除 其其它子目录中的内容
    const data = result.Contents.slice(1).filter(
      (item) => !item.Key.replace((result as any).Prefix, '').split('/')[2],
    );

    const formatData: DirFileDataItem[] = data.map((COSItem) => {
      const { Key, Size, LastModified } = COSItem;
      const ext = extname(Key);
      const size = Number(Size);
      return {
        path: Key,
        name: basename(Key),
        size: size === 0 ? '' : (size / 1024 / 1024).toFixed(2),
        ext,
        type: ext ? 'file' : 'dir',
        // lastModified: formatDate(LastModified),
        lastModified: LastModified,
      };
    });

    return { ...result, data: formatData };
  }
}
