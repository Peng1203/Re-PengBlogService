import { HttpConfigService } from '@/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [HttpModule.registerAsync({ useClass: HttpConfigService }), RedisModule],
  exports: [HttpModule, RedisModule],
})
export class CommonModule {}
