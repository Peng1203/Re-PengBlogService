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
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, DeleteUsersDto, FindAllUserDto } from './dto';
import { UpdateUserDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '@/common/decorators';
import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums';
import { ParseIntParamPipe } from '@/common/pipe';
import { Response, Request } from 'express';
import { UploadAvaterAggregation } from './decorator';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}

  @Post()
  @RequirePermissions(PermissionEnum.CREATE_USER)
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  // @Roles(RoleEnum.ADMINISTRATOR, RoleEnum.USER)
  @Get()
  @ApiOperation({ summary: '查询用户' })
  async findAll(@Query() query: FindAllUserDto) {
    const { list, total } = await this.userService.findAll(query);
    return { list, total };
  }

  @Get(':id')
  @ApiOperation({ summary: '通过ID查询用户' })
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionEnum.UPDATE_USER)
  @ApiOperation({ summary: '更新用户信息' })
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.userService.update(id, data);
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
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.userService.update(id, data);
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
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.userService.findOneById(id).catch(() => false);
    if (!user)
      throw new NotFoundException({
        code: ApiResponseCodeEnum.NOTFOUND_USER,
        msg: '删除失败，未找到相关用户信息',
      });
    const delResult = await this.userService.remove(id);
    if (!delResult) res.resMsg = '删除用户失败!';
    if (!delResult) res.success = false;
    else return '删除用户成功';
  }

  @Delete()
  @RequirePermissions(PermissionEnum.DELETE_USER)
  @ApiOperation({ summary: '通过ID批量删除用户' })
  async removes(@Body() data: DeleteUsersDto) {
    const delCount = await this.userService.handleBatchRemove(data.ids);
    return `成功删除${delCount}个用户`;
  }

  @Post('avater/:id')
  @UploadAvaterAggregation()
  async uploadAvater(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number
  ) {
    const RESOURCE_SERVE = this.configService.get<string>('STATIC_RESOURCE_SERVE');
    const fullPath = `${req.protocol}://${RESOURCE_SERVE}/${path.basename(file.path)}`;

    await this.userService.update(id, { userAvatar: fullPath });

    res.resMsg = '头像更新成功!';
    return fullPath;
  }
}
