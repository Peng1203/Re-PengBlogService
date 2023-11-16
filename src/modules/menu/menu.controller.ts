import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  ConflictException,
  Res,
  Put,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, FindAllMenuDto } from './dto';
import { UpdateMenuDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseIntParamPipe } from '@/common/pipe';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { Response } from 'express';
import { Menu } from '@/common/entities';
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
    const menu = query.queryStr ? list : this.menuService.handleMenusResponse(list);
    return { total, list: menu };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单信息' })
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateMenuDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const updateRes = await this.menuService.update(id, data);

    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新菜单失败!') && (res.success = false);

    return updateRes ? '更新菜单成功!' : '操作失败!';
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  async remove(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const menu = await this.menuService.findOne(id);

    // 判断当前删除的菜单是否包含子菜单
    const isHave = await this.menuService.menuHasChildren((menu as Menu).id);
    if (isHave)
      throw new ConflictException({
        code: ApiResponseCodeEnum.CONFLICT,
        msg: '删除失败，请先处理相关的子菜单',
      });

    const delResult = await this.menuService.remove(id);
    if (!delResult) res.resMsg = '删除菜单失败!';
    if (!delResult) res.success = false;
    else return '删除菜单成功';
  }
}
