import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	Repository,
	ManyToMany,
	JoinTable,
} from 'typeorm'
import { InteractionEntity } from './interaction.entity'
import { TagEntity } from './tag.entity'

export interface IArticleCreationAttributes {
	title: string
	description: string
	body: string
}

@Entity('articles')
export class ArticleEntity
	extends Repository<ArticleEntity>
	implements IArticleCreationAttributes
{
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@Column({ nullable: true })
	description: string

	@Column()
	body: string

	@OneToMany(() => InteractionEntity, (interaction) => interaction.article)
	interactions: InteractionEntity[]

	@ManyToMany(() => TagEntity, (tag) => tag.articles)
	@JoinTable({ name: 'tags' })
	tags: TagEntity[]
}
