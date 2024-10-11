import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateMomentDto, UpdateMomentDto, FindAllMomentDto } from './dto'
import { Moment } from '@/common/entities'
import { Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { UserService } from '../user/user.service'

@Injectable()
export class MomentService {
  constructor(
    @InjectRepository(Moment) private readonly momentRepository: Repository<Moment>,
    private readonly userService: UserService
  ) {}
  async create(data: CreateMomentDto) {
    try {
      const { userId, ...args } = data
      const user = await this.userService.findOneById(userId)
      const moment = await this.momentRepository.create({ user, ...args })
      return await this.momentRepository.save(moment)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '发布动态失败',
      })
    }
  }

  async findAll(query: FindAllMomentDto) {
    try {
      const { page, pageSize, queryStr = '', column, order } = query
      const [list, total] = await this.momentRepository.findAndCount({
        where: [{ content: Like(`%${queryStr}%`) }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { [column || 'createTime']: order || 'ASC' },
        relations: ['user'],
      })
      return {
        list,
        total,
      }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询标签列表失败!',
      })
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} moment`
  }

  update(id: number, updateMomentDto: UpdateMomentDto) {
    return `This action updates a #${id} moment`
  }

  remove(id: number) {
    return `This action removes a #${id} moment`
  }
}
