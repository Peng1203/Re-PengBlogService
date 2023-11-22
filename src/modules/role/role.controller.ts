import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllRoleDto } from './dto';
import { ParseIntParamPipe } from '@/common/pipe';

@ApiTags('Role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data);
  }

  @Get()
  @ApiOperation({ summary: '查询角色' })
  findAll(@Query() query: FindAllRoleDto) {
    return this.roleService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '通过ID查询角色' })
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新角色信息' })
  update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateRoleDto,
  ) {
    return this.roleService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.roleService.remove(+id);
  }
}
