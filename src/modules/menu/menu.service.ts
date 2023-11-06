import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '@/common/entities';
import { Like, Repository } from 'typeorm';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { FindAllMenuDto } from './dto';
import { MenuItem } from './types';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>) {}

  async create(data: CreateMenuDto) {
    try {
      const menu = await this.menuRepository.create(data);
      return await this.menuRepository.save(menu);
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '添加菜单失败',
      });
    }
  }

  async findAll(query: FindAllMenuDto) {
    try {
      const { queryStr = '', column, order } = query;

      const [list, total] = await this.menuRepository.findAndCount({
        where: [{ menuName: Like(`%${queryStr}%`) }, { menuPath: Like(`%${queryStr}%`) }],
        order: { [column || 'id']: order || 'ASC' },
      });
      return { list, total };
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询菜单列表失败!',
      });
    }
  }

  handleMenusResponse(menus: Menu[]): MenuItem[] {
    const menuData: Menu[] = JSON.parse(JSON.stringify(menus));
    const formatMenu = this.formatTreeMenu(menuData);
    this.handleOrderNumMenuData(formatMenu);
    return formatMenu;
  }

  formatTreeMenu(ary: MenuItem[], parentId?: number) {
    return ary
      .filter((item) =>
        // 如果没有父id（第一次递归的时候）将所有父级查询出来
        parentId === undefined ? item.parentId === 0 : item.parentId === parentId,
      )
      .map((item) => {
        // 通过父节点ID查询所有子节点
        item.children = this.formatTreeMenu(ary, item.id);
        return item;
      });
  }

  private handleOrderNumMenuData(menus: MenuItem[]) {
    menus.sort((a, b) => a.orderNum - b.orderNum);
    menus.forEach((menu) => {
      if (!menu.children || !menu.children.length) return;
      this.handleOrderNumMenuData(menu.children);
    });
  }

  async findOne(id: number) {
    try {
      return await this.menuRepository.findOne({ where: { id } });
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询菜单失败',
      });
    }
  }

  update(id: number, data: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  async remove(id: number) {
    try {
      const delResult = await this.menuRepository.delete(id);
      return !!delResult.affected;
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除菜单失败',
      });
    }
  }

  /**
   * 判断当前菜单是否有子菜单
   */
  async menuHasChildren(id: number): Promise<boolean> {
    try {
      const [list] = await this.menuRepository.findAndCount();
      return list.some((menu) => menu.parentId === id);
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询菜单失败',
      });
    }
  }
}
