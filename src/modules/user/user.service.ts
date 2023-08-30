import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto';
import { User } from './entities';
import { ListResponse } from '@/common/interface';
import { ApiResponseCodeEnum } from '@/helper/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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
      const { page, pageSize, queryStr = '', column, order } = params;
      const [list, total] = await this.userRepository.findAndCount({
        where: [
          { userName: Like(`%${queryStr}%`) },
          { nickName: Like(`%${queryStr}%`) },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { [column]: order },
        relations: ['role'],
      });
      return { list, total };
    } catch (e) {
      throw new InternalServerErrorException({ e, code: ApiResponseCodeEnum.INTERNALSERVERERROR })
    }
  }

  findOne(id?: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
  async findOneByUserNameAndPwd(userName: string, password: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { userName, password },
        relations: ['role'],
      })
    } catch (e) {
      throw new InternalServerErrorException({ code: ApiResponseCodeEnum.INTERNALSERVERERROR })
    }
  }
}
