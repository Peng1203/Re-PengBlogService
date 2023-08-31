import { Module } from '@nestjs/common';
import { RedisModule as LRedisModule } from '@liaoliaots/nestjs-redis';
import { RedisService } from './redis.service';
import { RedisConfigService } from '@/config/redis.config.service';

@Module({
  imports: [LRedisModule.forRootAsync({ useClass: RedisConfigService })],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
