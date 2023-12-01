import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { TagService } from '@/modules/tag/tag.service';
import { CategoryService } from './../category/category.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Article } from '@/common/entities';
import { UserService } from '@/modules/user/user.service';
import { FindAllArticleDto } from './dto';

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

  async findAll(params: FindAllArticleDto) {
    try {
      const {
        page,
        pageSize,
        queryStr = '',
        column,
        order,
        type,
        status,
        authorId,
        categoryId,
        tagId,
      } = params;

      // .leftJoinAndSelect('author.roles', 'role')
      const queryBuilder = this.articleRepository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.tags', 'tags')
        .leftJoinAndSelect('article.author', 'author')
        .leftJoinAndSelect('article.category', 'category')
        .andWhere(
          new Brackets((qb) =>
            qb.where('article.title LIKE :queryStr', { queryStr: `%${queryStr}%` }),
          ),
        )
        .orderBy(`article.${column || 'id'}`, order || 'ASC')
        .skip((page - 1) * pageSize)
        .take(pageSize);

      type && queryBuilder.andWhere('article.type = :type', { type });
      tagId && queryBuilder.andWhere('tags.id = :tagId', { tagId });
      status && queryBuilder.andWhere('article.status = :status', { status });
      authorId && queryBuilder.andWhere('article.authorId = :authorId', { authorId });
      categoryId && queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId });

      const [list, total] = await queryBuilder.getManyAndCount();

      // 排除用户密码
      const dataList = list.map(({ author, ...args }) => ({
        ...args,
        author: { ...author, password: undefined },
      }));

      return { list: dataList, total };
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询文章列表失败',
      });
    }
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
