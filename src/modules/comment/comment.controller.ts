import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { ClientIp, Public, UserAgent } from '@/common/decorators'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { Request } from 'express'
import { Details } from 'express-useragent'
import { FindAllCommentDto } from './dto/findAll-comment.dto'
import { ParseIntParamPipe } from '@/common/pipe'
import { CommentType } from '@/helper/enums'
import { FindCommentByTargetDto } from './dto/findTarget-comment.dto'

@ApiTags('Comment')
@ApiBearerAuth()
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: '创建评论' })
  async create(@Req() req: Request, @Body() data: CreateCommentDto, @UserAgent() ua: Details, @ClientIp() ip: string) {
    const { device, location, ...args } = await this.commentService.create(data, ua, ip)
    return {
      ...args,
      device: JSON.parse(device),
      location: JSON.parse(location),
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '查询评论列表' })
  async findAll(@Query() query: FindAllCommentDto) {
    const { list, total } = await this.commentService.findAll(query)
    return { list, total }
  }

  @Public()
  @Get(':type/:targetId/comments')
  @ApiOperation({ summary: '查询单个评论' })
  findByTarget(
    @Param('type', new ParseIntParamPipe('id参数有误')) type: CommentType,
    @Param('targetId') targetId: string,
    @Query() params: FindCommentByTargetDto
  ) {
    return this.commentService.findByTarget(type, +targetId, params)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新评论' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评论' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id)
  }
}
