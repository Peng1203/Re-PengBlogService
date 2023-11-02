import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, FindAllMenuDto } from './dto';
import { UpdateMenuDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Menu')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '添加菜单' })
  create(@Body() data: CreateMenuDto) {
    return this.menuService.create(data);
  }

  @Get()
  @ApiOperation({ summary: '查询菜单' })
  async findAll(@Query() query: FindAllMenuDto) {
    const { list, total } = await this.menuService.findAll(query);
    const menu = this.menuService.handleMenusResponse(list);
    return { total, list: menu };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
