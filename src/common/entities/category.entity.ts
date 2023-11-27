import { Article, TimestampedEntity } from '@/common/entities';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'category' })
@Unique(['categoryName'])
export class Category extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('index_c_name')
  @Column({ name: 'category_name', type: 'varchar', unique: true })
  categoryName: string;

  @OneToMany(() => Article, (Article) => Article.category)
  articles: Article[];
}
