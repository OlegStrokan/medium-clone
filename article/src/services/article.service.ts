import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IArticle } from 'src/interfaces/IArticle'
import { IArticleTag } from 'src/interfaces/IArticleTag'
import { IArticleUser } from 'src/interfaces/IArticleUser'
import { MessageEnum } from 'src/interfaces/message-enums/message.enum'
import { CreateArticleDto } from 'src/interfaces/request-dtos/create-article.dto'
import { DeleteArticleDto } from 'src/interfaces/request-dtos/delete-article.dto'
import { UpdateArticleDto } from 'src/interfaces/request-dtos/update-article.dto'
import { ResponseDto } from 'src/interfaces/response-dtos/response.dto'
import { ArticleTagEntity } from 'src/repository/article-tag.entity'
import { ArticleUserEntity } from 'src/repository/article-user.entity'
import { ArticleEntity } from 'src/repository/article.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ArticleService {
	private readonly logger: Logger

	constructor(
		@InjectRepository(ArticleEntity)
		private readonly articleRepository: Repository<IArticle>,
		@InjectRepository(ArticleUserEntity)
		private readonly articleUserRepository: Repository<IArticleUser>,
		@InjectRepository(ArticleTagEntity)
		private readonly articleTagRepostitory: Repository<IArticleTag>
	) {
		this.logger = new Logger(ArticleService.name)
	}
	public async createArticle(
		dto: CreateArticleDto
	): Promise<ResponseDto<IArticle>> {
		try {
			const article = await this.articleRepository.create({ ...dto })
			this.articleRepository.save(article)

			const response = await this.getArticleByTitle(article.title)
			return {
				status: HttpStatus.CREATED,
				message: MessageEnum.ARTICLE_CREATED,
				data: response,
			}
		} catch (e) {
			return {
				status: HttpStatus.PRECONDITION_FAILED,
				message: MessageEnum.PRECONDITION_FAILED,
				data: null,
				errors: e,
			}
		}
	}

	public async updateArticle(
		dto: UpdateArticleDto
	): Promise<ResponseDto<void>> {}

	public async deleteArticle(
		dto: DeleteArticleDto
	): Promise<ResponseDto<void>> {}

	public async getArticle(): Promise<ResponseDto<void>> {}

	public async getArticleForUser(): Promise<ResponseDto<void>> {}

	public async getUsersArticle(): Promise<ResponseDto<void>> {}

	private async getArticleByTitle(title: string): Promise<IArticle> {
		return await this.articleRepository.findOneBy({ title })
	}
}
