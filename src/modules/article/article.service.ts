import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import { formatDate } from '@/utils/date.util';

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
        startTime,
        endTime,
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
      startTime && queryBuilder.andWhere('article.createTime >= :startTime', { startTime });
      endTime && queryBuilder.andWhere('article.createTime <= :endTime', { endTime });

      const [list, total] = await queryBuilder.getManyAndCount();

      // 排除访问密码和作者密码
      const dataList = list.map(({ author, accessPassword, ...args }) => ({
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

  async findOne(id: number): Promise<Article> {
    try {
      return await this.articleRepository.findOne({
        where: { id },
        relations: ['author', 'tags', 'category'],
      });
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询文章详情失败',
      });
    }
  }

  async update(aid: number, data: UpdateArticleDto, uid: number) {
    try {
      const { category, tags: tagIds, ...args } = data;
      const article = await this.findOne(aid);
      if (article.author.id !== uid) throw new ForbiddenException();

      for (const key in args) {
        article[key] = args[key];
      }

      article.tags = tagIds.length
        ? (await Promise.all(tagIds.map((id) => this.tagService.findOne(id)))).filter((tag) => tag)
        : [];

      article.category = await this.categoryService.findOne(category);

      article.updateTime = formatDate();
      return await this.articleRepository.save(article);
    } catch (e) {
      if (e instanceof ForbiddenException)
        throw new ForbiddenException({
          code: ApiResponseCodeEnum.FORBIDDEN_USER,
          msg: '更新文章失败 身份信息有误！',
        });
      else if (e instanceof NotFoundException)
        throw new NotFoundException({
          e,
          code: ApiResponseCodeEnum.NOTFOUND,
          msg: (e as any).response.msg,
        });
      else
        throw new InternalServerErrorException({
          e,
          code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
          msg: '更新文章失败',
        });
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.articleRepository.delete(id);
      return !!delResult.affected;
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除文章失败',
      });
    }
  }
}
