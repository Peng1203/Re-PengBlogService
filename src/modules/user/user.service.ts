import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto';
import { User } from './entities';
import { ListResponse } from '@/common/interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
  //
  async findAll(params: FindAllUserDto): Promise<ListResponse<User>> {
    const { page, pageSize, queryStr = '', column, order } = params;
    const [list, total] = await this.userRepository.findAndCount({
      where: {
        userName: Like(`%${queryStr}%`),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { [column]: order },
      relations: ['role'],
    });
    return { list, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
