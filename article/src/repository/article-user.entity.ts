import { Entity, PrimaryGeneratedColumn, Column, Repository } from 'typeorm'

export interface IArticleUserCreationAttributes {
	articleId: string
	userId: string
}

@Entity('article_user')
export class ArticleUserEntity
	extends Repository<ArticleUserEntity>
	implements IArticleUserCreationAttributes
{
	@PrimaryGeneratedColumn()
	id: string

	@Column({ nullable: false })
	articleId: string

	@Column({ nullable: false })
	userId: string
}
