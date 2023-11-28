import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionEnum } from '@/helper/enums';
import { RequirePermissions } from '@/common/decorators';

@ApiTags('Tag')
@ApiBearerAuth()
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: '添加文章标签' })
  @RequirePermissions(PermissionEnum.CREATE_TAG)
  create(@Body() data: CreateTagDto) {
    return this.tagService.create(data);
  }

  @Get()
  @ApiOperation({ summary: '查询文章标签' })
  findAll() {
    return this.tagService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新文章标签' })
  @RequirePermissions(PermissionEnum.UPDATE_TAG)
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章标签' })
  @RequirePermissions(PermissionEnum.DELETE_TAG)
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
