import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FindAllPermissionDto } from './dto';
import { Permission } from '@/common/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ApiResponseCodeEnum } from '@/helper/enums';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(data: CreatePermissionDto) {
    try {
      const permission = await this.permissionRepository.create(data);
      return await this.permissionRepository.save(permission);
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '添加操作权限失败',
      });
    }
  }

  async findAll(params: FindAllPermissionDto) {
    try {
      const { page, pageSize, queryStr = '', column, order } = params;

      const [list, total] = await this.permissionRepository.findAndCount({
        where: [
          { permissionName: Like(`%${queryStr}%`) },
          // { permissionCode: Like(`%${queryStr}%`) },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { [column || 'id']: order || 'ASC' },
      });
      return { list, total };
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询权限列表失败',
      });
    }
  }

  handlePermissionResponse(permissions: Permission[]) {
    const data = JSON.parse(JSON.stringify(permissions));
    return this.formatTree(data);
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }

  formatTree(ary: any[], parentId?: number) {
    return ary
      .filter((item) =>
        // 如果没有父id（第一次递归的时候）将所有父级查询出来
        parentId === undefined ? item.parentId === 0 : item.parentId === parentId,
      )
      .map((item) => {
        // 通过父节点ID查询所有子节点
        item.children = this.formatTree(ary, item.id);
        return item;
      });
  }
}
