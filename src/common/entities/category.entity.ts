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

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true, default: '' })
  description: string

  @OneToMany(() => Article, Article => Article.category)
  articles: Article[]
}
