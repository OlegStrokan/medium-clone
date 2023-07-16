import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Repository,
	ManyToMany,
} from 'typeorm'
import { ArticleEntity } from './article.entity'

export interface ITagCreationAttributes {
	name: string
}

@Entity('tags')
export class TagEntity
	extends Repository<TagEntity>
	implements ITagCreationAttributes
{
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@ManyToMany(() => ArticleEntity, (article) => article.tags)
	articles: ArticleEntity[]
}
