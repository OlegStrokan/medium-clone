import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IArticle } from 'src/interfaces/IArticle'
import { IArticleTag } from 'src/interfaces/IArticleTag'
import { IArticleUser } from 'src/interfaces/IArticleUser'
import { MessageEnum } from 'src/interfaces/message-enums/message.enum'
import { CreateArticleDto } from 'src/interfaces/request-dtos/create-article.dto'
import { DeleteArticleDto } from 'src/interfaces/request-dtos/delete-article.dto'
import { UpdateArticleDto } from 'src/interfaces/request-dtos/update-article.dto'
import { ArticleDto } from 'src/interfaces/response-dtos/article.dto'
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
			await this.articleRepository.save(article)

			const articleRelation = await this.articleUserRepository.create({
				userId: dto.userId,
				articleId: article.id,
			})

			await this.articleUserRepository.save(articleRelation)

			const response = await this.searchHelper(article.title, 'title')
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
	): Promise<ResponseDto<IArticle>> {
		const article = await this.searchHelper(dto.id, 'id')

		if (!article) {
			return {
				status: HttpStatus.NOT_FOUND,
				message: MessageEnum.ARTICLE_NOT_FOUND_ID,
				data: null,
			}
		}

		if (dto.updatingUserId !== article.ownerId) {
			return {
				status: HttpStatus.FORBIDDEN,
				message: MessageEnum.UPDATE_FORBIDDEN,
				data: null,
			}
		}

		await this.articleRepository.update(dto.id, dto)

		const updatedArticle = await this.searchHelper(dto.title, 'title')

		return {
			status: HttpStatus.OK,
			message: MessageEnum.ARTICLE_UPDATED,
			data: updatedArticle,
		}
	}

	public async deleteArticle(
		dto: DeleteArticleDto
	): Promise<ResponseDto<void>> {
		try {
			const article = await this.searchHelper(dto.id, 'id')

			if (!article) {
				return {
					status: HttpStatus.NOT_FOUND,
					message: MessageEnum.ARTICLE_NOT_FOUND_ID,
					data: null,
				}
			}

			if (dto.deletingUserId !== article.ownerId) {
				return {
					status: HttpStatus.FORBIDDEN,
					message: MessageEnum.UPDATE_FORBIDDEN,
					data: null,
				}
			}

			await this.articleRepository.delete(article.id)

			const relations = await this.articleUserRepository.findBy({
				userId: dto.deletingUserId,
			})

			const articlePromises = relations.map(async (relation) => {
				return await this.articleUserRepository.delete(relation)
			})

			await Promise.all(articlePromises)

			return {
				status: HttpStatus.NO_CONTENT,
				message: MessageEnum.ARTICLE_DELETED,
				data: null,
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

	public async getArticle(): Promise<ResponseDto<void>> {}

	public async getArticleForUser(): Promise<ResponseDto<void>> {}

	public async getUsersArticle(): Promise<ResponseDto<void>> {}

	private async searchHelper(
		value: string,
		field: string
	): Promise<IArticle | undefined> {
		return await this.articleRepository.findOne({
			where: { [field]: value },
		})
	}

	private static async mapAtricleDto(dto): Promise<ArticleDto> {
		return {
			title: dto.title,
			description: dto.description,
			body: dto.body,
		}
	}
}
