import { TimestampedEntity } from '@/common/entities';
import { ActionTypeEnum } from '@/helper/enums';

import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'permission' })
@Unique(['permissionName', 'permissionCode'])
export class Permission extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index('index_permission_name')
  @Column({ name: 'permission_name', type: 'varchar', length: 15 })
  readonly permissionName: string;

  @Index('index_permission_code')
  @Column({ name: 'permission_code', type: 'varchar', length: 20 })
  readonly permissionCode: string;

  @Column({ type: 'enum', enum: ActionTypeEnum })
  readonly type: ActionTypeEnum;

  @Column({ name: 'description', type: 'varchar', length: 60, nullable: true })
  readonly description: string;
}
