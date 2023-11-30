import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { TagService } from '@/modules/tag/tag.service';
import { CategoryService } from './../category/category.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '@/common/entities';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    private readonly tagService: TagService,
    private readonly usersService: UserService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(data: CreateArticleDto) {
    try {
      const { category: categoryId, tags: tagIds, authorId, ...args } = data;

      const author = await this.usersService.findOneById(authorId);

      const tags = tagIds.length
        ? (await Promise.all(tagIds.map((id) => this.tagService.findOne(id)))).filter((tag) => tag)
        : [];
      const category = categoryId ? await this.categoryService.findOne(categoryId) : null;

      const article = await this.articleRepository.create({ author, tags, category, ...args });

      return await this.articleRepository.save(article);
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '发布文章失败',
      });
    }
  }

  findAll() {
    return `This action returns all article`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
