import { Article, TimestampedEntity } from './'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity({ name: 'category' })
@Unique(['categoryName'])
export class Category extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('index_c_name')
  @Column({ name: 'category_name', type: 'varchar' })
  categoryName: string

  @OneToMany(() => Article, Article => Article.category)
  articles: Article[]
}
