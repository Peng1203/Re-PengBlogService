import { Menu } from '@/common/entities';

export type MenuItem = Menu & { children?: Menu[] };
