import { TimestampedEntity } from '@/common/entities';
import { UserEnabledEnum } from '@/helper/enums';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'user' })
@Unique(['userName'])
export class User extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index('index_user_name')
  @Column({ name: 'user_name', type: 'varchar', length: 15 })
  readonly userName: string;

  @Column({ type: 'varchar', length: 255 })
  readonly password: string;

  // @ManyToOne(() => Role, (role) => role.id)
  // @JoinColumn()
  // readonly role: Role;

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
  readonly userEnabled: number;

  @Column({ name: 'user_avatar', type: 'varchar', nullable: true })
  readonly userAvatar: string;
}
