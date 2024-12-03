import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { Public } from '@/common/decorators'
import { SensitiveWordsService } from '@/common/service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('Comment')
@ApiBearerAuth()
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly sensitiveWordsService: SensitiveWordsService
  ) {}

  @Public()
  @Post()
  create(@Body() data: CreateCommentDto) {
    // 判断发言是否为敏感发言
    const { text } = this.sensitiveWordsService.getMint().filter(data.content, { replace: true })
    data.content = text

    return data
  }

  @Get()
  findAll() {
    return this.commentService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id)
  }
}
