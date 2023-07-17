import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IArticle } from 'src/interfaces/IArticle'
import { IArticleTag } from 'src/interfaces/IArticleTag'
import { IArticleUser } from 'src/interfaces/IArticleUser'
import { MessageEnum } from 'src/interfaces/message-enums/message.enum'
import { CreateArticleDto } from 'src/interfaces/request-dtos/create-article.dto'
import { DeleteArticleDto } from 'src/interfaces/request-dtos/delete-article.dto'
import { UpdateArticleDto } from 'src/interfaces/request-dtos/update-article.dto'
import { ArticlePreviewDto } from 'src/interfaces/response-dtos/article-preview.dto'
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
		try {
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
		} catch (e) {
			return {
				status: HttpStatus.PRECONDITION_FAILED,
				message: MessageEnum.PRECONDITION_FAILED,
				data: null,
				errors: e,
			}
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

	public async getArticle(id: string): Promise<ResponseDto<IArticle>> {
		try {
			const article = await this.searchHelper(id, 'id')

			if (!article) {
				return {
					status: HttpStatus.NOT_FOUND,
					message: MessageEnum.ARTICLE_NOT_FOUND_ID,
					data: null,
				}
			}
			return {
				status: HttpStatus.OK,
				message: MessageEnum.ARTICLE_SEARCH_OK,
				data: article,
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

	public async getArticles(): Promise<ResponseDto<ArticlePreviewDto[]>> {
		try {
			const articles = await this.articleRepository.find()

			let previewedArticles: ArticlePreviewDto[] = []
			articles?.map(async (article: IArticle) => {
				const previewedArticle = await ArticleService.mapArticlePreview(
					article
				)
				previewedArticles.push(previewedArticle)
			})

			return {
				status: HttpStatus.OK,
				message: MessageEnum.ARTICLE_SEARCH_OK,
				data: previewedArticles,
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

	public async getArticleForUser(): Promise<ResponseDto<null>> {
		return {
			status: HttpStatus.NOT_FOUND,
			message: 'NOT_IMPLEMENTED',
			data: null,
		}
	}

	public async getUsersArticle(
		userId: string
	): Promise<ResponseDto<IArticle[]>> {
		try {
			const relation = await this.articleUserRepository.findBy({
				userId,
			})

			const articlePromises = relation.map(async (article) => {
				return await this.searchHelper(article.articleId, 'id')
			})

			const articles = await Promise.all(articlePromises)

			return {
				status: HttpStatus.OK,
				message: MessageEnum.ARTICLE_SEARCH_OK,
				data: articles,
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

	private async searchHelper(
		value: string,
		field: string
	): Promise<IArticle | undefined> {
		return await this.articleRepository.findOne({
			where: { [field]: value },
		})
	}

	private static async mapArticlePreview(
		dto: IArticle
	): Promise<ArticlePreviewDto> {
		return {
			id: dto.id,
			title: dto.title,
			description: dto.description,
		}
	}
}
