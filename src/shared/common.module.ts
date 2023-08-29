import { HttpConfigService } from '@/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule.registerAsync({ useClass: HttpConfigService })],
  exports: [HttpModule],
})
export class CommonModule {}
