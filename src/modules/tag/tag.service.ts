import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from '@/common/entities';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { FindAllTagDto } from './dto';

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
      return { list, total };
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询标签列表失败!',
      });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
