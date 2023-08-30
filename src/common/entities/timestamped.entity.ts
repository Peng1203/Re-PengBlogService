import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import day from '@/utils/date.util';

class DateTimeTransformer implements ValueTransformer {
  to(value: Date): Date | string {
    return value;
  }

  from(value: string): Date | string {
    return day(value).format('YYYY-MM-DD HH:mm:ss');
  }
}

@Entity()
export class TimestampedEntity {
  @CreateDateColumn({
    name: 'create_time',
    type: 'datetime',
    transformer: new DateTimeTransformer(),
  })
  readonly createTime: Date | string;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'datetime',
    transformer: new DateTimeTransformer(),
  })
  readonly updateTime: Date | string;
}