import { TimestampedEntity } from '@/common/entities';
import { Permission } from '@/modules/permission/entities';
import { User } from '@/modules/user/entities';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'role' })
@Unique(['roleName'])
export class Role extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index('index_role_name')
  @Column({ name: 'role_name', type: 'varchar' })
  readonly roleName: string;

  @ManyToMany(() => User, (user) => user.roles)
  readonly users: User[];

  @ManyToMany(() => Permission, (Permission) => Permission.roles)
  @JoinTable({ name: 'role_permission_relation' })
  readonly permissions: Permission[];

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  readonly description: string;
}
