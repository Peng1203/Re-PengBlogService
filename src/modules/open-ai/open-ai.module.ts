import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';
import { CommonModule } from '@/shared/common.module';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
  imports: [CommonModule],
})
export class OpenAiModule {}
