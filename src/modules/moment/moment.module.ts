import { Module } from '@nestjs/common'
import { MomentService } from './moment.service'
import { MomentController } from './moment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Moment } from '@/common/entities'

@Module({
  imports: [TypeOrmModule.forFeature([Moment])],
  controllers: [MomentController],
  providers: [MomentService],
})
export class MomentModule {}
