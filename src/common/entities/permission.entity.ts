import { TimestampedEntity } from '@/common/entities';
// import { ActionTypeEnum } from '@/helper/enums';
import { Role } from './';
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { RequestMethodEnum } from '@/helper/enums/request.method';
import { PermissionEnum } from '@/helper/enums/permission';

@Entity({ name: 'permission' })
@Unique(['permissionName'])
@Unique(['permissionCode'])
export class Permission extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index('index_permission_name')
  @Column({ name: 'permission_name', type: 'varchar', length: 15 })
  readonly permissionName: string;

  @Index('index_permission_code')
  @Column({
    name: 'permission_code',
    type: 'enum',
    enum: PermissionEnum,
    nullable: true,
  })
  readonly permissionCode: PermissionEnum | null;

  // @Column({ type: 'enum', enum: ActionTypeEnum })
  // readonly action_type: ActionTypeEnum;

  @Column({
    name: 'resource_method',
    type: 'enum',
    enum: RequestMethodEnum,
    // default: RequestMethodEnum.GET,
    nullable: true,
  })
  readonly resourceMethod: RequestMethodEnum | null;

  @Column({ name: 'resource_url', type: 'varchar', nullable: true })
  readonly resourceUrl: string | null;

  @Column({ name: 'parent_id', type: 'int', default: 0 })
  readonly parentId: number;

  @Column({ type: 'varchar', length: 60, nullable: true })
  readonly description: string;

  @ManyToMany(() => Role, (Role) => Role.permissions)
  readonly roles: Role[];
}
