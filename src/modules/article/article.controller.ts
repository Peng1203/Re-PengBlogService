import path from 'path';
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
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Public,
  ReqUser,
  RequirePermissions,
  UploadImageAggregation,
} from '@/common/decorators';
import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums';
import { FindAllArticleDto } from './dto';
import { ParseIntParamPipe } from '@/common/pipe';
import { Response } from 'express';
import { DeleteArticleGuard, UpdateArticleGuard } from './guards';

@ApiTags('Article')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly configService: ConfigService
  ) {}

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
  @ApiOperation({ summary: '获取文章列表' })
  findAll(@Query() params: FindAllArticleDto) {
    return this.articleService.findAll(params);
  }

  // @UseGuards(GetArticleDetailGuard)
  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.articleService.findOne(id);
  }

  // @RequirePermissions(PermissionEnum.UPDATE_ARTICLE)
  @Patch(':id/:aid')
  @UseGuards(UpdateArticleGuard)
  @ApiOperation({ summary: '更新文章' })
  async update(
    @Param('id', new ParseIntParamPipe('文章id参数有误')) id: number,
    @Param('aid', new ParseIntParamPipe('作者id参数有误')) aid: number,
    @Body() data: UpdateArticleDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.articleService.update(aid, data);
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新文章失败!') && (res.success = false);
    return updateRes || '操作失败!';
  }

  // @RequirePermissions(PermissionEnum.DELETE_ARTICLE)
  @Delete(':id/:aid')
  @UseGuards(DeleteArticleGuard)
  @ApiOperation({ summary: '删除文章' })
  async remove(
    @Param('id', new ParseIntParamPipe('文章id参数有误')) id: number,
    @Param('aid', new ParseIntParamPipe('作者id参数有误')) aid: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const article = await this.articleService.findOne(aid).catch(() => false);
    if (!article)
      throw new NotFoundException({
        code: ApiResponseCodeEnum.NOTFOUND_ROLE,
        msg: '删除失败，未找到相关文章',
      });

    const delRes = await this.articleService.remove(aid);
    if (!delRes) res.resMsg = '删除文章失败!';
    if (!delRes) res.success = false;
    else return '删除文章成功';
  }

  @Public()
  @Post('image')
  @UploadImageAggregation()
  @ApiOperation({ summary: '上传文章图片资源' })
  async upload(
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    const RESOURCE_SERVE = this.configService.get<string>(
      'STATIC_RESOURCE_SERVE'
    );
    const fullPath = `${RESOURCE_SERVE}/${path.basename(file.path)}`;
    res.resMsg = '图片上传成功!';
    return fullPath;
  }
}
