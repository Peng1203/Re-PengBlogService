import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTagDto, UpdateTagDto, FindAllTagDto } from './dto';
import { Tag } from '@/common/entities';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { formatDate } from '@/utils/date.util';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

  async create(data: CreateTagDto) {
    try {
      const tag = await this.tagRepository.create(data);
      return await this.tagRepository.save(tag);
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '添加标签失败',
      });
    }
  }

  async findAll(query: FindAllTagDto) {
    try {
      const { page, pageSize, queryStr = '', column, order } = query;
      const [list, total] = await this.tagRepository.findAndCount({
        where: [{ tagName: Like(`%${queryStr}%`) }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { [column || 'id']: order || 'ASC' },
        relations: ['articles'],
      });
      return { list: list.map((item) => ({ ...item, articles: item.articles.length })), total };
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询标签列表失败!',
      });
    }
  }

  async findOne(id: number): Promise<Tag> {
    try {
      return await this.tagRepository.findOne({ where: { id } });
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询标签失败',
      });
    }
  }

  async update(id: number, data: UpdateTagDto) {
    try {
      const tag = await this.findOne(id);

      for (const key in data) {
        tag[key] = data[key];
      }

      tag.updateTime = formatDate();
      return await this.tagRepository.save(tag);
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
        msg: '更新标签失败',
      });
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.tagRepository.delete(id);
      return !!delResult.affected;
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除角色失败',
      });
    }
  }
}
