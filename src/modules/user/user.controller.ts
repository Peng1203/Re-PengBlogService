import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, FindAllUserDto } from './dto';
import { UpdateUserDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { UserData } from './types';
import { Roles, ReqUser } from '@/common/decorators';
import { RoleEnum } from '@/helper/enums';
import { User } from './entities';
import { Role } from '../role/entities';
import { ParseFloatParamPipe, ParseIntParamPipe } from '@/common/pipe';

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
  async findAll(@Query() query: FindAllUserDto, @ReqUser() user: User, @ReqUser('roles') roles: Role[]) {
    console.log('ReqUser ----->', user);
    console.log('roles ----->', roles);

    const { list: data, total } = await this.usersService.findAll(query);
    const list: UserData[] = data.map(({ password, ...user }) => user);
    return { list, total };
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.usersService.findOneById(id);
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
