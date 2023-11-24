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
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, DeleteUsersDto, FindAllUserDto } from './dto';
import { UpdateUserDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { UserData } from './types';
import { Roles, ReqUser, RequirePermissions } from '@/common/decorators';
import { ApiResponseCodeEnum, PermissionEnum, RoleEnum } from '@/helper/enums';
import { User, Role } from '@/common/entities';
import { ParseIntParamPipe } from '@/common/pipe';
import { Response } from 'express';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @RequirePermissions(PermissionEnum.CREATE_USER)
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() data: CreateUserDto) {
    const { password, ...user } = await this.usersService.create(data);
    return user;
  }

  // @Roles(RoleEnum.ADMINISTRATOR, RoleEnum.USER)
  @Get()
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

  @Patch(':id')
  @RequirePermissions(PermissionEnum.UPDATE_USER)
  @ApiOperation({ summary: '更新用户信息' })
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const updateRes = await this.usersService.update(id, data);
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新用户失败!') && (res.success = false);

    return updateRes || '操作失败!';
  }

  @Put(':id')
  @RequirePermissions(PermissionEnum.UPDATE_USER)
  @ApiOperation({ summary: '批量更新用户信息' })
  async updateBatch(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const updateRes = await this.usersService.update(id, data);
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新用户失败!') && (res.success = false);

    return updateRes || '操作失败!';
  }

  @Delete(':id')
  @RequirePermissions(PermissionEnum.DELETE_USER)
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
  @RequirePermissions(PermissionEnum.DELETE_USER)
  @ApiOperation({ summary: '通过ID批量删除用户' })
  async removes(@Body() data: DeleteUsersDto) {
    const delCount = await this.usersService.handleBatchRemove(data.ids);
    return `成功删除${delCount}个用户`;
  }

  @Post('avater/:id')
  @ApiOperation({ summary: '上传用户头像' })
  uploadAvater() {
    return '上传用户头像';
  }
}
