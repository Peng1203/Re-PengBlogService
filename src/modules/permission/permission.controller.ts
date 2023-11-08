import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllPermissionDto } from './dto';

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
    const list = this.permissionService.handlePermissionResponse(data);
    return { list, total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
