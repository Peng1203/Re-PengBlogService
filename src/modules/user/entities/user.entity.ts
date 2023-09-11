import { TimestampedEntity } from '@/common/entities';
import { UserEnabledEnum } from '@/helper/enums';
import { Role } from '@/modules/role/entities';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'user' })
@Unique(['userName', 'email'])
export class User extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index('index_user_name')
  @Column({ name: 'user_name', type: 'varchar', length: 15 })
  readonly userName: string;

  @Column({ type: 'varchar', length: 255 })
  readonly password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_role_relation' })
  readonly roles: Role[];

  @Index('index_email')
  @Column({ type: 'varchar', nullable: true })
  readonly email: string;

  @Column({ name: 'nick_name', type: 'varchar', nullable: true })
  readonly nickName: string;

  @Column({
    name: 'user_enabled',
    type: 'enum',
    enum: UserEnabledEnum,
    default: UserEnabledEnum.Enabled,
    comment: '0 禁用 1 启用',
  })
  readonly userEnabled: UserEnabledEnum;

  @Column({ name: 'user_avatar', type: 'varchar', nullable: true })
  readonly userAvatar: string;
}
