import { Article, TimestampedEntity } from './';
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'tag' })
@Unique(['tagName'])
export class Tag extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('index_tag_name')
  @Column({ name: 'tag_name', type: 'varchar' })
  tagName: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @ManyToMany(() => Article, Article => Article.tags)
  articles: Article[];
}
