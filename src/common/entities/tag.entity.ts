import { Article, TimestampedEntity, User } from './'
import { Column, Entity, Index, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

// @Unique(['tagName'])
@Entity({ name: 'tag' })
export class Tag extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('index_tag_name')
  @Column({ name: 'tag_name', type: 'varchar' })
  tagName: string

  @Column({ type: 'varchar', nullable: true })
  icon: string

  @ManyToMany(() => Article, Article => Article.tags)
  articles: Article[]

  @ManyToOne(() => User, User => User.tags, { nullable: true })
  user: User
}
