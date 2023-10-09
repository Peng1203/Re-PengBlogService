import { HttpConfigService } from '@/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { CosService } from './COS/cos.service';

@Module({
  imports: [HttpModule.registerAsync({ useClass: HttpConfigService }), RedisModule],
  providers: [CosService],
  exports: [HttpModule, RedisModule, CosService],
})
export class CommonModule {}
