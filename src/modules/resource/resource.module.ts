import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { CommonModule } from '@/shared/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
