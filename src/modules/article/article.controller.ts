import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '@/modules/user/user.service';
import { Public, ReqUser, RequirePermissions } from '@/common/decorators';
import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums';
import { FindAllArticleDto } from './dto';
import { ParseIntParamPipe } from '@/common/pipe';
import { Response } from 'express';

@ApiTags('Article')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @RequirePermissions(PermissionEnum.CREATE_ARTICLE)
  @ApiOperation({ summary: '发布文章' })
  async create(@Body() data: CreateArticleDto, @ReqUser('id') uid: number) {
    if (uid !== data.authorId)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER,
        msg: '身份信息有误！',
      });

    return this.articleService.create(data);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '获取文章列表' })
  findAll(@Query() params: FindAllArticleDto) {
    return this.articleService.findAll(params);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '获取文章详情' })
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.articleService.findOne(id);
  }

  // @RequirePermissions(PermissionEnum.UPDATE_ARTICLE)
  @Patch(':id/:aid')
  @ApiOperation({ summary: '更新文章' })
  update(
    @Param('id', new ParseIntParamPipe('文章id参数有误')) id: number,
    @Param('aid', new ParseIntParamPipe('作者id参数有误')) aid: number,
    @Body() data: UpdateArticleDto,
  ) {
    return this.articleService.update(id, data, aid);
  }

  // @RequirePermissions(PermissionEnum.DELETE_ARTICLE)
  @Delete(':id/:aid')
  @ApiOperation({ summary: '删除文章' })
  async remove(
    @Param('id', new ParseIntParamPipe('文章id参数有误')) id: number,
    @Param('aid', new ParseIntParamPipe('作者id参数有误')) aid: number,
    @ReqUser('id') uid: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (aid !== uid)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER,
        msg: '删除失败，身份信息有误',
      });
    const role = await this.articleService.findOne(id).catch(() => false);
    if (!role)
      throw new NotFoundException({
        code: ApiResponseCodeEnum.NOTFOUND_ROLE,
        msg: '删除失败，未找到相关文章',
      });

    const delRes = await this.articleService.remove(id);
    if (!delRes) res.resMsg = '删除文章失败!';
    if (!delRes) res.success = false;
    else return '删除文章成功';
  }
}
