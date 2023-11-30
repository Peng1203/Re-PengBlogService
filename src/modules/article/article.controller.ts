import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '@/modules/user/user.service';
import { ReqUser } from '@/common/decorators';
import { ApiResponseCodeEnum } from '@/helper/enums';

@ApiTags('Article')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() data: CreateArticleDto, @ReqUser('id') uid: number) {
    if (uid !== data.authorId)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER,
        msg: '身份信息有误！',
      });

    return this.articleService.create(data);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
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
