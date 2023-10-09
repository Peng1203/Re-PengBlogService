import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import COS from 'cos-nodejs-sdk-v5';

@Injectable()
export class CosService {
  // 存储对象实例
  private cos: any;
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
  }
}
