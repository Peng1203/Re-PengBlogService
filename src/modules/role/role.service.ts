import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '@/common/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { FindAllRoleDto } from './dto';
import { ListResponse } from '@/common/interface';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll(query: FindAllRoleDto): Promise<ListResponse<Role>> {
    try {
      const { page, pageSize, queryStr = '', column, order } = query;
      const [list, total] = await this.roleRepository.findAndCount({
        where: [{ roleName: Like(`%${queryStr}%`) }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { [column || 'id']: order || 'ASC' },
        relations: ['menus', 'permissions'],
      });
      return { list, total };
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL,
        msg: '查询角色列表失败!',
      });
    }
  }

  async findOne(id: number): Promise<Role> {
    try {
      return await this.roleRepository.findOne({ where: { id } });
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL,
        msg: '查询角色失败',
      });
    }
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
