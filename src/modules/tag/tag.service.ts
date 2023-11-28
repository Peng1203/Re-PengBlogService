import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from '@/common/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponseCodeEnum } from '@/helper/enums';

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

  findAll() {
    return `This action returns all tag`;
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
