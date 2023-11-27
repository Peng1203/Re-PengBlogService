import { Article, TimestampedEntity } from '@/common/entities';
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'tag' })
@Unique(['tagName'])
export class Tag extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('index_tag_name')
  @Column({ name: 'tag_name', type: 'varchar', unique: true })
  tagName: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @ManyToMany(() => Article, (Article) => Article.tags)
  articles: Article[];
}
