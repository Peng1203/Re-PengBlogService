import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, FindAllUserDto } from './dto';
import { UpdateUserDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { User } from './types';
import { ListResponse } from '@/common/interface';
import { Public, Roles } from '@/common/decorators';
import { RoleEnum } from '@/helper/enums';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Get()
  @Roles(RoleEnum.ADMINISTRATOR, RoleEnum.USER)
  @ApiOperation({ summary: '查询全部用户' })
  async findAll(@Query() query: FindAllUserDto): Promise<ListResponse<User>> {
    const { list: data, total } = await this.usersService.findAll(query);
    const list: User[] = data.map(({ password, ...user }) => ({
      ...user,
    }));
    return { list, total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id/:aid')
  @ApiParam({ name: 'id', description: '用户ID', type: 'string' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
