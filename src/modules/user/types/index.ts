import { Role } from '@/modules/role/entities';

export interface User {
  id: number;
  userName: string;
  // password: string
  roles: Role[];
  email: string | null;
  nickName: string | null;
  userEnabled: number;
  userAvatar: string | null;
  createTime: string | Date;
  updateTime: string | Date;
}
