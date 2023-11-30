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
import { ReqUser } from '@/common/decorators';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { FindAllArticleDto } from './dto';

@ApiTags('Article')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
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
  @ApiOperation({ summary: '获取文章列表' })
  findAll(@Query() params: FindAllArticleDto) {
    console.log('params ------', params);
    return this.articleService.findAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取文章列表' })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
