import { Entity, PrimaryGeneratedColumn, Column, Repository } from 'typeorm'

export interface IArticleTagCreationAttributes {
	articleId: string
	tagId: string
}

@Entity('article_tag')
export class ArticleTagEntity
	extends Repository<ArticleTagEntity>
	implements IArticleTagCreationAttributes
{
	@PrimaryGeneratedColumn()
	id: string

	@Column({ nullable: false })
	articleId: string

	@Column({ nullable: false })
	tagId: string
}
