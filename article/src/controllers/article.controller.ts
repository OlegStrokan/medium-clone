import { Controller, Get } from '@nestjs/common'
import { ArticleService } from '../services/article.service'

@Controller()
export class ArticleContoller {
	constructor(private readonly appService: ArticleService) {}

	getHello(): string {
		return this.appService.getHello()
	}
}
