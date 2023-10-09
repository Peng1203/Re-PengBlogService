import { ApiResponseCodeEnum } from '@/helper/enums';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import COS, { type CosObject, GetBucketResult } from 'cos-nodejs-sdk-v5';

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
   */
  async getDirBucket(dirPath?: string): Promise<GetBucketResult> {
    return new Promise((resolve, reject) => {
      this.cos.getBucket(
        {
          Bucket: this.Bucket,
          Region: this.Region,
          Prefix: dirPath || '',
        },
        (err, data) => {
          if (err)
            throw new InternalServerErrorException({
              code: ApiResponseCodeEnum.INTERNALSERVERERROR_REDIS,
              e: err,
            });
          resolve(data);
        },
      );
    });
  }
}
