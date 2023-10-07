import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, DeleteUsersDto, FindAllUserDto } from './dto';
import { UpdateUserDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { UserData } from './types';
import { Roles, ReqUser } from '@/common/decorators';
import { ApiResponseCodeEnum, RoleEnum } from '@/helper/enums';
import { User, Role } from '@/common/entities';
import { ParseIntParamPipe } from '@/common/pipe';
import { Response } from 'express';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() data: CreateUserDto) {
    const { password, ...user } = await this.usersService.create(data);
    return user;
  }

  @Get()
  @Roles(RoleEnum.ADMINISTRATOR, RoleEnum.USER)
  @ApiOperation({ summary: '查询用户' })
  async findAll(
    @Query() query: FindAllUserDto,
    @ReqUser() user: User,
    @ReqUser('roles') roles: Role[],
  ) {
    const { list: data, total } = await this.usersService.findAll(query);
    const list: UserData[] = data.map(({ password, ...user }) => user);
    return { list, total };
  }

  @Get(':id')
  @ApiOperation({ summary: '通过ID查询用户' })
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id/:aid')
  @ApiParam({ name: 'id', description: '用户ID', type: 'string' })
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '通过ID删除用户' })
  async remove(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.findOneById(id).catch(() => false);
    if (!user)
      throw new NotFoundException({
        code: ApiResponseCodeEnum.NOTFOUND_USER,
        msg: '删除失败，未找到相关用户信息',
      });
    const delResult = await this.usersService.remove(id);
    if (!delResult) res.resMsg = '删除用户失败!';
    if (!delResult) res.success = false;
    else return '删除用户成功';
  }

  @Delete()
  @ApiOperation({ summary: '通过ID批量删除用户' })
  async removes(@Body() data: DeleteUsersDto) {
    const delCount = await this.usersService.handleBatchRemove(data.ids);
    return `成功删除${delCount}个用户`;
  }
}
