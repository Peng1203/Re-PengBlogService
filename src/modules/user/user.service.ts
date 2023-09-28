import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto';
import { User } from '@/common/entities';
import { ListResponse } from '@/common/interface';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { RoleService } from './../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}
  async create(data: CreateUserDto) {
    try {
      let { roleIds, ...userInfo } = data;
      const roles = await Promise.all(roleIds.map((roleId) => this.roleService.findOne(roleId)));
      const user = await this.userRepository.create({ roles, ...userInfo });
      return await this.userRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '创建用户失败',
      });
    }
  }

  /**
   * 查询全部用户
   * @date 2023/8/30 - 10:41:38
   * @author Peng
   *
   * @async
   * @param {FindAllUserDto} params
   * @returns {Promise<ListResponse<User>>}
   */
  async findAll(params: FindAllUserDto): Promise<ListResponse<User>> {
    try {
      const { page, pageSize, queryStr = '', column, order, roleId = '' } = params;
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'role')
        .andWhere(
          new Brackets((qb) => {
            qb.where('user.userName LIKE :queryStr', { queryStr: `%${queryStr}%` }).orWhere(
              'user.nickName LIKE :queryStr',
              { queryStr: `%${queryStr}%` },
            );
          }),
        )
        .orderBy(`user.${column || 'id'}`, order || 'ASC')
        .skip((page - 1) * pageSize)
        .take(pageSize);
      roleId && queryBuilder.where('role.id = :roleId', { roleId });
      const [list, total] = await queryBuilder.getManyAndCount();

      // let [list, total] = await this.userRepository.findAndCount({
      //   where: [
      //     { userName: Like(`%${queryStr}%`) },
      //     { nickName: Like(`%${queryStr}%`) },
      //     // ...roleFilter
      //   ],
      //   skip: (page - 1) * pageSize,
      //   take: pageSize,
      //   order: { [column]: order },
      //   relations: ['roles'],
      // });

      return { list, total };
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询用户列表失败',
      });
    }
  }

  findOne(id?: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    try {
      const delResult = await this.userRepository.delete(id);
      console.log('delResult ------', delResult);
      return `This action removes a #${id} user`;
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除用户失败',
      });
    }
  }

  /**
   * 通过用户名密码查询
   * @date 2023/8/30 - 16:36:06
   * @author Peng
   *
   * @async
   * @param {string} userName
   * @param {string} password
   * @returns {Promise<User | null>}
   */
  async findOneByUserNameAndPwd(userName: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.userName = :userName', { userName })
        .andWhere('user.password = :password', { password })
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('roles.menus', 'menus')
        .leftJoinAndSelect('roles.permissions', 'permissions')
        .getOne();
      // const user = await this.userRepository.findOne({
      //   where: { userName, password },
      //   relations: ['roles'],
      // });
      if (user) return user;
      throw new UnauthorizedException({
        code: ApiResponseCodeEnum.UNAUTHORIZED_UNAME_OR_PWD_NOMATCH,
        msg: '用户名或密码错误',
      });
    } catch (e) {
      this.handleFindOneError(e);
    }
  }

  /**
   * 通过 id和 用户名查询用户信息
   * @date 2023/9/3 - 16:04:17
   * @author Peng
   *
   * @async
   * @param {number} id
   * @param {string} userName
   * @returns {*}
   */
  async findOneByUserIdAndUserName(id: number, userName: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id, userName },
        relations: ['roles'],
      });
      if (user) return user;
      else this.handleFindOneNotFoundError();
    } catch (e) {
      this.handleFindOneError(e);
    }
  }

  /**
   * 通过 id查询用户
   * @date 2023/9/5 - 10:48:11
   * @author Peng
   *
   * @async
   * @param {number} id
   * @returns {Promise<User | null>}
   */
  async findOneById(id: number): Promise<User> {
    try {
      const { password, ...user } = await this.userRepository.findOne({ where: { id } });
      if (user) return user as User;
      else this.handleFindOneNotFoundError();
    } catch (e) {
      this.handleFindOneError(e);
    }
  }

  /**
   * 处理查询单个用户抛出的错误
   * @date 2023/9/8 - 11:31:22
   * @author Peng
   *
   * @param {*} e
   */
  handleFindOneError(e) {
    if (e instanceof NotFoundException) throw e;
    else if (e instanceof UnauthorizedException) throw e;
    else
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '查询用户失败',
      });
  }

  /**
   * 处理查询未找到错误
   * @date 2023/9/8 - 14:51:11
   * @author Peng
   *
   * @param {?*} [e]
   */
  handleFindOneNotFoundError(e?) {
    if (e instanceof NotFoundException) throw e;
    throw new NotFoundException({ code: ApiResponseCodeEnum.NOTFOUND_USER });
  }
}
