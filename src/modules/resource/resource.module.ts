import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { CommonModule } from '@/shared/common.module';
import { NetDiskController } from './controllers';

@Module({
  imports: [CommonModule],
  controllers: [ResourceController, NetDiskController],
  providers: [ResourceService],
})
export class ResourceModule {}
