import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllPermissionDto } from './dto';
import { ParseIntParamPipe } from '@/common/pipe';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { Response } from 'express';
@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: '创建权限' })
  create(@Body() data: CreatePermissionDto) {
    console.log('data ------', data);
    return this.permissionService.create(data);
  }

  @Get()
  @ApiOperation({ summary: '获取权限' })
  async findAll(@Query() query: FindAllPermissionDto) {
    const { list: data, total } = await this.permissionService.findAll(query);
    const list = query.queryStr ? data : this.permissionService.handlePermissionResponse(data);
    return { list, total };
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改权限信息' })
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdatePermissionDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const updateRes = await this.permissionService.update(id, data);
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新权限信息失败!') && (res.success = false);

    return updateRes ? '更新权限信息成功!' : '操作失败!';
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.permissionService.remove(+id);
  }
}
