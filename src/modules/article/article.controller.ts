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
  @Patch(':id')
  @ApiOperation({ summary: '更新文章' })
  update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateArticleDto,
    @ReqUser('id') uid: number,
  ) {
    return this.articleService.update(id, data, uid);
  }

  // @RequirePermissions(PermissionEnum.DELETE_ARTICLE)
  @Delete(':id')
  remove(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.articleService.remove(id);
  }
}
