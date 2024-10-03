import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { TagService } from '@/modules/tag/tag.service'
import { CategoryService } from './../category/category.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
import { Article } from '@/common/entities'
import { UserService } from '@/modules/user/user.service'
import { FindAllArticleDto, FindUserArticleDto } from './dto'
import { formatDate } from '@/utils/date.util'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService
  ) {}

  async create(data: CreateArticleDto) {
    try {
      const { category: categoryId, tags: tagIds, authorId, ...args } = data

      const author = await this.userService.findOneById(authorId)
      const tags = tagIds.length
        ? (await Promise.all(tagIds.map(id => this.tagService.findOne(id)))).filter(tag => tag)
        : []
      const category = categoryId ? await this.categoryService.findOne(categoryId) : null

      const article = await this.articleRepository.create({
        author,
        tags,
        category,
        ...args,
      })

      return await this.articleRepository.save(article)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '发布文章失败',
      })
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
      } = params

      // .leftJoinAndSelect('author.roles', 'role')
      const queryBuilder = this.articleRepository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.tags', 'tags')
        .leftJoinAndSelect('article.author', 'author')
        .leftJoinAndSelect('article.category', 'category')
        .andWhere(
          new Brackets(qb =>
            qb.where('article.title LIKE :queryStr', {
              queryStr: `%${queryStr}%`,
            })
          )
        )
        .orderBy({
          'article.isTop': 'DESC',
          [`article.${column || 'id'}`]: order || 'ASC',
        })
        // .orderBy(`article.${column || 'id'}`, order || 'ASC')
        .skip((page - 1) * pageSize)
        .take(pageSize)

      type && queryBuilder.andWhere('article.type = :type', { type })
      tagId && queryBuilder.andWhere('tags.id = :tagId', { tagId })
      status && queryBuilder.andWhere('article.status = :status', { status })
      authorId && queryBuilder.andWhere('article.authorId = :authorId', { authorId })
      categoryId &&
        queryBuilder.andWhere('article.categoryId = :categoryId', {
          categoryId,
        })
      startTime &&
        queryBuilder.andWhere('article.createTime >= :startTime', {
          startTime,
        })
      endTime && queryBuilder.andWhere('article.createTime <= :endTime', { endTime })

      const [list, total] = await queryBuilder.getManyAndCount()

      return { list, total }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询文章列表失败',
      })
    }
  }

  async findByUser(uid: number, params: FindUserArticleDto) {
    try {
      const { page, pageSize, column, order, type = 1 } = params
      const where = { author: { id: uid } }
      const data = { list: [], total: 0 }
      if (type === 1) {
        const [list, total] = await this.articleRepository.findAndCount({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          order: { isTop: 'DESC' },
          relations: ['author', 'tags', 'category'],
        })
        data.list = list
        data.total = total
      } else {
        const [list, total] = await this.articleRepository.findAndCount({
          where,
          order: { [column || 'id']: order || 'ASC' },
        })
        data.list = list.map(item => ({ label: item.title, value: item.id }))
        data.total = total
      }

      return data
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询文章列表失败',
      })
    }
  }

  async findOne(id: number): Promise<Article> {
    try {
      const article = await this.articleRepository.findOne({
        where: { id },
        relations: ['author', 'tags', 'category'],
      })
      return article
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询文章详情失败',
      })
    }
  }

  async findOneByUidAndAid(uid: number, aid: number): Promise<Article> {
    try {
      const article = await this.articleRepository.findOne({
        where: {
          id: aid,
          author: {
            id: uid,
          },
        },
        relations: ['author', 'tags', 'category'],
      })
      return article
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询文章详情失败',
      })
    }
  }

  async update(articleId: number, data: UpdateArticleDto) {
    try {
      const { category, tags: tagIds, ...args } = data
      const article = await this.findOne(articleId)

      for (const key in args) {
        article[key] = args[key]
      }

      article.tags = tagIds.length
        ? (await Promise.all(tagIds.map(id => this.tagService.findOne(id)))).filter(tag => tag)
        : []

      article.category = category ? await this.categoryService.findOne(category) : null

      article.updateTime = formatDate()
      return await this.articleRepository.save(article)
    } catch (e) {
      console.log('e ------', e)
      if (e instanceof NotFoundException)
        throw new NotFoundException({
          e,
          code: ApiResponseCodeEnum.NOTFOUND,
          msg: (e as any).response.msg,
        })
      else
        throw new InternalServerErrorException({
          e,
          code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
          msg: '更新文章失败',
        })
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.articleRepository.delete(id)
      return !!delResult.affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除文章失败',
      })
    }
  }
}
