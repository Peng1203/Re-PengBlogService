import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from '@/common/entities'
import { SensitiveWordsService } from '@/common/service'

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [CommentService,
    SensitiveWordsService],
})
export class CommentModule {}
