import { HttpConfigService } from '@/config/http.config.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule.registerAsync({ useClass: HttpConfigService })],
  exports: [HttpModule]
})
export class CommonModule { }
