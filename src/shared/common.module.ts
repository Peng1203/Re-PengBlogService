import { HttpConfigService } from '@/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { CosService } from './COS/cos.service';
import { ProxyHttpModule } from './proxyHttp/proxyHttp.module';

@Module({
  imports: [HttpModule.registerAsync({ useClass: HttpConfigService }), ProxyHttpModule, RedisModule],

  providers: [CosService],
  exports: [HttpModule, RedisModule, CosService, ProxyHttpModule],
})
export class CommonModule {}
